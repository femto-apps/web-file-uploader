const memoize = require('p-memoize')
const { createCanvas, loadImage } = require('canvas')
const path = require('path')

const Store = require('../modules/Store')
const Minio = require('../modules/Minio')

const name = 'base'

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

    ctx.fillText(name, 128, 220, 242)

    const stream = canvas.createPNGStream()
    await item.setThumb(stream)
})

class Base {
    constructor(item) {
        this.item = item
        this.generateThumb = generateThumb
    }

    get name() {
        return name
    }

    static async detect(stream, data) {
        return {
            stream,
            result: name
        }
    }

    static async match(item) {
        return await item.getFiletype() === name
    }

    async serve(req, res) {
        res.set('Content-Disposition', await this.getFileName())
        res.set('Content-Type', await this.getMime())

        const stream = await this.item.getItemStream()

        stream.pipe(res)
    }

    async raw(req, res) {
        
    }

    async thumb(req, res) {
        if (!(await this.hasThumb())) {
            console.log(`Generating thumb for ${await this.item.id()}`)
            await this.generateThumb(this)
        }

        res.set('Content-Disposition', await this.getFileName())
        res.set('Content-Type', 'image/png')

        const stream = await this.item.getThumbStream()
        stream.pipe(res)
    }

    async setThumb(stream) {
        return this.item.setThumb(stream)
    }

    async hasThumb() {
        return this.item.hasThumb()
    }

    async getName() {
        return this.item.getName()
    }

    async delete() {

    }

    async getMime() {
        return this.item.getMime()
    }

    async getFileName() {
        return `filename=${await this.item.getName()}`
    }

    async generateThumb() {
        throw new Error('Dummy function, should be implemented in constructor.')
    }
}

module.exports = Base