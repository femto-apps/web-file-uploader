const toArray = require('stream-to-array')
const mongoose = require('mongoose')
const config = require('@femto-apps/config')
const memoize = require('memoizee')
const fetch = require('node-fetch')

const Types = require('../types')
const Item = require('../modules/Item')
const Short = require('../modules/Short')
const Store = require('../modules/Store')

let connectedToMongoose = false

module.exports.connectToMongoose = () => {
    if (connectedToMongoose) return

    mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    connectedToMongoose = true
}

module.exports.bustCache = async (short) => {
    return fetch(`http://localhost:${config.get('cluster.getClusterPort')}/buster?short=${short}`)
        .then(res => res.json())
}

module.exports.getTypeFromStore = async (store, metadata) => {
    const bytes = (await toArray(await store.getStream({ end: 2048, start: 0 })))[0]
    const { data } = await Types.detect(store, bytes, metadata)

    return data
}

module.exports.createUrlItem = async (url, { expiry, user }) => {
    const item = await Item.create({
        name: {
            // req.body.text is only used in uploader v2
            original: url,
        },
        metadata: {
            filetype: 'url',
            expiresAt: expiry
        },
        user
    })

    const shortWord = await Short.generate({ keyLength: 4 })
    const short = await Short.createReference(shortWord, item.item)
    await item.setCanonical(short)

    return { item, short }
}

module.exports.createItem = async (storage, { expiry, mimetype, encoding, filename, user }) => {
    const extension = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)

    const store = await Store.create(storage)
    const type = await module.exports.getTypeFromStore(store, { mimetype, encoding })

    const item = await Item.create({
        name: {
            original: filename,
            extension: extension,
            filename: filename.replace(/\.[^/.]+$/, '')
        },
        metadata: {
            expiresAt: expiry,
            createdAt: new Date(),
            updatedAt: new Date(),
            size: storage.size,
            ...type
        },
        references: {
            storage: store.store
        },
        user
    })

    const shortWord = await Short.generate({ keyLength: 4 })
    const short = await Short.createReference(shortWord, item.item)
    await item.setCanonical(short)

    return { item, store, short }
}

module.exports.getItem = async (name) => {
    const short = await Short.get(name.split('.')[0])

    if (short === null) {
        return undefined
    }

    const item = new Item(short.item)
    const type = Types.match(item)

    return type
}

module.exports.cachedGetItem = memoize(module.exports.getItem, {
    primitive: true,
    length: 1,
    resolvers: [String],
    promise: true,
    maxAge: 1000 * 60 * 60,
    preFetch: false
})