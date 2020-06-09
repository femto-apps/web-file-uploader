const UserModel = require('../models/User')
const ItemModel = require('../models/Item')
const StatModel = require('../models/Stat')

const config = require('@femto-apps/config')

class Stats {
  constructor() {
    setInterval(() => {
      this.update()
    }, config.get('experimental.statsTimer'))
    this.update()
  }

  async update() {
    console.log('updating statistics')

    const userCount = await UserModel.countDocuments()
    const itemCount = await ItemModel.countDocuments()

    const viewCount = (await ItemModel.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: "$metadata.views"
        }
      }
    }]))[0].total

    const bandwidthUsed = (await ItemModel.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: { $multiply: ["$metadata.views", "$metadata.size"] }
        }
      }
    }]))[0].total

    const user = new StatModel({
      time: new Date(),
      field: 'users',
      value: userCount
    })

    const item = new StatModel({
      time: new Date(),
      field: 'items',
      value: itemCount
    })

    const views = new StatModel({
      time: new Date(),
      field: 'views',
      value: viewCount
    })

    const bandwidth = new StatModel({
      time: new Date(),
      field: 'bandwidth',
      value: bandwidthUsed
    })
    
    await Promise.all([
      user.save(),
      item.save(),
      views.save(),
      bandwidth.save()
    ])
  }
}

module.exports = Stats