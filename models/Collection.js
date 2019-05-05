const mongoose = require('mongoose')

const CollectionSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	ip: { type: String },
	path: { type: String, required: true },
}, {
	timestamps: true,
  strict: true	
})

module.exports = mongoose.model('Collection', CollectionSchema)
