const express = require('express')
const path = require('path')
const morgan = require('morgan')
const config = require('@femto-apps/config')

const Router = require('../Router')
const uploadFile = require('../services/uploadFile')
const shortenUrl = require('../services/shortenUrl')
const admin = require('../services/admin')

const app = express()
const router = new Router()

app.set('view engine', 'pug')
app.set('views', '../../views')

app.use((req, res, next) => {
    res.set('X-CLUSTER', 'admin')
    next()
})
app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../public/favicons')))
app.use(morgan('dev'))

app.use(uploadFile(router))
app.use(shortenUrl(router))
app.use(admin(router))

app.listen(config.get('cluster.miscPort'), () => console.log(`listening on port ${config.get('cluster.miscPort')}`))