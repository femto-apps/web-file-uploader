const StoreModel = require('../models/Store')
const Minio = require('./Minio')

class Store {
    constructor(store) {
        this.store = store
    }

    static async create(storeParams) {
        const store = new StoreModel(storeParams)

        await store.save()

        return new Store(store)
    }

    id() {
        return this.store._id
    }

    async getStream() {
        if (this.store.store === 'minio') {
            const minio = new Minio()
            const stream = await minio.download(this.store.bucket, this.store.filepath)

            return stream
        }
    }
    
    async getFolder() {
        return this.store.folder
    }

    async getModel() {
        return this.store
    }

    async setStream(stream) {
        if (this.store.store === 'minio') {
            const minio = new Minio()
            await minio.save({
                bucket: this.store.bucket,
                filepath: this.store.filepath
            }, stream)
        }
    }
}

module.exports = Store