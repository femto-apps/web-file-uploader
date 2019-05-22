const ItemModel = require('../models/Item')
const Short = require('./Short')
const Types = require('../types')

class Item {
    constructor() {

    }

    static create(itemInformation) {
        const item = new ItemModel(itemInformation)

        return item
    }

    static async fromReq(req, res, next) {
        const short = await Short.get(req.params.item)

        if (short === null) {
            return res.json({ error: 'Short not found' })
        }

        req.item = await Types.match(short.item)
        next()
    }
}

module.exports = Item