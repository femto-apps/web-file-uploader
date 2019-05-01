const session = require('express-session')
const cookieParser = require('cookie-parser')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const Multer = require('multer')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const config = require('@femto-apps/config')
const minioStorage = require('@femto-apps/multer-minio')
const authenticationConsumer = require('@femto-apps/authentication-consumer')

;(async () => {
    const app = express()
    const port = config.get('port')

    const multer = Multer({
        storage: minioStorage({
            minio: {
                endPoint: config.get('minio.host'),
                port: config.get('minio.port'),
                useSSL: false,
                accessKey: config.get('minio.accessKey'),
                secretKey: config.get('minio.secretKey')
            },
            bucket: (req, file) => 'items',
            folder: (req, file) => 'test_dir/',
            filename: (req, file) => 'test.png'
        }),
        limits: { fileSize: 8589934592 }
    }).single('upload')

    mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), { useNewUrlParser: true })
    mongoose.set('useCreateIndex', true)

    app.set('view engine', 'pug')

    app.use(express.static('public'))
    app.use(morgan('dev'))
    app.use(cookieParser(config.get('cookie.secret')))
    app.use(session({
        store: new RedisStore({
            host: config.get('redis.host'),
            port: config.get('redis.port')
        }),
        secret: config.get('session.secret'),
        resave: false,
        saveUninitialized: false,
        name: config.get('cookie.name'),
        cookie: {
            maxAge: config.get('cookie.maxAge')
        }
    }))

    app.use(authenticationConsumer({
        tokenService: { endpoint: config.get('tokenService.endpoint') },
        authenticationProvider: { endpoint: config.get('authenticationProvider.endpoint'), consumerId: config.get('authenticationProvider.consumerId') },
        authenticationConsumer: { endpoint: config.get('authenticationConsumer.endpoint') },
        redirect: config.get('redirect')
    }))

    app.use((req, res, next) => {
        const links = []

        if (req.user) {
            links.push({ title: 'Logout', href: res.locals.auth.getLogout(`${req.protocol}://${req.get('host')}${req.originalUrl}`) })

            res.locals.user = req.user.users[0]
        } else {
            links.push({ title: 'Login', href: res.locals.auth.getLogin(`${req.protocol}://${req.get('host')}${req.originalUrl}`) })
        }

        res.locals.nav = {
            title: 'Femto Uploader',
            links
        }

        next()
    })

    app.get('/', (req, res) => {
        res.render('home', {
            page: { title: `Home :: ${config.get('title.suffix')}` },
        })
    })

    app.post('/upload/multipart', multer, (req, res) => {
        console.log(req.file)
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}`))
})()
