/* global describe, it, beforeEach, afterEach */

const fs = require('fs')
const path = require('path')

const assert = require('power-assert')
const rimraf = require('rimraf')

const StorageProxyCreator = require('storage-proxy-creator')

describe('StorageProxy', () => {
  const containerName = 'abc'
  var storage
  beforeEach(() => {
    storage = StorageProxyCreator.create(containerName, {})
  })

  function prepareContainer () { // eslint-disable-line
    fs.mkdirSync(path.join(storage.driver.root, containerName))
  }

  function cleanContainer () { // eslint-disable-line
    rimraf.sync(path.join(storage.driver.root, containerName))
  }

  describe('#getContainers', () => {
    describe('not exists', () => {
      it('[]', async () => {
        assert.deepEqual(await storage.getContainers(), [])
      })
    })

    describe('`abc` exists', () => {
      beforeEach(() => prepareContainer())
      afterEach(() => cleanContainer())

      it('[\'abc\']', async () => {
        const containers = await storage.getContainers()
        containers.map((e) => assert(e.name, 'abc'))
      })
    })
  })

  describe('#createContainer', () => {
    it('MethodNotAllowed', () => {
      assert.rejects(
        async () => storage.createContainer(),
        { name: 'MethodNotAllowed' }
      )
    })
  })

  describe('#destroyContainer', () => {
    it('MethodNotAllowed', () => {
      assert.rejects(
        async () => storage.destroyContainer(),
        { name: 'MethodNotAllowed' }
      )
    })
  })

  describe('getContainer', () => {
    describe('not exists', () => {
      it('Error', async () => {
        try {
          await storage.getContainer()
        } catch (e) {
          assert.equal(e.constructor.name, 'Error')
          assert.equal(e.code, 'ENOENT')
        }
      })
    })

    describe('`abc` exists', () => {
      beforeEach(() => prepareContainer())
      afterEach(() => cleanContainer())

      it('Container object', async () => {
        const container = await storage.getContainer()
        assert.equal(container.name, containerName)
      })
    })
  })
})
