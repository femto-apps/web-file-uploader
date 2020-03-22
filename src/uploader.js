// Import the plugins
const Uppy = require('@uppy/core')
const XHRUpload = require('@uppy/xhr-upload')
const Dashboard = require('@uppy/dashboard')

// And their styles (for UI plugins)
require('@uppy/core/dist/style.css')
require('@uppy/dashboard/dist/style.css')
require('./css/uploader.css')

const uppy = Uppy({
    autoProceed: false,
})
    .use(Dashboard, {
        trigger: '#upload-files',
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false, // :( :(
        metaFields: [
            { id: 'expiry', name: 'Expiry', placeholder: 'seconds until expiry' },
            { id: 'name', name: 'Filename', placeholder: 'name of file' },
        ]
    })
    .use(XHRUpload, {
        endpoint: '/upload/multipart', 
        fieldName: 'upload',
        getResponseData(text, resp) {
            const response = JSON.parse(text)
            return { short: response.data.short, url: location.href + response.data.short }
        }
    })

uppy.on('complete', (result) => {
    console.log('Upload complete! We’ve uploaded these files:', result.successful)
})

uppy.on('upload-success', (file, resp) => {
    console.log('Single upload complete', file, resp)

    document.getElementById('upload_container').style.display = 'block'
    document.getElementById('uploads').innerHTML +=
        `<a class='link' href='${resp.body.url}'>${resp.body.url}</a> <span class='comment'># ${file.data.name} (<a class='link' target='_blank' href='/info/${resp.body.short}'>info</a>)</span><br>`

    console.log('resp', resp)
})

const shortenButton = document.getElementById('shorten-url')
shortenButton.addEventListener('click', async () => {
    const url = prompt('URL to Shorten')
    const resp = await fetch('/upload/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
        .then(res => res.json())

    document.getElementById('upload_container').style.display = 'block'
    document.getElementById('uploads').innerHTML += 
        `<a class='link' href='/${resp.data.short}'>${window.location.origin}/${resp.data.short}</a> <span class='comment'># ${url} (<a class='link' target='_blank' href='/info/${resp.data.short}'>info</a>)</span>`

    console.log('resp', resp)
})

const apikey = document.getElementById('apikey')
apikey.addEventListener('click', async () => {
    apikey.select()
})