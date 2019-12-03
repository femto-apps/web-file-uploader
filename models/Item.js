const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
  name: {
    original: { type: String }, // 'Hello.test.exe'
    extension: { type: String }, // 'exe'
    filename: { type: String } // 'Hello.test'
  },
  metadata: {
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    mime: { type: String },
    encoding: { type: String },
    filetype: { type: String },
    expiresAt: { type: Date },
    expired: { type: Boolean }
  },
  references: {
    storage: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', autopopulate: true },
    thumb: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', autopopulate: true },
    canonical: { type: mongoose.Schema.Types.ObjectId, ref: 'Short', autopopulate: true },
    aliases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Short', autopopulate: true }]
  },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    ip: { type: String }
  },
  version: { type: Number, default: 3 }
}, {
	timestamps: true,
  strict: false	
})

ItemSchema.plugin(require('mongoose-autopopulate'))

const ItemModel = mongoose.model('Item', ItemSchema)

async function expireItems() {
  for (let item of await ItemModel.find({ 'metadata.expiresAt': { '$lte': new Date() }, 'metadata.expired': { '$exists': false } })) {
    item.metadata.expired = true
    await item.save()

    console.log(`Expired ${item.name.original}, ${item._id}`)
  }

  setTimeout(expireItems, 60 * 1000)
}

setTimeout(expireItems, 60 * 1000)

module.exports = ItemModel
