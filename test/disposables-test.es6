import expect from 'expect.js'
import sinon from 'sinon'
import {Disposable, CompositeDisposable, DisposableEvent} from '../src/index'

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

    it('removes the reference to the block after the first call', () => {
      disposable.dispose()

      expect(disposable.block).to.be(undefined)
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

describe('CompositeDisposable', () => {
  let [composite, disposable1, disposable2, spy1, spy2] = []

  beforeEach(() => {
    spy1 = sinon.spy()
    spy2 = sinon.spy()
    disposable1 = new Disposable(spy1)
    disposable2 = new Disposable(spy2)
  })

  describe('created with an array of disposables', () => {
    beforeEach(() => {
      composite = new CompositeDisposable([disposable1, disposable2])
    })

    it('disposes the provided disposables with a call to .dispose()', () => {
      composite.dispose()

      expect(spy1.called).to.be.ok()
      expect(spy2.called).to.be.ok()
    })

    it('disposes the composited disposables only once', () => {
      composite.dispose()
      composite.dispose()
      composite.dispose()
      composite.dispose()

      expect(spy1.callCount).to.eql(1)
      expect(spy2.callCount).to.eql(1)
    })
  })

  describe('created without any disposables', () => {
    beforeEach(() => {
      composite = new CompositeDisposable()
    })

    describe('.add()', () => {
      it('adds a disposable to the composite', () => {
        composite.add(disposable1)

        composite.dispose()

        expect(spy1.called).to.be.ok()
      })
    })

    describe('.remove()', () => {
      it('removes a disposable from the composite', () => {
        composite.add(disposable1)
        composite.remove(disposable1)

        composite.dispose()

        expect(spy1.called).not.to.be.ok()
      })
    })
  })
})

describe('DisposableEvent', () => {
  let source, disposable, listener

  describe('on a source with addEventListener method', () => {
    beforeEach(() => {
      source = {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy()
      }
      listener = function __listener () {}

      disposable = new DisposableEvent(source, 'event1 event2', listener)
    })

    it('registers the listener on the source object for each events', () => {
      expect(source.addEventListener.calledWith('event1', listener)).to.be.ok()
      expect(source.addEventListener.calledWith('event2', listener)).to.be.ok()
    })

    describe('.dispose()', () => {
      it('removes the listener for each event', () => {
        disposable.dispose()

        expect(source.removeEventListener.calledWith('event1', listener)).to.be.ok()
        expect(source.removeEventListener.calledWith('event2', listener)).to.be.ok()
      })
    })
  })

  describe('on a source with on/off methods', () => {
    beforeEach(() => {
      source = {
        on: sinon.spy(),
        off: sinon.spy()
      }
      listener = function __listener () {}

      disposable = new DisposableEvent(source, 'event1 event2', listener)
    })

    it('registers the listener on the source object for each events', () => {
      expect(source.on.calledWith('event1', listener)).to.be.ok()
      expect(source.on.calledWith('event2', listener)).to.be.ok()
    })

    describe('.dispose()', () => {
      it('removes the listener for each event', () => {
        disposable.dispose()

        expect(source.off.calledWith('event1', listener)).to.be.ok()
        expect(source.off.calledWith('event2', listener)).to.be.ok()
      })
    })
  })
})
