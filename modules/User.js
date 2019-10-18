const uuidv4 = require('uuid/v4')

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

module.exports = User