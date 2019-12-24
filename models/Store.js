const mongoose = require('mongoose')

const StoreSchema = mongoose.Schema({
    store: { type: String },
    bucket: { type: String },
    folder: { type: String },
    filename: { type: String },
    filepath: { type: String },
    size: { type: Number, default: 0 }
}, {
    timestamps: true,
    strict: false
})

module.exports = mongoose.model('Store', StoreSchema)
