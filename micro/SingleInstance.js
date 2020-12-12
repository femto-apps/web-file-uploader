const express = require('express')
const path = require('path')
const morgan = require('morgan')

const Router = require('./Router')
const uploadFile = require('./services/uploadFile')
const shortenUrl = require('./services/shortenUrl')
const getItem = require('./services/getItem')
const admin = require('./services/admin')

const app = express()

const router = new Router()

app.set('view engine', 'pug')
app.set('views', '../views')

app.use(express.static(path.join(__dirname, '../public')))
app.use(morgan('dev'))

app.use(uploadFile(router))
app.use(shortenUrl(router))
app.use(admin(router))
app.use(getItem(router))

app.listen(3050, () => console.log('listening on port 3050'))