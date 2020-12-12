const mongoose = require('mongoose')
const tunnel = require('tunnel-ssh')
const Minio = require('minio')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
// const fetch = require('fetch-timeout')
const fetch = require('node-fetch')
const config = require('@femto-apps/config')
const toArray = require('stream-to-array')
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
const { bustCache } = require('../micro/helpers')

const newUser = require('../modules/User.js')
const newCollection = require('../modules/Collection.js')
const newItemModel = require('../modules/Item.js')
const newStore = require('../modules/Store.js')
const newShort = require('../modules/Short.js')
const newShortModel = require('../models/Short.js')
const Types = require('../types')

const minioOptions = {
    minio: {
        endPoint: config.get('minio.host'),
        port: config.get('minio.port'),
        useSSL: false,
        accessKey: config.get('minio.accessKey'),
        secretKey: config.get('minio.secretKey')
    }
}

const historicalMinioOptions = {
    minio: {
        endPoint: 'femto.pw',
        port: config.get('minio.port'),
        useSSL: false,
        accessKey: config.get('minio.accessKey'),
        secretKey: config.get('minio.secretKey')
    }
}

const translations = {}

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const client = new Minio.Client(minioOptions.minio)

const historicalClient = new Minio.Client(historicalMinioOptions.minio)

const ssh_config = {
    username: 'codefined',
    privateKey: fs.readFileSync('/home/codefined/.ssh/soyoufemto'),
    host: 'femto.pw',
    port: '22',
    dstHost: 'localhost',
    dstPort: '27017',
    localHost: '127.0.0.1',
    localPort: '27000'
}

const pause = time => new Promise(resolve => setTimeout(resolve, time))

function simplify(item) {
    return JSON.parse(JSON.stringify(item))
}

async function isFileAlreadyMigrated(short, expectedSize) {
    // console.log(short, expectedSize)

    console.log(short)

    const url = `http://localhost:5053/${short}?cache=${new Date()}`

    console.log('fetching url')
    return fetch(url, {}, 5000, 'timeout')
        .then(async res => {
            console.log('response')

            const size = Number(res.headers.get('content-length'))
            if (size !== expectedSize) {
                console.log('failed size check on', short, 'got', size, 'expected', expectedSize)

                // check for copyright messages.
                const content = await res.text()

                if (content.includes('Digital Millennium Copyright Act')) {
                    console.log('skipping because of dmca')
                    return true
                }

                return false
            }

            return true
        })
        .catch(e => {
            console.log(e)
            console.log(short)
            if (e === 'timeout') {
                return isFileAlreadyMigrated(short, expectedSize)
            }
            process.exit(0)
            return false
        })
}

async function migrateFile(item) {
    const simple = simplify(item)

    const migrated = await isFileAlreadyMigrated(simple.name.short, simple.file.length)
    if (migrated) {
        return
    }

    const originalName = simple.name.original
    const extension = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)
    const bucket = 'items'

    const folder = (await newCollection.fromReq({
        user: simple.user._id ? new newUser({ _id: simple.user._id }) : undefined,
        ip: simple.user.ip
    })).path

    const filename = uuidv4()
    const filepath = path.posix.join(folder, filename)

    await client.fPutObject(bucket, filepath, simple.storage.store + '/' + simple.storage.filename, {})

    const store = await newStore.create({
        bucket, folder, filename, filepath, store: 'minio'
    })

    let grab = { start: 0, end: 4100 }
    if (simple.file.length < 4100) {
        grab = { start: 0, end: simple.file.length }
    }

    let bytes = (await toArray(await store.getStream(grab)))[0]

    if (bytes === undefined) {
        bytes = Buffer.from([])
    }

    const { data } = await Types.detect(store, bytes, {
        mimetype: simple.file.mime,
        encoding: simple.file.encoding
    })

    const newItem = await newItemModel.create({
        name: {
            original: originalName,
            extension: extension,
            filename: originalName.replace(/\.[^/.]+$/, '')
        },
        metadata: {
            createdAt: simple.createdAt,
            updatedAt: simple.updatedAt,
            mime: simple.file.mime || 'application/octet-stream',
            encoding: simple.file.encoding,
            filetype: data.filetype,
            views: simple.views
        },
        references: {
            storage: store.store
        },
        user: { _id: simple.user._id, ip: simple.user.ip }
    })

    const shortItem = await newShort.createReference(simple.name.short, newItem.item)
    await newItem.setCanonical(shortItem)

    await bustCache(simple.name.short)
}

