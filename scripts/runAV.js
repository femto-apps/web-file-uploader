const mongoose = require('mongoose')
const config = require('@femto-apps/config')
const pLimit = require('p-limit')

const Utils = require('../modules/Utils')

const Item = require('../modules/Item.js')
const ItemModel = require('../models/Item.js')
const ClamAV = require('../modules/ClamAV')

let running = 0

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

async function scanItem(clam, item, i, total) {
    // const originalName = item.name.original
    const originalName = String(item._id)
    const itemClass = new Item(item)

    return clam.scan(originalName, await itemClass.getItemStream()).then(async result => {
        const virusResult = {
            run: true,
            description: result.Description
        }

        if (result.Status === 'FOUND') {
            virusResult.detected = true
        } else if (result.Status === 'OK') {
            virusResult.detected = false
        }

        await itemClass.setVirus(virusResult)
        running -= 1
        console.log(`+ [${i} / ${total}] scan complete [id: ${itemClass.item._id}] [status: ${result.Status}] [description: ${result.Description}]`)
    })
}

async function init() {
    const clam = new ClamAV()

    const numItems = await ItemModel.count({ 'metadata.virus.run': false, "metadata.filetype": { "$ne": "url" } })

    const random = Math.floor(Math.random() * (numItems - 20))
    // const items = await ItemModel.find({ 'metadata.virus.run': false }).skip(random)
    const items = await ItemModel.find({ '_id': '5f5aabaeeddf282a7304242a' })

    let i = 0

    for (let item of items) {
        console.log(`= [${i} / ${items.length}] [name: ${item.name.original}] [id: ${item._id}] [size: ${item.metadata.size}]`)

        try {
            running += 1

            while (running > 16) {
                console.log('too many running', running)
                await Utils.pause(15000)
            }

            await Utils.timeout(scanItem(clam, item, i, items.length), 50)
        } catch (e) {
            err = JSON.stringify(e)
            if (!err.startsWith('"Timed out')) {
                console.log(e)
            }
        }
        i += 1
    }

    // moongose.disconnect()
}

init()
