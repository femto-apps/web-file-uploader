const mongoose = require('mongoose')
const config = require('@femto-apps/config')
const prettyBytes = require('pretty-bytes')

const Item = require('../modules/Item.js')
const ItemModel = require('../models/Item.js')
const ShortModel = require('../models/Short.js')
const StoreModel = require('../models/Store.js')

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

async function init() {
    const Minio = require('minio')

    const client = new Minio.Client(Object.assign({}, config.get('minio'), { endPoint: config.get('minio.host') }))
    const stream = client.listObjectsV2('items', '', true)

    stream.on('data', async obj => {
        const store = await StoreModel.findOne({ 'filepath': obj.name })
        if (!store) {
            console.log(`[+] [size: ${prettyBytes(obj.size)}] [name: ${obj.name}]`)
        }
    })
    stream.on('error', err => {
        console.log(err)
    })
}

init()
