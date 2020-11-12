const session = require('express-session')
const cookieParser = require('cookie-parser')
const RedisStore = require('connect-redis')(session)
const bodyParser = require('body-parser')
const Multer = require('multer')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const { v4: uuidv4 } = require('uuid')
const toArray = require('stream-to-array')
const config = require('@femto-apps/config')
const compression = require('compression')
const redis = require('redis')
const prettyBytes = require('pretty-bytes')
const dateFormat = require('dateformat')
const cors = require('cors')
const authenticationConsumer = require('@femto-apps/authentication-consumer')
const errorHandler = require('errorhandler')

const Types = require('./types')
const Item = require('./modules/Item')
const Short = require('./modules/Short')
const User = require('./modules/User')
const Store = require('./modules/Store')
const Collection = require('./modules/Collection')
const Utils = require('./modules/Utils')
const minioStorage = require('./modules/MinioMulterStorage')
const ShareX = require('./modules/ShareX')
const Archive = require('./modules/Archive')
const ClamAV = require('./modules/ClamAV')
const Stats = require('./modules/Stats')
const Mail = require('./modules/Mail')

const { wrap } = require('./modules/Profiling')

const analytics = require('express-google-analytics')('UA-121951630-1')

function ignoreAuth(req, res) {
    return req.originalUrl.startsWith('/thumb/')
}

