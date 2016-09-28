# widjet-disposables [![Build Status](https://travis-ci.org/abe33/widjet-disposables.svg?branch=master)](https://travis-ci.org/abe33/widjet-disposables) [![codecov](https://codecov.io/gh/abe33/widjet-disposables/branch/master/graph/badge.svg)](https://codecov.io/gh/abe33/widjet-disposables)

Lightweight disposable pattern implementation.

## Installation

```sh
npm install --save widjet-disposables
```

## Usage

```js
import {Disposable, CompositeDisposable, DisposableEvent} from 'widjet-disposables'
```

### Disposable

The `Disposable` class is the most basic class of the package. It takes a function as the sole argument when created. This function will be called when the `dispose` method of the disposable is called.

```js
function subscribeToSomEvent () {
  // subscribe to some event

  // ...

  // return a new disposable that will perform the unsubscription
  return new Disposable(() => {
    // unsubscribe from the events
  })
}
```

### CompositeDisposable

The `CompositeDisposable` class is a `Disposable` that composes other disposables. It can be created with an array of disposables.

```js
// creates a composite with an array of existing disposables
const composite = new CompositeDisposable(disposables)

const disposable = new Disposable(() => {})

// adds a new disposable in the composite
composite.add(disposable)

// removes the added disposable from the composite
composite.remove(disposable)
```

### DisposableEvent

The `DisposableEvent` is a specific disposable aimed to ease the registration of event listener. It handles either objects with `addEventListener/removeEventListener` methods or objects with `on/off` methods.

```js
// creating a disposable event automatically registers the event listener
const subscription = new DisposableEvent(source, 'event', (event) => {})

// disposing the subscription automatically unregisters the event listener
subscription.dispose()
```
