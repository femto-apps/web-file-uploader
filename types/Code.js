const CombinedStream = require('combined-stream')
const languageDetect = require('language-detect')

const Text = require('./Text')

const name = 'code'

class Code extends Text {
  constructor(item) {
    super(item)
  }

  get name() {
    return name
  }

  static async detect(store, bytes, data) {
    // disabled for now
    return { result: undefined }

    const language = await languageDetect.classify(bytes.toString())

    console.log(language)

    return {
      result: language ? name + '/' + language : undefined
    }
  }

  static async match(item) {
    return (await item.getFiletype()).startsWith(name)
  }
}

module.exports = Code