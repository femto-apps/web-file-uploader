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

Minio Store

```javascript
items\
    192.168.1.1\
        37d05c1b-b342-44a4-a410-c5c834823c2f
        71c387a8-7cf2-408c-904c-fc8aedeabf6a
    user_1\
        b1f5a721-bd26-4f6a-83a1-7914be4c115e
    user_2\
        85e61a8e-6f25-442a-9484-bf693e157679
        6a6ce510-01c4-43d2-bf5d-c778dcd2d1a1
        5facc453-f5fc-48bc-8dd9-77c3f0116f30
```