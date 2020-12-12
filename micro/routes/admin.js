const config = require('@femto-apps/config')

const Mail = require('../../modules/Mail')

const mail = new Mail(config.get('email'))

module.exports.getHome = (req, res) => {
    res.page('home', {
        title: 'Home',
        origin: config.get('url.origin')
    })
}

module.exports.getIssue = (req, res) => {
    res.page('issues', {
        title: 'Issues'
    })
}

module.exports.postIssue = async (req, res) => {
    console.log('sending suggestion', req.body)
    const response = await mail.sendMail({
        from: 'uploader@femto.host',
        to: 'uploader@femto.host',
        subject: 'Contact Form',
        text: `Contact: ${req.body.contact}\nMessage: ${req.body.issue}`
    })

    res.send("thanks for your message, if you entered in a way to contact you we'll be in touch with our response :)")
}

module.exports.getStats = (req, res) => {
    res.send('temp disabled')
}

module.exports.getUploader = (req, res) => {
    res.setHeader('Content-Disposition', `attachment; filename="${config.get('title.name')}.sxcu"`)
    res.setHeader('Content-Type', 'application/octet-binary; charset=utf-8')
    res.send(JSON.stringify({
        Name: config.get('title.suffix'),
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

module.exports.getShortener = (req, res) => {
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

module.exports.getTerms = (req, res) => {
    res.page('terms', {
        title: 'Terms of Service'
    })
}

module.exports.getPrivacy = (req, res) => {
    res.page('privacy', {
        title: 'Privacy'
    })
}

module.exports.getRobots = (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(`User-agent: *\nAllow: /`)
}