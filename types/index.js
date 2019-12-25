const fileType = require('file-type')

const types = [
    require('./Url'), // matches URLs
    require('./Image'), // matches static images
    require('./Binary'), // matches binary
    require('./Code'), // matches programming codes
    require('./Text'), // matches text

    // this should never be reached.
    require('./Base') // matches everything
]

class Types {
    static async detect(store, bytes, file) {
        // `stream` contains the data we wish to upload.  It cannot be consumed without
        // a passthrough (if this happens,  we'll have no data to upload to Minio).

        const data = {
            mime: file.mimetype,
            encoding: file.encoding
        }

        // We first pass it through some initial checks
       const type = fileType(bytes)

        if (type && type.mime) {
            data.mime = type.mime
        }

        for (let Type of types) {
            const result = await Type.detect(store, bytes, data)

            if (result.result) {
                data.filetype = result.result
                break
            }
        }

        return {
            data
        }
    }

    static async match(item) {
        for (let Type of types) {
            if (await Type.match(item)) {
                return new Type(item)
            }
        }
    }
}

module.exports = Types