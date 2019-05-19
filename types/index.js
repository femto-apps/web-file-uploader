const fileType = require('file-type')

const types = [
    require('./Base') // matches everything
]

class Types {
    static async detect(req, file) {
        // `stream` contains the data we wish to upload.  It cannot be consumed without
        // a passthrough (if this happens,  we'll have no data to upload to Minio).

        const data = {
            mime: file.mimetype,
            encoding: file.encoding   
        }

        // We first pass it through some initial checks
        let stream = await fileType.stream(file.stream)

        if (stream.fileType && stream.fileType.mime) {
            data.mime = stream.fileType.mime
        }

        for (let Type of types) {
            const result = await Type.detect(stream, data)
            stream = result.stream

            if (result.result) {
                data.filetype = result.result
                break
            }
        }

        return {
            stream: stream,
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