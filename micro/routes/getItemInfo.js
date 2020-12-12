const prettyBytes = require('pretty-bytes')
const dateFormat = require('dateformat')

const { cachedGetItem } = require('../helpers')

module.exports = async (req, res) => {
    const item = await cachedGetItem(req.params.item)

    return res.page('info', {
        item: item.item.item,
        title: 'Info',
        prettyBytes,
        dateFormat,
        isOwner: await item.ownedBy(req.user)
    })
}