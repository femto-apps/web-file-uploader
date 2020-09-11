const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId },
    apiKey: { type: String },
}, {
    timestamps: true,
    strict: false
})

module.exports = mongoose.model('User', UserSchema)
module.exports.schema = UserSchema