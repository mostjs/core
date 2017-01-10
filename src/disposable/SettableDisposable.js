/** @license MIT License (c) copyright 2010-2016 original author or authors */

export default class SettableDisposable {
  constructor () {
    this.disposable = void 0
    this.disposed = false
    this._resolve = void 0

    this.result = new Promise(resolve => {
      this._resolve = resolve
    })
  }

  setDisposable (disposable) {
    if (this.disposable !== void 0) {
      throw new Error('setDisposable called more than once')
    }

    this.disposable = disposable

    if (this.disposed) {
      this._resolve(disposable.dispose())
    }
  }

  dispose () {
    if (this.disposed) {
      return this.result
    }

    this.disposed = true

    if (this.disposable !== void 0) {
      this.result = this.disposable.dispose()
    }

    return this.result
  }
}

