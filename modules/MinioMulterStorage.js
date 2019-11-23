const Minio = require('minio')
const path = require('path')

class MinioMulterStorage {
    constructor(opts) {
        for (let requirement of ['bucket', 'folder', 'filename', 'minio']) {
            if (typeof opts[requirement] === 'undefined') { throw new Error(`Expects ${requirement}`) }
        }
        
        this.bucket = opts.bucket
        this.folder = opts.folder
        this.filename = opts.filename
        this.middleware = opts.middleware

        this.minio = opts.minio
        this.client = new Minio.Client(this.minio)
    }

    async _handleFile(req, file, cb) {
        const bucket = await this.bucket(req, file)
        const folder = await this.folder(req, file)
        const filename = await this.filename(req, file)
        const filepath = path.posix.join(folder, filename)

        this.client.putObject(bucket, filepath, file.stream, undefined, (err, etag) => {
            cb(err, Object.assign({}, {
                storage: {
                    store: 'minio',
                    bucket,
                    folder,
                    filename,
                    filepath
                }
            }))
        })
    }

    _removeFile(req, file, cb) {
        // remove file.path
        console.log('removal of files has to be implemented', file.path)

        // fs.unlink(file.path, cb)
    }
}

module.exports = opts => new MinioMulterStorage(opts)