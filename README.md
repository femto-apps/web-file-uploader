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
        filename: String
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