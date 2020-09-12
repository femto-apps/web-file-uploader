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

  async getRecent(time) {
    const [users, items, views, bandwidth] = await Promise.all([
      this.getRecentByType('users', time),
      this.getRecentByType('items', time),
      this.getRecentByType('views', time),
      this.getRecentByType('bandwidth', time)
    ])

    return { users, items, views, bandwidth }
  }

  // time is scale in days
  async getRecentByType(type, time) {
    const now = new Date()
    now.setDate(now.getDate() - time)

    const stats = await StatModel.find({
      time: { $gte: now },
      field: type,
    })

    return stats.map(stat => ({
      time: stat.time,
      value: stat.value
    }))
  }

  async update() {
    console.log('updating statistics')

    const userCount = await UserModel.countDocuments()
    const itemCount = await ItemModel.countDocuments()

    let viewCountResponse = await ItemModel.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: "$metadata.views"
        }
      }
    }])

    if (viewCountResponse.length === 0) {
      viewCountResponse = [{ total: 0 }]
    }

    const viewCount = viewCountResponse[0].total

    let bandwidthUsedResponse = await ItemModel.aggregate([{ $match: {} }, {
      $group: {
        _id: null,
        total: {
          $sum: { $multiply: ["$metadata.views", "$metadata.size"] }
        }
      }
    }])

    if (bandwidthUsedResponse.length === 0) {
      bandwidthUsedResponse = [{ total: 0 }]
    }

    const bandwidthUsed = bandwidthUsedResponse[0].total

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