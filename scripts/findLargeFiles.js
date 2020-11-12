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
    const items = ItemModel.find({}).sort({ 'metadata.size': -1 }).limit(50).cursor()

    for (let dbItem = await items.next(); dbItem != null; dbItem = await items.next()) {
        const item = new Item(dbItem)
        console.log(`[+] [size: ${prettyBytes(dbItem.metadata.size)}] [type: ${dbItem.metadata.filetype}] [views: ${dbItem.metadata.views}] [link: https://femto.pw/${(await item.getCanonical()).short} ]`)
    }
}

init()
