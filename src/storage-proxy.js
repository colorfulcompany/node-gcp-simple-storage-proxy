/**
 * read and write files proxy under container ( bucket / directory )
 *
 * Create Cloud Storage bucket BEFORE you use this.
 */
class StorageProxy {
  /**
   * @param {object} pkg - pkgcloud.storage.Client
   */
  constructor (pkg) {
    this.driver = pkg
  }
}

module.exports = StorageProxy
