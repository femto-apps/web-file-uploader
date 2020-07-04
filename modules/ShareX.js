const config = require('@femto-apps/config')

class ShareX {
  constructor() {}

  static async downloadUploader(req, res) {
    res.setHeader('Content-Disposition', `attachment; filename="${config.get('title.name')}.sxcu"`)
    res.setHeader('Content-Type', 'application/octet-binary; charset=utf-8')
    res.send(JSON.stringify({
      Name: 'Femto Uploader',
      DestinationType: 'ImageUploader, TextUploader, FileUploader',
      RequestURL: `${config.get('url.origin')}upload/multipart`,
      FileFormName: 'upload',
      Arguments: {
        apiKey: req.user ? req.user.getApiKey() : undefined
      },
      URL: `${config.get('url.origin')}$json:data.short$`,
      ThumbnailURL: `${config.get('url.origin')}thumb/$json:data.short$`,
      DeletionURL: `${config.get('url.origin')}delete/$json:data.short$?apiKey=${req.user ? req.user.getApiKey() : undefined}`
    }))
  }

  static async downloadShortener(req, res) {
    res.setHeader('Content-Disposition', `attachment; filename="${config.get('title.shortener')}.sxcu"`)
    res.setHeader('Content-Type', 'application/octet-binary; charset=utf-8')
    res.send(JSON.stringify({
      Name: config.get('title.shortener'),
      DestinationType: 'URLShortener',
      RequestURL: `${config.get('url.origin')}upload/url`,
      Arguments: {
        apiKey: req.user ? req.user.getApiKey() : undefined,
        text: '$input$'
      },
      URL: `${config.get('url.origin')}$json:data.short$`,
      ThumbnailURL: `${config.get('url.origin')}thumb/$json:data.short$`,
      DeletionURL: `${config.get('url.origin')}delete/$json:data.short$?apiKey=${req.user ? req.user.getApiKey() : undefined}`
    }))
  }
}

module.exports = ShareX