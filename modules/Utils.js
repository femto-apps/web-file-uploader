const User = require('../modules/User')
const fs = require('fs')
const qs = require('qs')

class Utils {
    constructor() { }

    static parseExpiry(relativeExpiry) {
        if (relativeExpiry === undefined) {
            return undefined
        }

        const expiry = Number(relativeExpiry)

        if (expiry < 0 || expiry > 60 * 60 * 24 * 365 * 1000) {
            expiresAt = undefined
        }

        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + expiry)

        return expiresAt
    }

    static getFirstLines(stream, lineCount) {
        return new Promise((resolve, reject) => {
            let data = ''
            let lines = []

            stream.on('data', chunk => {
                data += chunk.toString('utf-8')
                lines = data.split('\n')

                if (lines.length > lineCount + 1) {
                    stream.destroy()
                    lines = lines.slice(0, lineCount)
                    resolve(lines.join('\n'))
                }
            })

            stream.on('error', err => reject(err))
            stream.on('end', () => resolve(lines.join('\n')))
        })
    }

    static move(oldPath, newPath) {
        return new Promise((res, rej) => {
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    if (err.code === 'EXDEV') {
                        copy()
                    } else {
                        rej(err)
                    }
                    return
                }
                res()
            })

            function copy() {
                var readStream = fs.createReadStream(oldPath)
                var writeStream = fs.createWriteStream(newPath)

                readStream.on('error', rej)
                writeStream.on('error', rej)

                readStream.on('close', function () {
                    fs.unlink(oldPath, err => {
                        if (err) return rej(err)
                        return res()
                    })
                })

                readStream.pipe(writeStream)
            }
        })
    }

    static addQuery(url, query, value) {
        let parts = url.split('?')

        const extractedQuery = qs.parse(parts[1])
        extractedQuery[query] = value

        return parts[0] + '?' + qs.stringify(extractedQuery)
    }
}

module.exports = Utils