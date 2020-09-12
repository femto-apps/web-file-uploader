const FormData = require('form-data')
const config = require('@femto-apps/config')
const fetch = require('node-fetch')
const hjson = require('hjson')

class ClamAV {
    constructor() {

    }

    async scan(filename, stream) {
        const form = new FormData()
        form.append('file', stream, { filename })

        return fetch(`${config.get('clamav.url')}/scan`, {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        })
            .then(res => res.text())
            .then(res => {
                try {
                    return hjson.parse(res)
                } catch(e) {
                    console.error('invalid clamav response', res)
                }
            })
    }
}

module.exports = ClamAV
