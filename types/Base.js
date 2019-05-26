const memoize = require('p-memoize')
const { createCanvas } = require('canvas')
const uuidv4 = require('uuid/v4')
const path = require('path')
const _ = require('lodash')

const Store = require('../modules/Store')
const Minio = require('../modules/Minio')

const name = 'base'

const generateThumb = memoize(async item => {
    // We don't know what this file is, so we have no idea what the thumb should look like.
    const { createCanvas } = require('canvas')
    const canvas = createCanvas(256, 256)
    const ctx = canvas.getContext('2d')

    ctx.font = '30px Impact'
    ctx.rotate(0.1)
    ctx.fillText('Awesome!', 50, 100)

    const text = ctx.measureText('Awesome!')
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.beginPath()
    ctx.lineTo(50, 102)
    ctx.lineTo(50 + text.width, 102)
    ctx.stroke()

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
        if (!(await this.thumbExists())) {
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

    async thumbExists() {
        // check if a thumb exists already for this.

        console.log(typeof this.item.storage.thumb)
        return typeof this.item.storage.thumb !== 'undefined'
    }

    async delete() {

    }

    async getMime() {
        return this.item.metadata.mime
    }

    async getFileName() {
        return `filename=${this.item.getName()}`
    }

    async generateThumb() {

    }

    async getReference(ref) {
        await this.item.populate(`references.${ref}`)

        return _.get(this.item.references, ref)
    }
}

module.exports = Base