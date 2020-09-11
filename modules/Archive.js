const archiver = require('archiver')
const Minio = require('./Minio')

class Archive {
    constructor() {
    }

    static async archive(pipe, items) {
        const minio = new Minio()

        const archive = archiver('zip', {
            zlib: { level: 9 }
        })

        pipe.on('close', function () {
            console.log(archive.pointer() + ' total bytes')
            console.log('archiver has been finalized and the output file descriptor has closed.')
        })

        pipe.on('end', function () {
            console.log('Data has been drained')
        })

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
                console.log('archive warning', err)
            } else {
                // throw error
                throw err
            }
        })

        archive.on('error', function (err) {
            throw err;
        })

        archive.on('end', () => {
            console.log('archive end')
            pipe.end()
        })

        archive.pipe(pipe)

        let i = 0

        for (let item of items) {
            console.log('getting an item')
            const itemStore = await item.getStore('references.storage')
            console.log('got store', itemStore.store.filepath, itemStore.store.bucket)
            const stream = await minio.download(itemStore.store.bucket, itemStore.store.filepath )
            console.log('got download')
            archive.append(stream, { name: item.item.name.original })
            console.log('appended stream')
            if (i > 100) {
                break
            }
            i++
        }

        archive.finalize()
    }
}

module.exports = Archive