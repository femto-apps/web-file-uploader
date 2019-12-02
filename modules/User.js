const uuidv4 = require('uuid/v4')
const memoize = require('memoizee')

const UserModel = require('../models/User')

class User {
  constructor(user) {
    this.user = user
  }

  static async fromApiKey(key) {
    let user = {
      uploader: await UserModel.findOne({ apiKey: key })
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

  getIdentifier() {
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