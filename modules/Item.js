const _ = require('lodash')
const uuidv4 = require('uuid/v4')
const path = require('path')

const ItemModel = require('../models/Item')
const Short = require('./Short')
const Store = require('./Store')
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

    async getMime() {
        return this.item.metadata.mime
    }

    async getName() {
        return this.item.name.original
    }

    async getCanonical() {
        console.log(this.item.references.canonical)
        return this.item.references.canonical
    }

    async getStore(store) {
        return new Store(_.get(this.item, store))
    }

    async getItem(item) {
        return new Item(_.get(this.item, item))
    }

    async getItemStream(range) {
        const itemStore = await this.getStore('references.storage')
        
        return itemStore.getStream(range)
    }

    async getItemStat() {
        const itemStore = await this.getStore('references.storage')
        
        return itemStore.getStat()
    }

    async getThumbStream() {
        const thumbItem = await this.getItem('references.thumb')
        return thumbItem.getItemStream()
    }

    async hasThumb() {
        return typeof this.item.references.thumb !== 'undefined'
    }

    async setThumb(stream) {
        const itemStore = await this.getStore('references.storage')
        const filename = uuidv4()

        const thumbStorage = await Store.create({
            store: 'minio',
            bucket: 'items',
            folder: await itemStore.getFolder(),
            filename: filename,
            filepath: path.posix.join(await itemStore.getFolder(), filename)
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
                storage: await thumbStorage.getModel()
            },
            user: this.item.user
        })

        this.item.references.thumb = await thumb.getModel()
        await this.item.save()
    }

    async getModel() {
        return this.item
    }

    async incrementViews() {
        return ItemModel.findOneAndUpdate({ _id: this.item._id }, { $inc : { 'metadata.views' : 1 } }).exec()
    }

    async id() {
        return this.item._id
    }
}

module.exports = Item