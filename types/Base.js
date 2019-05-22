const memoize = require('p-memoize')

const Store = require('../modules/Store')

const name = 'base'

const generateThumb = memoize((item) => {
    // We don't know what this file is, so we have no idea what the thumb should look like.
    
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
        return item.metadata.filetype === name
    }

    async serve(req, res) {
        res.set('Content-Disposition', await this.getName())
        res.set('Content-Type', await this.getMime())

        const itemStore = new Store(this.item.storage.item)

        const stream = await itemStore.getStream()
        stream.pipe(res)
    }

    async raw(req, res) {
        
    }

    async thumb(req, res) {
        if (!this.thumbExists()) {
            await this.generateThumb(this)
        } 
    }

    async thumbExists() {
        // check if a thumb exists already for this.
    }

    async delete() {

    }

    async getMime() {
        return this.item.metadata.mime
    }

    async getName() {
        return `filename=${this.item.name.original}`
    }

    async generateThumb() {

    }
}

module.exports = Base