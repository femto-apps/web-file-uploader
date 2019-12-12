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
            return { url: location.href + JSON.parse(text).data.short }
        }
    })

uppy.on('complete', (result) => {
    console.log('Upload complete! We’ve uploaded these files:', result.successful)
})

const shortenButton = document.getElementById('shorten-url')
shortenButton.addEventListener('click', () => {
    const url = prompt('URL to Shorten')
    fetch('')
})