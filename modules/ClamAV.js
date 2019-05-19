const NodeClam = require('clamscan')

class ClamAV {
    constructor() {
        this.scan = new NodeClam().init({
            clamdscan: {
                socket: '/var/run/clamd.scan/clamd.sock',
                host: '127.0.0.1',
                port: 3310
            }
        })
    }

    async scan(stream) {
        const infected = await this.scan.scan_stream(stream)

        return infected
    }
}

module.exports = ClamAV