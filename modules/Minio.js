const config = require('@femto-apps/config')
const Minio = require('minio')

class MinioModule {
    constructor() {
        this.client = new Minio.Client({
            endPoint: config.get('minio.host'),
            port: config.get('minio.port'),
            useSSL: false,
            accessKey: config.get('minio.accessKey'),
            secretKey: config.get('minio.secretKey')
        })
    }

    async download(bucket, file, range) {
        if (typeof range === 'undefined') return this.client.getObject(bucket, file)
        return this.client.getPartialObject(bucket, file, range.start, range.end - range.start)
    }

    async stat(bucket, file) {
        const stats = await this.client.statObject(bucket, file)

        return stats
    }

    async save({ bucket, filepath }, stream) {
        const res = await this.client.putObject(bucket, filepath, stream)

        return res
    }
}

module.exports = MinioModule