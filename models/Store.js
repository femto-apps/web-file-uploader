const mongoose = require('mongoose')

const StoreSchema = mongoose.Schema({
    store: { type: String },
    bucket: { type: String },
    folder: { type: String },
    filename: { type: String },
    filepath: { type: String }
}, {
    timestamps: true,
    strict: false
})

module.exports = mongoose.model('Store', StoreSchema)
