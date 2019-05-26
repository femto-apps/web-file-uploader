const _ = require('lodash')

const ItemModel = require('../models/Item')
const Short = require('./Short')
const Types = require('../types')

class Item {
    constructor(item) {
        this.item = item
    }

    static async create(itemInformation) {
        const item = new ItemModel(itemInformation)
        await item.save()

        return new Item(item)
    }

    static async fromReq(req, res, next) {
        const short = await Short.get(req.params.item)

        if (short === null) {
            return res.json({ error: 'Short not found' })
        }

        const item = new Item(short.item)

        req.item = await Types.match(item)
        next()
    }

    async setCanonical(shortItem) {
        this.item.references.canonical = shortItem.id()
        await this.item.save()
    }

    async getFiletype() {
        return this.item.metadata.filetype
    }

    async getName() {
        return this.item.name.original
    }

    async getStore(store) {
        await this.item.populate(store)
        return new Store(_.get(this.item, store))
    }

    async getItemStream() {
        const itemStore = await this.getStore('references.storage')
        return itemStore.getStream()
    }

    async getThumbStream() {
        const thumbStore = await this.getStore('references.thumb')
        return thumbStore.getStream()
    }

    async setThumb(stream) {
        const itemStore = await this.getStore('references.storage')
        const filename = uuidv4()

        const thumbStorage = await Store.create({
            store: 'minio',
            bucket: 'items',
            folder: itemStore.folder,
            filename: filename,
            filepath: path.posix.join(itemStore.folder, filename)
        })

        await thumbStorage.setStream(stream)

        const thumb = await Item.create({
            name: {
                original: `${this.item.name.filename}.png`,
                extension: 'png',
                filename: this.item.name.filename
            },
            metadata: {
                mime: 'image/png',
                encoding: '7bit',
                filetype: 'thumb',
                expiresAt: this.item.metadata.expiresAt
            },
            references: {
                storage: thumbStorage
            },
            user: this.item.user
        })

        this.item.references.thumb = thumb
        await this.item.save()
    }

    async id() {
        return this.item._id
    }
}

module.exports = Item