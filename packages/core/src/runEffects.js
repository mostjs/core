/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { settable } from './disposable/dispose'

export const runEffects = (stream, scheduler) =>
  new Promise((resolve, reject) =>
    runStream(stream, scheduler, resolve, reject))

function runStream (stream, scheduler, resolve, reject) {
  const disposable = settable()
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

  end (t, x) {
    if (!this.active) {
      return
    }
    this.active = false
    disposeThen(this._end, this._error, this._disposable, x)
  }

  error (t, e) {
    this.active = false
    disposeThen(this._error, this._error, this._disposable, e)
  }
}

const disposeThen = (end, error, disposable, x) =>
  Promise.resolve(disposable.dispose()).then(() => end(x), error)
