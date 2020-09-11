const mongoose = require('mongoose')

const StatSchema = mongoose.Schema({
  time: { type: Date },
  field: { type: String },
  value: { type: Number }

}, {
	timestamps: true,
  strict: true	
})

module.exports = mongoose.model('Stat', StatSchema)
