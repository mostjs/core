/** @license MIT License (c) copyright 2010-2017 original author or authors */

// Wrap an existing disposable (which may not already have been once()d)
// so that it will only dispose its underlying resource at most once.
export const disposeOnce = disposable =>
  new DisposeOnce(disposable)

class DisposeOnce {
  constructor (disposable) {
    this.disposed = false
    this.disposable = disposable
  }

  dispose () {
    if (!this.disposed) {
      this.disposed = true
      this.disposable.dispose()
      this.disposable = undefined
    }
  }
}
