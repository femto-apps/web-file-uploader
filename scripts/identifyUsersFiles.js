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
    const users = await UserModel.find()

    for (let user of users) {
        console.log(`=== ${user._id} (base: ${user.user}) ===`)
        for (let item of await ItemModel.find({ 'user._id': user.user })) {
            console.log(`${item._id} - [name: ${item.name.original}] [filetype: ${item.metadata.filetype}]`)
        }
    }

    mongoose.connection.close()
}

init()