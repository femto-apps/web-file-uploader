const mongoose = require('mongoose')
const config = require('@femto-apps/config')
const pLimit = require('p-limit')

const Utils = require('../modules/Utils')

const Item = require('../modules/Item.js')
const ItemModel = require('../models/Item.js')
const ShortModel = require('../models/Short.js')

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

async function init() {
    // const numItems = await ItemModel.count({ 'metadata.virus.run': false, "metadata.filetype": { "$ne": "url" } })

    // const random = Math.floor(Math.random() * (numItems - 20))
    // const items = await ItemModel.find({ 'metadata.virus.run': false }).skip(random)
    // const items = ItemModel.find({ 'metadata.filetype': { '$ne': 'thumb' } }).cursor()
    const items = ItemModel.find({ _id: '5f5cb8a023ac8762ec024eba' }).cursor()

    let i = 0
    for (let dbItem = await items.next(); dbItem != null; dbItem = await items.next()) {
        i += 1
        const item = new Item(dbItem)

        console.log(`= [${i} / ${items.length}] [name: ${dbItem.name.original}] [id: ${dbItem._id}] [size: ${dbItem.metadata.size}]`)

        const canonical = await item.getCanonical()

        console.log('canonical', canonical)

        if (!canonical) {
            console.log(item)
            console.log('deleting')
            await ItemModel.deleteOne({ _id: item._id })
        }
    }

    mongoose.disconnect()
}

init()
