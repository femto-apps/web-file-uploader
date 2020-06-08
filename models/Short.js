const mongoose = require('mongoose')

const ShortSchema = mongoose.Schema({
  short: { type: String, unique: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
}, {
	timestamps: true,
  strict: true	
})

module.exports = mongoose.model('Short', ShortSchema)
