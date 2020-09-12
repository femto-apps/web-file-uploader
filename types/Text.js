const memoize = require('p-memoize')
const toArray = require('stream-to-array')
const fs = require('fs').promises
const tmp = require('tmp')
const resolvePath = require('resolve-path')
const execa = require('execa')
const { v4: uuidv4 } = require('uuid')
const sharp = require('sharp')
const smartcrop = require('smartcrop-sharp')
const config = require('@femto-apps/config')

const Utils = require('../modules/Utils')

const Base = require('./Base')

const name = 'text'
const tempDir = tmp.dirSync()

const generateThumb = memoize(async item => {
  console.log('Generating text item thumbnail for', item)

  const uuid = uuidv4()

  // We don't know what this file is, so we have no idea what the thumb should look like.
  // 256, 256 smart crop
  const itemBuffer = await Utils.getFirstLines(await item.item.getItemStream(), 12)
  const tempPath = resolvePath(tempDir.name, (await item.getName()) + uuid)

  await fs.writeFile(tempPath, itemBuffer, 'utf-8')

  const {stdout, stderr} = await execa(config.get('carbon.path'), ['-h', tempPath, '-t', uuid])
  await Utils.move(`${uuid}.png`, `${tempPath}.png`)
  const body = await fs.readFile(`${tempPath}.png`)

  const result = await smartcrop.crop(body, { width: 256, height: 256 })
  const crop = result.topCrop

  const buffer = await sharp(body)
    .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
    .resize(256, 256)
    .toBuffer()

  await item.setThumb(buffer)
})

class Text extends Base {
  constructor(item) {
    super(item)
    
    this.generateThumb = generateThumb
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