; (async () => {
    const app = express()
    const port = config.get('port')

    const clam = new ClamAV()
    const stats = new Stats()
    const mail = new Mail(config.get('email'))

    const multer = Multer({
        storage: minioStorage({
            minio: Object.assign({}, config.get('minio'), { endPoint: config.get('minio.host') }),
            bucket: (req, file) => config.get('minio.itemBucket'),
            folder: async (req, file) => {
                return (await Collection.fromReq(req)).path
            },
            filename: async (req, file) => {
                return uuidv4()
            }
        }),
        limits: { fileSize: 8589934592 }
    }).single('upload')

    const multer_text = Multer().none()

    mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const redisClient = redis.createClient({
        host: config.get('redis.host'),
        port: config.get('redis.port')
    })

    app.set('view engine', 'pug')
    app.set('trust proxy', ['loopback', ...config.get('trustedProxy')].join(','))
    app.disable('x-powered-by')

    app.use(wrap(morgan('dev')))
    app.use(wrap(compression()))
    app.use(wrap(bodyParser.json()))
    app.use(wrap(bodyParser.urlencoded()))
    app.use(wrap(cookieParser(config.get('cookie.secret'))))
    app.use(wrap(function sess(req, res, next) {
        // if we don't need req.user, ignore it.
        if (ignoreAuth(req, res)) {
            return next()
        }

        session({
            store: new RedisStore({
                client: redisClient
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
                links.push({ title: 'Logout', href: res.locals.auth.getLogout(`${config.get('authenticationConsumer.endpoint')}${req.originalUrl}`) })

                res.locals.user = req.user
            } else {
                links.push({ title: 'Login', href: res.locals.auth.getLogin(`${config.get('authenticationConsumer.endpoint')}${req.originalUrl}`) })
            }
        }

        res.locals.nav = {
            title: `${config.get('title.suffix')}`,
            links
        }

        next()
    }))

    app.use(wrap(analytics))

    app.get('/', async (req, res) => {
        res.render('home', {
            page: { title: `Home :: ${config.get('title.suffix')}` },
            key: req.user ? req.user.getApiKey() : undefined,
            origin: config.get('url.origin')
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

    // app.get('/export', async (req, res) => {
    //     if (!req.user) {
    //         res.send('Please login to export your uploads')
    //     }

    //     const collection = await Collection.fromReq(req)
    //     const items = (await collection.list())
    //         .filter(item => item.item.metadata.filetype !== 'thumb')
    //         .filter(item => item.item.metadata.expired !== true)

    //     res.set('Content-Disposition', `filename="femto_export.zip"`)
    //     res.set('Content-Type', 'application/zip')

    //     console.log('hey')

    //     Archive.archive(res, items)
    // })

    app.get('/stats', async (req, res) => {
        res.render('stats', {
            stats: await stats.getRecent(365),
            page: { title: `Stats :: ${config.get('title.suffix')}` }
        })
    })

    app.get('/uploads', async (req, res) => {
        if (!req.user) {
            res.send('Please login to see uploads')
        }

        const collection = await Collection.fromReq(req)
        const items = (await collection.list())
            .filter(item => item.item.metadata.filetype !== 'thumb')
            .filter(item => item.item.metadata.expired !== true)
            .filter(item => item.item.deleted !== true)

        // console.log(items.forEach(item => {
        //     console.log(item.item.references)
        // }))

        res.render('uploads', {
            page: { title: `Uploads :: ${config.get('title.suffix')}` },
            items
        })
    })

    // /i/upload/url is deprecated, please use /upload/url
    app.options(['/i/upload/url', '/upload/url'], cors())
    app.post(['/i/upload/url', '/upload/url'], cors(), multer_text, async (req, res) => {
        req.user = await User.fromReq(req)
        const expiresAt = Utils.parseExpiry(req.body.expiry)

        console.log(req.body, req.headers)

        const item = await Item.create({
            name: {
                // req.body.text is only used in uploader v2
                original: req.body.url || req.body.text,
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

    // /i/upload and /upload are deprecated, please use /upload/multipart
    app.options(['/i/upload', '/upload', '/upload/multipart'], cors())
    app.post(['/i/upload', '/upload', '/upload/multipart'], cors(), multer, async (req, res) => {
        req.user = await User.fromReq(req)

        console.log(req.file)

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
                size: req.file.storage.size,
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

        console.log('scanning file')
        clam.scan(originalName, await store.getStream()).then(async result => {
            if (result.disabled) {
                return console.log(`didn't run scan because it was disabled.`)
            }

            const virusResult = {
                run: true,
                description: result.Description
            }

            if (result.Status === 'FOUND') {
                virusResult.detected = true
            } else if (result.Status === 'OK') {
                virusResult.detected = false
            }

            await item.setVirus(virusResult)
            console.log(`updated file ${item.item._id} ${result.Status}: "${result.Description}"`)
        })
    })

    app.use(wrap(express.static('public')))
    app.use(wrap(express.static('public/favicons')))

    app.get('/sharex/uploader.sxcu', ShareX.downloadUploader)
    app.get('/sharex/shortener.sxcu', ShareX.downloadShortener)

    app.get('/issue', async (req, res) => {
        res.render('issues', {
            page: { title: `Issues :: ${config.get('title.suffix')}` }
        })
    })

    app.post('/issue', async (req, res) => {
        console.log('sending suggestion', req.body)
        const response = await mail.sendMail({
            from: 'uploader@femto.host',
            to: 'uploader@femto.host',
            subject: 'Contact Form',
            text: `Contact: ${req.body.contact}\nMessage: ${req.body.issue}`
        })

        res.send("thanks for your message, if you entered in a way to contact you we'll be in touch with our response :)")
    })

    app.get(['/info/:item', '/info/:item/*'], Item.fromReq, async (req, res) => {
        res.render('info', {
            item: req.item.item.item,
            page: { title: `Info :: ${config.get('title.suffix')}` },
            prettyBytes,
            dateFormat,
            isOwner: await req.item.ownedBy(req.user)
        })
    })

    app.get(['/thumb/:item', '/thumb/:item/*'], Item.fromReq, async (req, res) => {
        req.item.thumb(req, res)
    })

    app.get(['/delete/:item', '/delete/item/*'], Item.fromReq, async (req, res) => {
        if (!(await req.item.ownedBy(req.user))) {
            return res.json({ removed: false, err: 'You do not own this item.' })
        }

        await req.item.delete()

        return res.json({ removed: true })
    })

    app.get(['/:item', '/:item/*'], Item.fromReq, async (req, res) => {
        req.item.serve(req, res)
    })

    process.on('uncaughtException', function (exception) {
        console.log(exception); // to see your exception details in the console
        // if you are on production, maybe you can send the exception details to your
        // email as well ?
    })

    app.use(errorHandler({ dumpExceptions: true, showStack: true }))

    app.listen(port, () => console.log(`Example app listening on port ${port}`))
})()
