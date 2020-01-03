/* global describe, it, beforeEach, afterEach */

const fs = require('fs')
const path = require('path')

const assert = require('power-assert')
const rimraf = require('rimraf')
const _ = {}
_.uniq = require('lodash.uniq')

const StorageProxyCreator = require('storage-proxy-creator')

describe('StorageProxy', () => {
  const containerName = 'abc'
  var storage
  beforeEach(() => {
    storage = StorageProxyCreator.create(containerName, {})
  })

  function prepareContainer () { // eslint-disable-line
    try {
      fs.mkdirSync(path.join(storage.driver.root, containerName))
    } catch (e) {
      ;
    }
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

  describe('write and read', () => {
    const fileName = 'file.txt'
    const data = 'lorm ipsum'

    beforeEach(() => prepareContainer())
    afterEach(() => cleanContainer())

    describe('#write', () => {
      it('file has been written', async () => {
        await storage.write(fileName, data)
        assert.equal(
          fs.readFileSync(path.join(storage.driver.root, storage.container, fileName)),
          data)
      })
    })

    describe('#read', () => {
      describe('success', () => {
        it('read written data', async () => {
          await storage.write(fileName, data)
          assert(await storage.read(fileName), data)
        })
      })

      describe('failure', () => {
        it('reject', async () => {
          await storage.write(fileName, data)
          assert.rejects(
            async () => storage.read('nonexist.txt')
          )
        })
      })
    })
  })

  describe('#getFiles', () => {
    beforeEach(async () => {
      prepareContainer()
      await storage.write('abc.txt', 'abc')
      await storage.write('path/abc.txt', 'abc inside path')
    })
    afterEach(() => cleanContainer())

    describe('cannot hold directory hierarchy', () => {
      it('2 files made, but 1 unique name', async () => {
        assert.equal(
          _.uniq((await storage.getFiles()).map(e => {
            return JSON.stringify({
              container: e.container,
              name: e.name,
              location: e.location
            })
          })).length,
          1
        )
      })
    })

    describe('direct read', () => {
      it('can', async () => {
        assert((await storage.read('path/abc.txt')).length > 0)
      })
    })
  })
})
