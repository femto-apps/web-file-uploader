const config = require('@femto-apps/config')
const mongoose = require('mongoose')

const UserModel = require('../models/User.js')
const ItemModel = require('../models/Item.js')
const StoreModel = require('../models/Store.js')
const ShortModel = require('../models/Short.js')

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

async function init() {
    const items = await ItemModel.find({ 'user.ip': { $exists: true } })

    for (let item of items) {
        console.log(`${item._id} - [name: ${item.name.original}] [filetype: ${item.metadata.filetype}]`)
    }

    mongoose.connection.close()
}

init()