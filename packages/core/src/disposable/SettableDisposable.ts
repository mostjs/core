/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Disposable } from '@most/types'

export default class SettableDisposable implements Disposable {
  private disposable?: Disposable;
  private disposed: boolean;

  constructor() {
    this.disposable = undefined
    this.disposed = false
  }

  setDisposable(disposable: Disposable): void {
    if (this.disposable !== undefined) {
      throw new Error('setDisposable called more than once')
    }

    this.disposable = disposable

    if (this.disposed) {
      disposable.dispose()
    }
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true

    if (this.disposable !== undefined) {
      this.disposable.dispose()
    }
  }
}
