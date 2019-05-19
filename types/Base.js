const Minio = require('../modules/Minio')

const name = 'base'

class Base {
    constructor(item) {
        this.item = item
        this.minio = new Minio()
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
        res.set('Content-Disposition', `filename=${this.item.name.original}`)
        res.set('Content-Type', this.item.metadata.mime)

        const stream = await this.minio.download(this.item.storage.bucket, this.item.storage.filepath)
        stream.pipe(res)
    }

    async download(req, res) {
        
    }

    async thumb(req, res) {

    }

    async delete() {

    }
}

module.exports = Base