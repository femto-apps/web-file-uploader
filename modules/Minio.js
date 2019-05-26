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

    async download(bucket, file) {
        const stream = await this.client.getObject(bucket, file)

        return stream
    }

    async save({ bucket, filepath }, stream) {
        const res = await this.client.putObject(bucket, filepath, stream)

        return res
    }
}

module.exports = MinioModule