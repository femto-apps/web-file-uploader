const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
  name: {
    original: { type: String },
    extension: { type: String },
  },
  storage: {
    store: { type: String },
    bucket: { type: String },
    folder: { type: String },
    filename: { type: String },
    filepath: { type: String }
  },
  metadata: {
    views: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId }
  }
}, {
	timestamps: true,
  strict: true	
})

module.exports = mongoose.model('Item', ItemSchema)
