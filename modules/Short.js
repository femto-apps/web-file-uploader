const ShortModel = require('../models/Short')

const alphabet = '23456789abcdefghijkmnpqrstuvwxyz'

// A short transforms a small string to an item reference
class Short {
  constructor(short) {
    this.short = short
  }

  static async createReference(short, item) {
    console.log(short, item)

    const shortItem = new ShortModel({
      short, item: item._id
    })

    await shortItem.save()

    return new Short(shortItem)
  }

  static async generate(options) {
    if (typeof options === 'undefined') options = {}
    if (typeof options.keyLength === 'undefined') options.keyLength = 4

    let short = ''

    for (let i = 0; i < options.keyLength; i++) {
      short += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length))]
    }

    if (await ShortModel.findOne({ short })) {
      return Short.generate(options)
    }

    return short
  }

  static async get(short) {
    const shortItem = await ShortModel.findOne({ short })
      .populate('item')

    return shortItem
  }

  id() {
    return this.short._id
  }
}

module.exports = Short