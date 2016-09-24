export class Disposable {
  constructor (block) {
    if (!block) {
      throw new Error('A Disposable must be created with a dispose callback')
    }
    this.block = block
  }

  dispose () {
    if (this.block) {
      this.block()
      delete this.block
    }
  }
}

export class CompositeDisposable extends Disposable {
  constructor (disposables = []) {
    super(() => {
      for (let i = 0; i < this.disposables.length; i++) {
        const disposable = this.disposables[i]
        disposable.dispose()
      }
    })

    this.disposables = disposables
  }

  add (disposable) { this.disposables.push(disposable) }

  remove (disposable) {
    const index = this.disposables.indexOf(disposable)

    if (index !== -1) { this.disposables.splice(index, 1) }
  }
}

export class DisposableEvent extends Disposable {
  constructor (target, event, listener) {
    const events = event.split(/\s+/g)

    if (typeof target.addEventListener === 'function') {
      super(() => events.forEach(e => target.removeEventListener(e, listener)))
      events.forEach(e => target.addEventListener(e, listener))
    } else if (typeof target.on === 'function') {
      super(() => events.forEach(e => target.off(e, listener)))
      events.forEach(e => target.on(e, listener))
    }
  }
}
