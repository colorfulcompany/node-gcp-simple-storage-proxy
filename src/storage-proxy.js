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
}

module.exports = StorageProxy