async function migrateNewFile(item) {
    const simple = simplify(item)

    const short = simple.references.canonical.short
    const size = simple.metadata.size

    const migrated = await isFileAlreadyMigrated(short, size)
    if (migrated) {
        return
    }

    // console.log('item not migrated')

    const originalName = simple.name.original
    const extension = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)
    const bucket = 'items'

    const folder = (await newCollection.fromReq({
        user: simple.user._id ? new newUser({ _id: simple.user._id }) : undefined,
        ip: simple.user.ip
    })).path

    const filename = uuidv4()
    const filepath = path.posix.join(folder, filename)

    const storage = simple.references.storage
    const stream = await historicalClient.getObject(storage.bucket, storage.filepath)
    await client.putObject(bucket, filepath, stream)

    // console.log('item saved to storage')

    const store = await newStore.create({
        bucket, folder, filename, filepath, store: 'minio'
    })

    let grab = { start: 0, end: 4100 }
    if (simple.metadata.size < 4100) {
        grab = { start: 0, end: simple.metadata.size }
    }

    let bytes = (await toArray(await store.getStream(grab)))[0]
    if (bytes === undefined) {
        bytes = Buffer.from([])
    }

    const { data } = await Types.detect(store, bytes, {
        mimetype: simple.metadata.mime,
        encoding: simple.metadata.encoding
    })

    const newItem = await newItemModel.create({
        name: {
            original: originalName,
            extension: extension,
            filename: originalName.replace(/\.[^/.]+$/, '')
        },
        metadata: {
            createdAt: simple.metadata.createdAt,
            updatedAt: simple.metadata.updatedAt,
            mime: simple.metadata.mime || 'application/octet-stream',
            encoding: simple.metadata.encoding,
            filetype: data.filetype,
            views: simple.metadata.views
        },
        references: {
            storage: store.store
        },
        user: { _id: simple.user._id, ip: simple.user.ip }
    })

    // console.log('model created')

    const shortItem = await newShort.createReference(short, newItem.item)
    await newItem.setCanonical(shortItem)

    // console.log('short created')

    await bustCache(short)
}

async function migrateURL(item) {
    const simple = simplify(item)

    // console.log(simple)
}

async function migrateNewURL(item) {
    const simple = simplify(item)

    const existing = await newShortModel.findOne({ short: item.references.canonical.short })

    if (existing) {
        return
    }

    const newItem = await newItemModel.create({
        name: {
            original: simple.name.original,
        },
        metadata: simple.metadata,
        user: simple.user
    })

    const shortItem = await newShort.createReference(item.references.canonical.short, newItem.item)
    await newItem.setCanonical(shortItem)

    await bustCache(item.references.canonical.short)
}

async function migrateItem(item) {
    const simple = simplify(item)

    if (item.user && item.user._id) {
        item.user._id = translations[item.user._id]
    }

    if (simple.file && simple.file.filetype) simple.type = { long: simple.file.filetype }

    if (simple.type.long === 'url') {
        return migrateURL(item)
    }

    if (['image', 'video', 'audio', 'binary', 'file', 'cast', 'text'].includes(simple.type.long)) {
        return migrateFile(item)
    }

    console.log(item, 'type not found')
}

async function migrateNewItem(item) {
    const simple = simplify(item)

    if (item.user && item.user._id) {
        item.user._id = translations[item.user._id]
    }

    if (!simple.references.canonical) {
        return
    }

    const short = simple.references.canonical.short
    const size = simple.metadata.size

    if (simple.metadata.filetype === 'url') {
        // check if url already exists
        // console.log(simple)

        console.log('url')
        return migrateNewURL(item)
        console.log('endUrl')
    }

    console.log('startTest')
    if (await isFileAlreadyMigrated(short, size)) {
        console.log('endTestIf')
        return
    }
    console.log('endTest')

    console.log('startFile')
    return migrateNewFile(item)
    console.log('endFile')

    // else, we should actually migrate it.
}

