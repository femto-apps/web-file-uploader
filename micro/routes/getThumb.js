const { getItem } = require('../helpers')

module.exports = async (req, res) => {
    const item = await getItem(req.params.item)

    if (!item) {
        return res.status(404).send("Sorry, can't find that!")
    }

    return item.thumb(req, res)
}