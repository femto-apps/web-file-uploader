## File Uploader

A service that lets you host a public / private file uploading service.

### Design & Architecture

MongoDB Store

```javascript
Item {
    _id: ObjectId,
    name: {
        original: String,
        extension: String
    },
    storage: {
        store: String,
        filepath: String
    },
    metadata: {
        views: Integer,
        createdAt: Date,
        updatedAt: Date
    },
    user: {
        _id: ObjectId
    }
}
```

Architecture

1. User Upload
2. Decide File Type
3. Enrich File
4. Store File

1. User Download
2. Get item from database
3. Upload based on type


Caching might only work if we keep stats in Redis via:
    https://github.com/carlosabalde/libvmod-redis
We could have a pub / sub model to keep page views up to date.