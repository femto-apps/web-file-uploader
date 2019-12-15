const Base = require('./Base')

const name = 'url'

class Url extends Base {
    constructor(item) {
        super(item)
    }

    get name() {
        return name
    }

    static async detect(store, bytes, data) {
        return false
    }

    static async match(item) {
        return (await item.getFiletype()).startsWith(name)
    }

    async serve(req, res) {
        if (await this.getExpired()) {
            return res.send('This item has expired.')
        }

        res.redirect(await this.getName())
        await this.incrementViews()
    }

    async raw(req, res) {
        return res.send('Thumb hasn\'t been implemented for URLs.')
    }

    async thumb(req, res) {
        if (await this.getExpired()) {
            return res.send('This item has expired.')
        }

        return res.send('Thumb hasn\'t been implemented for URLs.')
    }
}

module.exports = Url