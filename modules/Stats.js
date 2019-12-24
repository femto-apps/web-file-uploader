const UserModel = require('../models/User')
const ItemModel = require('../models/Item')

class Stats {
  constructor() {
    this.stats = {
      // counts of items
      itemCount: 0,
      userCount: 0,

      // storage used
      dataStored: 0,

      // network used
      bandwidth: 0,

      // people viewed
      views: 0, 
    }

    setTimeout(() => this.refresh(), 1)
    setInterval(() => this.refresh(), 30 * 1000)
  }

  async refresh() {
    this.stats.userCount = await UserModel.count()
    this.stats.itemCount = await ItemModel.count()

    this.stats.views = (await Item.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: "$metadata.views"
        }
      }
    }]))[0].total

    this.stats.bandwidth = (await Item.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: { $multiply: ["$metadata.views", "$file.length"] }
        }
      }
    }]))[0].total
  }
}

module.exports = Stats