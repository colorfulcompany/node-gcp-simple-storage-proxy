const path = require('path')
const pkgcloud = require('pkgcloud')
const filesystem = require('filesystem-storage-pkgcloud')
const StorageProxy = require('./storage-proxy')

class StorageProxyCreator {
  /**
   * @param {string} name
   * @param {string} projectId
   * @param {string} env
   * @param {string} rootDir
   */
  constructor (name, {
    projectId = process.env.GCP_PROJECT,
    env = process.env.NODE_ENV || 'development',
    rootDir = path.join(__dirname, '../tmp')
  }) {
    this.name = name
    this.projectId = projectId
    this.env = env
    this.rootDir = rootDir
  }

  /**
   * @param {string} name
   * @param {string} projectId
   * @param {string} env
   * @param {string} rootDir
   * @return {object} - StorageProxy
   */
  static create (name, { projectId, env, rootDir }) {
    const creator = new this(name, { projectId, env, rootDir })
    const pkg = creator.initPkgcloud()

    return new StorageProxy(pkg, creator.resolveName(creator.name))
  }

  /**
   * @param {string} env
   * @return {string}
   */
  detectProvider (env) {
    switch (env) {
      case 'production':
      case 'gcs':
      case 'google':
        return 'google'
      case 'development':
      case 'test':
      case 'local':
      case 'filesystem':
        return 'filesystem'
    }
  }

  /**
   * @param {string} name
   * @return {string}
   */
  resolveName (name) {
    return name
  }

  /**
   * @return {object}
   */
  initPkgcloud () {
    const provider = this.detectProvider(this.env)
    switch (provider) {
      case 'filesystem':
        return this.initPkgcloudWithFilesystem(this.name, {
          rootDir: this.rootDir
        })
      case 'google':
        return this.initPkgcloudWithGoogle(this.name, {
          projectId: this.projectId
        })
    }
  }

  /**
   * @param {string} name
   * @param {string} rootDir
   * @return {object} - pkgcloud.Client
   */
  initPkgcloudWithFilesystem (name, { rootDir }) {
    pkgcloud.providers.filesystem = {
      storage: filesystem
    }

    return pkgcloud.storage.createClient({
      provider: 'filesystem',
      root: rootDir
    })
  }

  /**
   * @param {string} name
   * @param {string} projectId
   * @return {object} - pkgcloud.Client
   */
  initPkgcloudWithGoogle (name, { projectId }) {
    return { name: { projectId } }
  }
}

module.exports = StorageProxyCreator
