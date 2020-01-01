/* global describe, it */

const assert = require('power-assert')

const StorageProxyCreator = require('storage-proxy-creator')

describe('StorageProxyCreator', () => {
  describe('.create', () => {
    it('return StorageProxy', () => {
      assert.equal(
        StorageProxyCreator.create('abc', {}).constructor.name,
        'StorageProxy')
    })
  })

  describe('#initPkgcloudWithFilesystem', () => {
    it('return FileSystemProvider', () => {
      const creator = new StorageProxyCreator('abc', {})
      const pkg = creator.initPkgcloud()
      assert.equal(pkg.constructor.name, 'FileSystemProvider')
    })
  })
})