tunnel(ssh_config, async (err, server) => {
    const tunnelMinimalDesign = mongoose.createConnection('mongodb://127.0.0.1:27000/minimal_design', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const tunnelFileUploader = mongoose.createConnection('mongodb://127.0.0.1:27000/fileUploader', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const tunnelAuthenticationProvider = mongoose.createConnection('mongodb://127.0.0.1:27000/authenticationProvider', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const localFileUploader = mongoose.createConnection(config.get('mongo.uri') + config.get('mongo.db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const localAuthenticationProvider = mongoose.createConnection(config.get('mongo.uri') + 'authenticationProvider', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    const tunnelFileUploaderItem = tunnelFileUploader.model('Item', newItemModel.schema)
    const tunnelMinimalDesignItem = tunnelMinimalDesign.model('Item', new mongoose.Schema({ transfer: String }, { strict: false }))
    const tunnelMinimalDesignUser = tunnelMinimalDesign.model('User', new mongoose.Schema({}, { strict: false }))
    const tunnelFileUploaderUser = tunnelFileUploader.model('User', new mongoose.Schema({}, { strict: false }))
    const tunnelAuthenticationProviderUser = tunnelAuthenticationProvider.model('User', new mongoose.Schema({}, { strict: false }))
    const localAuthenticationProviderUser = localAuthenticationProvider.model('User', new mongoose.Schema({
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        createdAt: Date,
        updatedAt: Date
    }, { strict: false }))
    const localFileUploaderUser = localFileUploader.model('User', new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId },
        apiKey: { type: String },
    }, { strict: false }))

    // to migrate users, we first get all old users
    const userGenerator = await tunnelMinimalDesignUser.find({}, {}, { timeout: true }).cursor()

    const historicalUsers = {}
    const historicalUsersById = {}
    for (let user = await userGenerator.next(); user != null; user = await userGenerator.next()) {
        historicalUsers[user.username] = simplify(user)
        historicalUsersById[user._id] = simplify(user)
    }

    // then all new users
    const newUserGenerator = await tunnelAuthenticationProviderUser.find({}, {}, { timeout: true }).cursor()

    for (let user = await newUserGenerator.next(); user != null; user = await newUserGenerator.next()) {
        user = simplify(user)

        const uploadUser = await tunnelFileUploaderUser.findOne({ user: mongoose.Types.ObjectId(user._id) })

        // this is just a web auth user, without the file uploader part.
        // most file uploader _ids represent web auth _ids.

        // console.log(uploadUser)

        let oldUserType
        if (!uploadUser) {
            oldUserType = {
                _id: user._id,
                username: user.username,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            continue
        } else {
            oldUserType = {
                _id: user._id,
                username: user.username,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                apiKey: simplify(uploadUser).apiKey
            }
        }

        const oldUsername = historicalUsers[user.username]

        if (!oldUserType.apiKey && oldUsername && oldUsername.apiKey) {
            // console.log('adding in api key')
            oldUserType.apiKey = oldUsername.apiKey
        }

        historicalUsers[user.username] = simplify(oldUserType)
        historicalUsersById[user._id] = simplify(oldUserType)
    }

    // console.log(Object.keys(historicalUsers).length)
    // console.log(Object.keys(historicalUsersById).length)

    console.log(await localAuthenticationProviderUser.deleteMany({}))
    console.log(await localFileUploaderUser.deleteMany({}))

    for (let username of Object.keys(historicalUsers)) {
        const user = historicalUsers[username]

        try {
            const authUser = new localAuthenticationProviderUser({
                username: user.username,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })

            const res = await authUser.save()

            historicalUsers[username].newId = simplify(res)._id

            translations[user._id] = simplify(res)._id

            if (user.apiKey) {
                const fileUser = new localFileUploaderUser({
                    user: simplify(res)._id,
                    apiKey: user.apiKey,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                })

                await fileUser.save()

            }
        } catch (e) {
            console.log(username)
        }
    }

    // first we see how many we have left
    const total = await tunnelMinimalDesignItem.countDocuments({}) + await tunnelFileUploaderItem.countDocuments({})
    const remaining = await tunnelMinimalDesignItem.find({}, {}, { timeout: true }).skip(4500).cursor()

    let i = 0

    // then we loop over, processing all from minimal_items
    // for (let item = await remaining.next(); item != null; item = await remaining.next()) {
    //     i += 1

    //     const simple = simplify(item)
    //     console.log(`[${i} / ${total}] Processing [id: ${item._id}], [size: ${simple.file ? prettyBytes(simple.file.length || 0) : 'url'}] [name: ${simple.name.original}].`)
    //     await migrateItem(item)
    // }

    // then we loop over, processing all remaining from femto.pw file uploader

    const catchup = await tunnelFileUploaderItem.find({}, {}, { timeout: true }).skip(1580).cursor()

    for (let item = await catchup.next(); item != null; item = await catchup.next()) {
        i += 1

        const simple = simplify(item)
        console.log(`[${i} / ${total}] Processing [id: ${item._id}], [size: ${simple.metadata ? prettyBytes(simple.metadata.size || 0) : 'url'}] [name: ${simple.name.original}].`)
        await migrateNewItem(item)
    }

    console.log('finished')
})