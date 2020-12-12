const Collection = require('../../modules/Collection')

module.exports = async (req, res) => {
    if (!req.user) {
        res.send('Please login to see uploads')
    }

    const collection = await Collection.fromReq(req)
    const items = (await collection.list())
        .filter(item => item.item.metadata.filetype !== 'thumb')
        .filter(item => item.item.metadata.expired !== true)
        .filter(item => item.item.deleted !== true)

    res.page('uploads', {
        title: 'Uploads',
        items
    })
}