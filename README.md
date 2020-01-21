# Simple Google Storage Proxy

## Features

 * Automatically switching over storage backend with Filesystem and Cloud Storage
 * support simple API in only one Bucket

## APIs

 * `async getContainers()`
 * `async getContainer()`
 * `async write(file, data)`
 * `async read(file)`
 * `async getFiles()`
 * `async getFile()`
 * `async removeFile(file)`

## Example

```javascript
const StorageProxyCreator = require('storage-proxy-creator')

const storage = StorageProxyCreator.create(<containerName>, options)

;(async () => {
  (await storage.getFiles()).forEach((file) => {
    console.log(file)
  })
})()
```
