const helpers = require('../helpers')
const { getThumb, getItem } = require('../routes')

module.exports = router => {
    helpers.connectToMongoose()

    router.get(['/thumb/:item', '/thumb/:item/*'], getThumb)
    router.get(['/:item', '/:item/*'], getItem)

    return router
}