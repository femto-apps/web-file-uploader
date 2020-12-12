const Utils = require('../../modules/Utils')
const { createUrlItem, bustCache } = require('../helpers')

module.exports = async (req, res) => {
    const expiry = Utils.parseExpiry(req.body.expiry)
    const user = req.user && req.user.getIdentifier() ? { _id: req.user.getIdentifier() } : { ip: req.ip }
    const url = req.body.url || req.body.text

    const { item, short } = await createUrlItem(url, {
        expiry, user
    })

    await bustCache(short.short)

    return res.json({ data: short.short })
}