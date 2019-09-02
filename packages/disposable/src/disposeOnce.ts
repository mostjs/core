/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Disposable } from '@most/types'

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 */
export const disposeOnce = (disposable: Disposable): Disposable =>
  new DisposeOnce(disposable)

class DisposeOnce implements Disposable {
  private disposed = false;
  private disposable?: Disposable

  constructor(disposable: Disposable) {
    this.disposable = disposable
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true
      if (this.disposable) {
        this.disposable.dispose()
        this.disposable = undefined
      }
    }
  }
}
