const nodemailer = require('nodemailer')

class Mail {
    constructor(config) {
        this.transporter = nodemailer.createTransport(config)
    }

    async sendMail(data) {
        return this.transporter.sendMail(data)
    }
}

module.exports = Mail