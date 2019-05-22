const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
  name: {
    original: { type: String },
    extension: { type: String },
  },
  metadata: {
    views: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    mime: { type: String },
    encoding: { type: String },
    filetype: { type: String }
  },
  storage: {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    thumb: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
  },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    ip: { type: String }
  }
}, {
	timestamps: true,
  strict: false	
})

function populateItem(next) {
  // TODO: Replace with only populating when required
  this.populate('storage.item')
  this.populate('storage.thumb')

  next()
}

ItemSchema.pre('findOne', populateItem)
ItemSchema.pre('find', populateItem)

module.exports = mongoose.model('Item', ItemSchema)
