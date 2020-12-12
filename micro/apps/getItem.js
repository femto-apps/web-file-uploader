const express = require('express')
const morgan = require('morgan')
const config = require('@femto-apps/config')
const { cachedGetItem } = require('../helpers')

const Router = require('../Router')
const getItem = require('../services/getItem')

const app = express()

const router = new Router()

app.use(morgan('dev'))
app.use((req, res, next) => {
    res.set('X-CLUSTER', 'get')
    next()
})
app.use(getItem(router))

app.listen(config.get('cluster.getPort'), () => console.log(`listening on port ${config.get('cluster.getPort')}`))

const cluster = express()
cluster.get('/buster', (req, res) => {
    console.log('deleted cache for', req.query.short)
    cachedGetItem.delete(req.query.short)
    res.json({ deleted: true })
})
cluster.listen(config.get('cluster.getClusterPort'), () => console.log(`cluster listening on port ${config.get('cluster.getClusterPort')}`))