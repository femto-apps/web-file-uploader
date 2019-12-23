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

    static getUser(req) {
        if (req.body && req.body.apiKey && !req.user) {
            return User.fromApiKey(req.body.apiKey)
        }

        return req.user
    }
}

module.exports = Utils