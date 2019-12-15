const { EventEmitter } = require('events')
const config = require('@femto-apps/config')

const profiling = new EventEmitter()

profiling.on('middleware', ({ req, name, time }) => {
    console.log(req.method, req.url, ':', name, `${time}ms`)
})

function wrap(fn) {
    if (config.get('experimental.profiling') !== true) {
        return function (req, res, next) {
            fn(req, res, function () {
                next.apply(this, arguments)
            })
        }
    }

    return function (req, res, next) {
        const start = Date.now()
        fn(req, res, function () {
            profiling.emit('middleware', {
                req,
                name: fn.name,
                time: Date.now() - start
            })

            next.apply(this, arguments)
        })
    }
}

module.exports = { wrap }