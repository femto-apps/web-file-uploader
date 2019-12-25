const User = require('../modules/User')

class Utils {
    constructor() {}

    static parseExpiry(relativeExpiry) {
        if (relativeExpiry === undefined) {
            return undefined
        }

        const expiry = Number(req.body.expiry)

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
}

module.exports = Utils