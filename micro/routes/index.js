const postUpload = require('./postUpload')
const postUrl = require('./postUrl')
const admin = require('./admin')
const getItemInfo = require('./getItemInfo')
const deleteItem = require('./deleteItem')
const getUploads = require('./getUploads')
const getItem = require('./getItem')
const getThumb = require('./getThumb')

module.exports = {
    postUpload,
    postUrl,
    getItemInfo,
    deleteItem,
    getUploads,
    getItem,
    getThumb,
    ...admin
}