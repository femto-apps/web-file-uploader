const Utils = require('../../modules/Utils')
const { createItem, bustCache } = require('../helpers')

module.exports = async (req, res) => {
    const filename = req.file.originalname
    const expiry = Utils.parseExpiry(req.body.expiry)
    const storage = req.file.storage

    const mimetype = req.file.mimetype
    const encoding = req.file.encoding

    const user = req.user && req.user.getIdentifier() ? { _id: req.user.getIdentifier() } : { ip: req.ip }

    const { item, store, short } = await createItem(storage, {
        expiry, mimetype, encoding, filename, user
    })

    await bustCache(short.short)

    return res.json({ data: short.short })
}