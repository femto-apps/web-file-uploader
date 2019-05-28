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
    expiresAt: { type: Date }
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
  }
}, {
	timestamps: true,
  strict: false	
})

ItemSchema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model('Item', ItemSchema)
