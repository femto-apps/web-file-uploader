const Utils = require('../../modules/Utils')
const { getItem } = require('../helpers')

module.exports = async (req, res) => {
    const item = await getItem(req.params.item)

    if (!item.ownedBy(req.user)) {
        return res.json({ removed: false, err: 'You do not own this item.' })
    }

    await item.delete()

    return res.json({ removed: true })
}