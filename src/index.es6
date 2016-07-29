class Disposable {
  constructor (block) { this.block = block }

  dispose () {
    if (!this.disposed) {
      this.block()
      this.disposed = true
    }
  }
}

class CompositeDisposable extends Disposable {
  constructor () {
    super(() => {
      for (let i = 0; i < this.disposables.length; i++) {
        const disposable = this.disposables[i]
        disposable.dispose()
      }
    })

    this.disposables = []
  }

  add (disposable) { this.disposables.push(disposable) }

  remove (disposable) {
    const index = this.disposables.indexOf(disposable)

    if (index !== -1) { this.disposables.splice(index, 1) }
  }
}

class DisposableEvent extends Disposable {
  constructor (target, event, listener) {
    const events = event.split(/\s+/g)

    if (target.addEventListener != null) {
      super(() => {
        events.forEach(event => target.removeEventListener(event, listener))
      })
      events.forEach(event => target.addEventListener(event, listener))
    } else if (target.on != null) {
      super(() => events.forEach(event => target.off(event, listener)))
      events.forEach(event => target.on(event, listener))
    }
  }
}

export {Disposable, DisposableEvent, CompositeDisposable}
