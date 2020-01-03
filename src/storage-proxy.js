const { Readable } = require('stream')
class MethodNotAllowed extends Error {
  get name () { return 'MethodNotAllowed' }
}

/**
 * read and write files proxy under container ( bucket / directory )
 *
 * Create Cloud Storage bucket BEFORE you use this.
 */
class StorageProxy {
  /**
   * @param {object} pkg - pkgcloud.storage.Client
   * @param {string} container
   */
  constructor (pkg, container) {
    this.driver = pkg
    this.container = container
  }

  /**
   * @return {Promise} - Array
   */
  async getContainers () {
    return new Promise((resolve, reject) => {
      this.driver.getContainers((err, containers) => {
        if (err) {
          reject(err)
        } else {
          resolve(containers)
        }
      })
    })
  }

  /**
   * @return {Promise} - reject
   */
  async createContainer () {
    return Promise.reject(new MethodNotAllowed())
  }

  /**
   * @return {Promise} - Container
   */
  async _createContainer () {
    return new Promise((resolve, reject) => {
      this.driver.createContainer(this.container, (err, container) => {
        if (err) {
          reject(err)
        } else {
          resolve(container)
        }
      })
    })
  }

  /**
   * @return {Promise} - boolean
   */
  async destroyContainer () {
    return Promise.reject(new MethodNotAllowed())
  }

  /**
   * @return {Promise} - boolean
   */
  async _destroyContainer () {
    return new Promise((resolve, reject) => {
      this.driver.destroyContainer(this.name, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * @return {Promise} - object
   */
  async getContainer () {
    return new Promise((resolve, reject) => {
      this.driver.getContainer(this.container, (err, container) => {
        if (err) {
          reject(err)
        } else {
          resolve(container)
        }
      })
    })
  }

  /**
   * @param {string} file
   * @param {string} data
   * @return {Promise} - File
   */
  async write (file, data) {
    return new Promise((resolve, reject) => {
      const readable = new Readable()

      const writable = this.driver.upload({
        container: this.container,
        remote: file
      })
      writable.on('error', (err) => reject(err))
      writable.on('success', (file) => resolve(file))

      readable.pipe(writable)

      readable.push(data)
      readable.push(null)
    })
  }

  /**
   * @param {string} file
   * @return {string}
   */
  async read (file) {
    return new Promise((resolve, reject) => {
      const readable = this.driver.download({
        container: this.container,
        remote: file
      })

      const chunks = []
      readable.on('error', (err) => reject(err))
      readable.on('data', (chunk) => chunks.push(chunk))
      readable.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'))
      })
    })
  }

  /**
   * @return {Promise} - Array
   */
  async getFiles () {
    return new Promise((resolve, reject) => {
      this.driver.getFiles(this.container, (err, files) => {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      })
    })
  }

  /**
   * @param {string} file
   * @return {Promise} - File
   */
  async getFile (file) {
    return new Promise((resolve, reject) => {
      this.driver.getFile(this.container, file, (err, f) => {
        if (err) {
          reject(err)
        } else {
          resolve(f)
        }
      })
    })
  }

  /**
   * @param {string}
   * @return {Promise} - boolean
   */
  async removeFile (file) {
    return new Promise((resolve, reject) => {
      this.driver.removeFile(this.container, file, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}

module.exports = StorageProxy
