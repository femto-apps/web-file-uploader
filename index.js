const session = require('express-session')
const cookieParser = require('cookie-parser')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const Multer = require('multer')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const uuidv4 = require('uuid/v4')
const toArray = require('stream-to-array')
const config = require('@femto-apps/config')
const compression = require('compression')
const authenticationConsumer = require('@femto-apps/authentication-consumer')

const Types = require('./types')
const Item = require('./modules/Item')
const Short = require('./modules/Short')
const User = require('./modules/User')
const Store = require('./modules/Store')
const Collection = require('./modules/Collection')
const Utils = require('./modules/Utils')
const minioStorage = require('./modules/MinioMulterStorage')

const { wrap } = require('./modules/Profiling')

function ignoreAuth(req, res) {
    return req.originalUrl.startsWith('/thumb/')
}

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
                return (await Collection.fromReq(req)).path
            },
            filename: async (req, file) => {
                return uuidv4()
            }
        }),
        limits: { fileSize: 8589934592 }
    }).single('upload')

    mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    app.set('view engine', 'pug')
    app.disable('x-powered-by')

    app.use(wrap(morgan('dev')))
    app.use(wrap(compression()))
    app.use(wrap(bodyParser.json()))
    app.use(wrap(cookieParser(config.get('cookie.secret'))))
    app.use(wrap(function sess(req, res, next) {
        // if we don't need req.user, ignore it.
        if (ignoreAuth(req, res)) {
            return next()
        }

        session({
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
        })(req, res, next)
    }))

    app.use(wrap(function authConsumer(req, res, next) {
        // if we don't need req.user, ignore it.
        if (ignoreAuth(req, res)) {
            return next()
        }

        authenticationConsumer({
            tokenService: { endpoint: config.get('tokenService.endpoint') },
            authenticationProvider: { endpoint: config.get('authenticationProvider.endpoint'), consumerId: config.get('authenticationProvider.consumerId') },
            authenticationConsumer: { endpoint: config.get('authenticationConsumer.endpoint') },
            redirect: config.get('redirect')
        })(req, res, next)
    }))

    app.use(wrap(async function fromUser(req, res, next) {
        // if we don't need req.user, ignore it.
        if (ignoreAuth(req, res)) {
            return next()
        }

        if (req.user) {
            req.user = await User.fromUserCached(req.user)
        }

        if (req.body && req.body.apiKey && !req.user) {
            req.user = await User.fromApiKey(req.body.apiKey)
        }

        next()
    }))

    app.use(wrap(function setIp(req, res, next) {
        req.ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress

        next()
    }))

    app.use(wrap(function provideLinks(req, res, next) {
        const links = []

        res.locals.req = req

        if (res.locals.auth) {
            if (req.user) {
                links.push({ title: 'Logout', href: res.locals.auth.getLogout(`${req.protocol}://${req.get('host')}${req.originalUrl}`) })

                res.locals.user = req.user
            } else {
                links.push({ title: 'Login', href: res.locals.auth.getLogin(`${req.protocol}://${req.get('host')}${req.originalUrl}`) })
            }
        }

        res.locals.nav = {
            title: 'Femto Uploader',
            links
        }

        next()
    }))

    app.get('/', async (req, res) => {
        res.render('home', {
            page: { title: `Home :: ${config.get('title.suffix')}` },
            key: req.user ? req.user.getApiKey() : undefined
        })
    })

    app.get('/robots.txt', async (req, res) => {
        res.set('Content-Type', 'text/plain')
        res.send(`User-agent: *\nAllow: /`)
    })

    app.get('/terms', async (req, res) => {
        res.render('terms', {
            page: { title: `Terms of Service :: ${config.get('title.suffix')}` }
        })
    })

    app.get('/privacy', async (req, res) => {
        res.render('privacy', {
            page: { title: `Privacy :: ${config.get('title.suffix')}` }
        })
    })

    app.get('/uploads', async (req, res) => {
        const collection = await Collection.fromReq(req)
        const items = (await collection.list())
            .filter(item => item.item.metadata.filetype !== 'thumb')
            .filter(item => item.item.metadata.expired !== true)
        
        res.render('uploads', {
            page: { title: `Uploads :: ${config.get('title.suffix')}` },
            items
        })
    })

    app.post('/upload/url', async (req, res) => {
        req.user = await Utils.getUser(req)
        const expiresAt = Utils.parseExpiry(req.body.expiry)
        const item = await Item.create({
            name: {
                original: req.body.url,
            },
            metadata: {
                filetype: 'url',
                expiresAt
            },
            user: req.user && req.user.getIdentifier() ? { _id: req.user.getIdentifier() } : { ip: req.ip }
        })

        const short = await Short.generate({ keyLength: 4 })
        const shortItem = await Short.createReference(short, item.item)
        await item.setCanonical(shortItem)

        res.json({ data: { short } })
    })

    app.post('/upload/multipart', multer, async (req, res) => {
        req.user = await Utils.getUser(req)

        const originalName = req.file.originalname
        const extension = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)
        const expiresAt = Utils.parseExpiry(req.body.expiry)
        const store = await Store.create(req.file.storage)
        const bytes = (await toArray(await store.getStream({ end: 2048, start: 0 })))[0]
        const { data } = await Types.detect(store, bytes, req.file)

        const item = await Item.create({
            name: {
                original: originalName,
                extension: extension,
                filename: originalName.replace(/\.[^/.]+$/, '')
            },
            metadata: {
                expiresAt,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...data
            },
            references: {
                storage: store.store
            },
            user: req.user && req.user.getIdentifier() ? { _id: req.user.getIdentifier() } : { ip: req.ip }
        })

        const short = await Short.generate({ keyLength: 4 })
        const shortItem = await Short.createReference(short, item.item)
        await item.setCanonical(shortItem)

        res.json({ data: { short } })
    })

    app.get(['/thumb/:item', '/thumb/:item/*'], Item.fromReq, async (req, res) => {
        req.item.thumb(req, res)
    })

    app.get(['/:item', '/:item/*'], Item.fromReq, async (req, res) => {
        req.item.serve(req, res)
    })

    app.use(wrap(express.static('public')))

    app.listen(port, () => console.log(`Example app listening on port ${port}`))
})()
