const uuidv4 = require('uuid/v4')

const CollectionModel = require('../models/Collection')
const ItemModel = require('../models/Item')
const Item = require('../modules/Item')

class Collection {
  constructor(collection) {
    this.collection = collection
    
    this.path = collection.path
  }

  static async fromReq(req) {
    if (req.user) {
      return Collection.fromUser(req.user)
    }
  
    return Collection.fromIp(req.ip)
  }

  static async fromItem(item) {
    if (item.user._id) {
      return Collection.fromUser({
        getIdentifier: () => item.user._id
      })
    }

    return Collection.fromIp(item.user.ip)
  }

  static async fromUser(user) {
    let collection = await CollectionModel.findOne({
      user: user.getIdentifier()
    })

    if (!collection) {
      collection = new CollectionModel({
        user: user.getIdentifier(),
        path: uuidv4() + '/'
      })
  
      collection = await collection.save()
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

  async list() {
    if (this.collection.user) {
      return (await ItemModel.find({ 'user._id': this.collection.user }).sort('-createdAt')).map(item => new Item(item))
    }

    if (this.collection.ip) {
      return (await ItemModel.find({ 'user.ip': this.collection.ip }).sort('-createdAt')).map(item => new Item(item))
    }
  }
}

module.exports = Collection