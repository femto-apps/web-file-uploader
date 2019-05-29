const Base = require('./Base')
const memoize = require('p-memoize')
const { createCanvas, loadImage } = require('canvas')
const path = require('path')

const name = 'image'

const generateThumb = memoize(async item => {
  // We don't know what this file is, so we have no idea what the thumb should look like.
  const canvas = createCanvas(256, 256)
  const ctx = canvas.getContext('2d')

  const unknownImagePath = path.posix.join(__dirname, '../public/images/unknown_file.png')
  const unknown = await loadImage(unknownImagePath)
  ctx.drawImage(unknown, 0, 0)

  ctx.font = '25px Sans'
  ctx.textAlign = 'center';

  let name = await item.getName()
  if (name.length > 19) {
      name = name.substring(0, 16) + '...'
  }

  ctx.fillText('image', 128, 55, 242)
  ctx.fillText(name, 128, 220, 242)

  const stream = canvas.createPNGStream()
  await item.setThumb(stream)
}) 

class Image extends Base {
  constructor(item) {
    super(item)

    this.generateThumb = generateThumb
  }

  get name() {
    return name
  }

  static async detect(stream, data) {
    return {
      stream,
      result: data.mime.startsWith('image/') ? name : undefined
    }
  }

  static async match(item) {
    return await item.getFiletype() === name
  }
}

module.exports = Image