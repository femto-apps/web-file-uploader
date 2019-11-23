const MultiStream = require('multistream')
const toStream = require('buffer-to-stream')
const isBinaryFile = require('isbinaryfile').isBinaryFile

const Base = require('./Base')

const name = 'binary'

class Binary extends Base {
  constructor(item) {
    super(item)
  }

  get name() {
    return name
  }

  static async detect(store, bytes, data) {
    const isBinary = await isBinaryFile(bytes, bytes.length)

    return {
      result: isBinary ? name : undefined
    }
  }

  static async match(item) {
    return await item.getFiletype() === name
  }
}

module.exports = Binary