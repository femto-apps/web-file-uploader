const config = require('@femto-apps/config')
const nvt = require('node-virustotal')

class VirusTotal {
    constructor() {
        this.instance = nvt.makeAPI()
        this.instance.setDelay(15000)
    }

    async scan(item) {
        const stream = await store.getItemStream()
        if (!config.get('clamav.enabled')) {
            return {
                disabled: true
            }
        }

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
                } catch (e) {
                    console.log(res)
                    console.error('invalid clamav response', res)
                }
            })
    }
}

module.exports = VirusTotal
