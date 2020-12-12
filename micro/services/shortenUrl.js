const config = require('@femto-apps/config')
const Multer = require('multer')

const routes = require('../routes')
const helpers = require('../helpers')

const multer = Multer().none()

module.exports = router => {
    helpers.connectToMongoose()

    router.parseURLEncoded()
    router.parseCookies()
    router.setupSessions()
    router.setupAuthentication()

    router.use(router.session)
    router.use(router.authenticate)
    router.use(router.parseUser)

    router.options(['/i/upload/url', '/upload/url'], router.cors())
    router.post(['/i/upload/url', '/upload/url'],
        router.cors(),
        multer,
        routes.postUrl
    )

    return router
}