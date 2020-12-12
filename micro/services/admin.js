const config = require('@femto-apps/config')

const helpers = require('../helpers')
const routes = require('../routes')

module.exports = router => {
    helpers.connectToMongoose()

    router.parseURLEncoded()
    router.parseCookies()
    router.setupSessions()
    router.enableRendering()

    router.post('/issue', routes.postIssue)
    router.get('/robots.txt', routes.getRobots)

    router.use(router.session)
    router.use(router.authenticate)
    router.use(router.parseUser)

    router.get('/', router.addNav, routes.getHome)

    router.get('/issue', router.addNav, routes.getIssue)

    router.get('/stats', router.addNav, routes.getStats)

    router.get('/sharex/uploader.sxcu', routes.getUploader)
    router.get('/sharex/shortener.sxcu', routes.getShortener)

    router.get('/terms', router.addNav, routes.getTerms)
    router.get('/privacy', router.addNav, routes.getPrivacy)


    router.get('/uploads', router.addNav, routes.getUploads)

    router.get(['/info/:item', '/info/:item/*'],
        router.addNav,
        routes.getItemInfo
    )

    router.get(['/delete/:item', '/delete/:item/*'],
        router.addNav,
        routes.deleteItem
    )

    return router
}