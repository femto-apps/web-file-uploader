const memoize = require('memoizee')
const puppeteer = require('puppeteer')
const sharp = require('sharp')
const smartcrop = require('smartcrop-sharp')

const Base = require('./Base')

const name = 'url'

const generateThumb = memoize(async item => {
    console.log('Generating thumb for URL: ', item)

    // We don't know what this file is, so we have no idea what the thumb should look like.
    const url = await item.getName()

    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(url)
        const body = await page.screenshot()
        await browser.close()
    } catch(e) {
        console.log(e)
        return Base.baseThumb(item)
    }

    const result = await smartcrop.crop(body, { width: 256, height: 256 })
    const crop = result.topCrop
  
    const buffer = await sharp(body)
      .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
      .resize(256, 256)
      .toBuffer()
  
    await item.setThumb(buffer)
  })

class Url extends Base {
    constructor(item) {
        super(item)
        this.generateThumb = generateThumb
    }

    get name() {
        return name
    }

    static async detect(store, bytes, data) {
        return false
    }

    static async match(item) {
        return (await item.getFiletype()).startsWith(name)
    }

    async serve(req, res) {
        if (await this.getExpired()) {
            return res.send('This item has expired.')
        }

        res.redirect(await this.getName())
        await this.incrementViews()
    }

    async raw(req, res) {
        return res.send('Thumb hasn\'t been implemented for URLs.')
    }
}

module.exports = Url