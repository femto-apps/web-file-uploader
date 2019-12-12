const Minio = require('minio')
const path = require('path')
const uuidv4 = require('uuid/v4')
const fetch = require('node-fetch')
const config = require('@femto-apps/config')
const mongoose = require('mongoose')
const toArray = require('stream-to-array')

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

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const client = new Minio.Client(minioOptions.minio)

async function convertItem(original) {
    console.log('original', original)

    const originalName = original.name.original
    const extension = originalName.slice((originalName.lastIndexOf(".") - 1 >>> 0) + 2)

    console.log('grabbing data stream')
    // download file and reupload it to minio
    const dataStream = await fetch('https://v2.femto.pw/dvnb')
        .then(res => res.body)

    console.log(dataStream)

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
    const bytes = (await toArray(await store.getStream({ end: 2048, start: 0 })))[0]

    console.log(bytes)

    const { data } = await Types.detect(store, bytes, {
        mimetype: original.file.mime,
        encoding: original.file.encoding
    })

    console.log('detected type')

    const item = await newItemModel.create({
        name: {
            original: originalName,
            extension: extension,
            filename: originalName.replace(/\.[^/.]+$/, '')
        },
        metadata: {
            createdAt: original.createdAt,
            updatedAt: original.updatedAt,
            mime: original.file.mime,
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
}

convertItem({
    "_id": "5bacf2599ddbd30eec206b81",
    "name": {
        "short": "ccjpa3",
        "extension": "png",
        "original": "chrome_2018-09-27_16-08-09.png"
    },
    "storage": {
        "store": "C:\\Users\\Alexander\\Documents\\GitHub\\minimal_design\\sites\\host\\store",
        "filename": "91e893fc-c3e6-48ba-b731-869f8a1e8e3d"
    },
    "file": {
        "encoding": "7bit",
        "mime": "image/png",
        "length": 43996,
        "filetype": "image"
    },
    "user": {
        "loggedIn": "anonymous",
        "ip": "::1"
    },
    "version": 2,
    "views": 1,
    "createdAt": "2018-09-27T15:08:09.901Z",
    "updatedAt": "2018-09-27T15:08:16.211Z",
    "__v": 0
})