const config = require('@femto-apps/config')
const Multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const routes = require('../routes')
const minioStorage = require('../../modules/MinioMulterStorage')
const Collection = require('../../modules/Collection')

const helpers = require('../helpers')

const multer = Multer({
    storage: minioStorage({
        minio: Object.assign({}, config.get('minio'), { endPoint: config.get('minio.host') }),
        bucket: (req, file) => config.get('minio.itemBucket'),
        folder: async (req, file) => {
            return (await Collection.fromReq(req)).path
        },
        filename: async (req, file) => {
            return uuidv4()
        }
    }),
    limits: { fileSize: 8589934592 }
}).single('upload')

module.exports = router => {
    helpers.connectToMongoose()

    router.parseURLEncoded()
    router.parseCookies()
    router.setupSessions()
    router.setupAuthentication()

    router.use(router.session)
    router.use(router.authenticate)
    router.use(router.parseUser)

    router.options(['/i/upload', '/upload', '/upload/multipart'], router.cors())
    router.post(['/i/upload', '/upload', '/upload/multipart'],
        router.cors(),
        multer,
        routes.postUpload
    )

    return router
}