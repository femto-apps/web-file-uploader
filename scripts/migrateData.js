const Minio = require('minio')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fetch = require('node-fetch')
const config = require('@femto-apps/config')
const mongoose = require('mongoose')
const toArray = require('stream-to-array')
const pLimit = require('p-limit')

const newUser = require('../modules/User.js')
const newCollection = require('../modules/Collection.js')
const newItemModel = require('../modules/Item.js')
const newStore = require('../modules/Store.js')
const newShort = require('../modules/Short.js')
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

const minimalItemConnection = mongoose.createConnection(config.get('mongo.uri') + 'minimal_design', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const MinimalItem = minimalItemConnection.model('Item', new mongoose.Schema({ transfer: String }, { strict: false }))

const client = new Minio.Client(minioOptions.minio)

const pause = t => new Promise(resolve => setTimeout(resolve, t))

async function convertUrl(original) {
    const trueOriginal = original
    original = JSON.parse(JSON.stringify(original))

    if (await newShort.get(original.name.short)) {
        // console.log('already handled', original._id, original.name.short)
        return
    }
    
    console.log('start folder')
    const folder = (await newCollection.fromReq({
        user: original.user._id ? new newUser({ _id: original.user._id }) : undefined,
        ip: original.user.ip
    })).path
    console.log('end folder')

    console.log('detected type')

    const item = await newItemModel.create({
        name: {
            original: original.name.original,
        },
        metadata: {
            filetype: 'url'
        },
        user: { _id: original.user._id, ip: original.user.ip }
    })

    console.log('created item')

    const shortItem = await newShort.createReference(original.name.short, item.item)
    await item.setCanonical(shortItem)

    console.log(item)
    console.log(shortItem)

    console.log('finished')

    trueOriginal.transfer = 'success'
    trueOriginal.markModified('transfer')
    await trueOriginal.save()
}

async function convertItem(original) {
    const trueOriginal = original
    original = JSON.parse(JSON.stringify(original))

    if (await newShort.get(original.name.short)) {
        console.log('already handled', original._id, original.name.short)
        return
    }

    console.log('original', original)

    const originalName = original.name.original
    const extension = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)

    console.log('grabbing data stream')
    // download file and reupload it to minio

    const fetchResponse = await fetch(`http://localhost:7983/${original.name.short}`)
        .catch(e => {
            return 'failed'
        })

    if (fetchResponse === 'failed' || !fetchResponse.ok) {
        trueOriginal.transfer = 'failed'
        trueOriginal.markModified('transfer')
        await trueOriginal.save()
        console.log('pausing for 10s')
        await pause(10000)

        return 'failed'
    }
    const dataStream = await fetchResponse.body
    // console.log(dataStream)

    console.log('finished fetch')

    const bucket = 'items'

    console.log('start folder')
    const folder = (await newCollection.fromReq({
        user: original.user._id ? new newUser({ _id: original.user._id }) : undefined,
        ip: original.user.ip
    })).path
    console.log('end folder')

    const filename = uuidv4()
    const filepath = path.posix.join(folder, filename)

    console.log('got body')

    await client.putObject(bucket, filepath, dataStream, undefined)
    

    console.log('put object')

    const store = await newStore.create({
        bucket, folder, filename, filepath, store: 'minio'
    })

    let grab = { start: 0, end: 4100 }
    if (original.file.length < 4100) {
        grab = { start: 0, end: 0 }
    }

    let bytes = (await toArray(await store.getStream(grab)))[0]

    console.log(bytes)

    if (bytes === undefined) {
        bytes = Buffer.from([])
    }

    const { data } = await Types.detect(store, bytes, {
        mimetype: original.file.mime,
        encoding: original.file.encoding
    })

    console.log('detected type', data)

    const item = await newItemModel.create({
        name: {
            original: originalName,
            extension: extension,
            filename: originalName.replace(/\.[^/.]+$/, '')
        },
        metadata: {
            createdAt: original.createdAt,
            updatedAt: original.updatedAt,
            mime: original.file.mime || 'application/octet-stream',
            encoding: original.file.encoding,
            filetype: data.filetype,
            views: original.views
        },
        references: {
            storage: store.store
        },
        user: { _id: original.user._id, ip: original.user.ip }
    })

    console.log('created item')

    const shortItem = await newShort.createReference(original.name.short, item.item)
    await item.setCanonical(shortItem)

    console.log(item)
    console.log(shortItem)

    console.log('finished')

    trueOriginal.transfer = 'success'
    trueOriginal.markModified('transfer')
    await trueOriginal.save()
}

async function init() {
    // const items = await MinimalItem.find({ 'file.filetype': { '$ne': 'url' }, 'type.long': { '$ne': 'url' }, 'transfer': { '$ne': 'failed' } })
    // const items = await MinimalItem.find({ 'file.filetype': { '$ne': 'url' }, 'type.long': { '$ne': 'url' }, 'transfer': { '$exists': false } })
    const items = await MinimalItem.find({ 'type.long': 'url' })


    for (let item of items) {
        // await convertItem(item)
        console.log(item)
        return
        await convertUrl(item)
    }

    console.log('disconnecting')

    mongoose.disconnect()
}

init()
