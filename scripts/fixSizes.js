const mongoose = require('mongoose')
const config = require('@femto-apps/config')
const pLimit = require('p-limit')

const Utils = require('../modules/Utils')

const Item = require('../modules/Item.js')
const ItemModel = require('../models/Item.js')

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
    const items = await ItemModel.find({ 'metadata.filetype': { '$ne': 'url' } }).skip(31000)

    let i = 0

    for (let dbItem of items) {

        const item = new Item(dbItem)
        const stat = await item.getItemStat()

        console.log(`= [${i} / ${items.length}] [name: ${dbItem.name.original}] [id: ${dbItem._id}] [size: ${dbItem.metadata.size}] [realSize: ${stat.size}]`)

        item.item.metadata.size = stat.size
        await item.item.save()

        i += 1
    }

    mongoose.disconnect()
}

init()
