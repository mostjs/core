/** @license MIT License (c) copyright 2010-2017 original author or authors */

export default class SettableDisposable {
  constructor() {
    this.disposable = undefined
    this.disposed = false
  }

  setDisposable(disposable) {
    if (this.disposable !== void 0) {
      throw new Error('setDisposable called more than once')
    }

    this.disposable = disposable

    if (this.disposed) {
      disposable.dispose()
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.disposed = true

    if (this.disposable !== void 0) {
      this.disposable.dispose()
    }
  }
}
