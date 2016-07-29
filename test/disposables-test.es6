import expect from 'expect.js'
import sinon from 'sinon'
import {Disposable} from '../src/index'

describe('Disposable', () => {
  describe('when created without a block', () => {
    it('raises an error', () => {
      expect(() => new Disposable()).to.throwError()
    })
  })

  describe('when created with a block', () => {
    let [disposable, spy] = []

    beforeEach(() => {
      spy = sinon.spy()
      disposable = new Disposable(spy)
    })

    it('calls the passed-in block on a call to .dispose()', () => {
      disposable.dispose()

      expect(spy.called).to.be.ok()
    })

    it('calls the passed-in block only once', () => {
      disposable.dispose()
      disposable.dispose()
      disposable.dispose()
      disposable.dispose()

      expect(spy.callCount).to.eql(1)
    })
  })
})
