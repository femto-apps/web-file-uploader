const uuidv4 = require('uuid/v4')

const CollectionModel = require('../models/Collection')

class Collection {
  constructor(collection) {
    this.collection = collection

    this.path = collection.path
  }

  static async fromUser(user) {
    let collection = CollectionModel.find({
      user: user._id
    })

    if (!collection) {
      collection = new CollectionModel({
        user: user._id,
        path: uuidv4() + '/'
      })
  
      await collection.save()
    }

    return new Collection(collection)
  }

  static async fromIp(ip) {
    let collection = await CollectionModel.findOne({
      ip
    })

    if (!collection) {
      collection = new CollectionModel({
        ip,
        path: uuidv4() + '/',
      })
    
      await collection.save()
    }

    return new Collection(collection)
  }
}

module.exports = Collection