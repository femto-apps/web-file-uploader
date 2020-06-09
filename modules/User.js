const { v4: uuidv4 } = require('uuid')
const memoize = require('memoizee')

const UserModel = require('../models/User')

class User {
  constructor(user) {
    this.user = user
  }

  static async fromApiKey(key) {
    const uploaderUser = await UserModel.findOne({ apiKey: key })

    if (!uploaderUser) {
      return undefined
    }

    let user = {
      uploader: uploaderUser
    }

    return new User(user)
  }

  static async fromUser(genericUser) {
    let user = {
      generic: genericUser,
      uploader: await UserModel.findOne({ user: genericUser._id })
    }

    if (!user.uploader) {
      console.log('Updating user model')
      user.uploader = new UserModel({
        user: genericUser._id,
        apiKey: uuidv4()
      })

      await user.uploader.save()
    }

    return new User(user)
  }

  static fromReq(req) {
    if (req.body && req.body.apiKey && !req.user) {
        return User.fromApiKey(req.body.apiKey)
    }

    return req.user
  }

  getIdentifier() {
    // console.log(this.user)

    if (this.user) {
      return this.user._id || this.user.uploader.user
    }
  }

  getApiKey() {
    return this.user.uploader.apiKey
  }
}

User.fromUserCached = memoize(User.fromUser, {
  promise: true,
  normalizer: args => args[0]._id,
  maxAge: 1000 * 60 * 60,
  preFetch: true,
  primitive: true
})

module.exports = User