const session = require('express-session')
const cookieParser = require('cookie-parser')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const Multer = require('multer')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const uuidv4 = require('uuid/v4')
const config = require('@femto-apps/config')
const authenticationConsumer = require('@femto-apps/authentication-consumer')

const Collection = require('./modules/Collection')
const minioStorage = require('./modules/MinioMulterStorage')

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
            folder: async (req, file) => {
                if (req.user) {
                    return (await Collection.fromUser(req.user)).path
                }

                const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress || 
                    req.connection.socket.remoteAddress
                
                return (await Collection.fromIp(ip)).path
            },
            filename: async (req, file) => {
                return uuidv4()
            }
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

            res.locals.user = req.user
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
        console.log(req.user)
        res.render('home', {
            page: { title: `Home :: ${config.get('title.suffix')}` },
        })
    })

    app.post('/upload/multipart', multer, (req, res) => {
        console.log(req.file)

        res.json({ hello: 'hi' })
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}`))
})()
