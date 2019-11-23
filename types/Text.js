const Base = require('./Base')

const name = 'text'

class Text extends Base {
  constructor(item) {
    super(item)
  }

  get name() {
    return name
  }

  static async detect(store, bytes, data) {
    // We assume we've already run binary file tests prior to this.
    return {
      result: name
    }
  }

  static async match(item) {
    return await item.getFiletype() === name
  }
}

module.exports = Text