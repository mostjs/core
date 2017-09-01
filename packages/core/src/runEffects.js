/** @license MIT License (c) copyright 2010-2017 original author or authors */

import SettableDisposable from './disposable/SettableDisposable'

export const runEffects = (stream, scheduler) =>
  new Promise((resolve, reject) =>
    runStream(stream, scheduler, resolve, reject)
  )

function runStream (stream, scheduler, resolve, reject) {
  const disposable = new SettableDisposable()
  const observer = new RunEffectsSink(resolve, reject, disposable)

  disposable.setDisposable(stream.run(observer, scheduler))
}

class RunEffectsSink {
  constructor (end, error, disposable) {
    this._end = end
    this._error = error
    this._disposable = disposable
    this.active = true
  }

  event (t, x) {}

  end (t) {
    if (!this.active) {
      return
    }
    this._dispose(this._error, this._end, undefined)
  }

  error (t, e) {
    this._dispose(this._error, this._error, e)
  }

  _dispose (error, end, x) {
    this.active = false
    tryDispose(error, end, x, this._disposable)
  }
}

function tryDispose (error, end, x, disposable) {
  try {
    disposable.dispose()
  } catch (e) {
    error(e)
    return
  }

  end(x)
}
