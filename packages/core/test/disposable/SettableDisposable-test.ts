import { describe, it } from 'mocha'
import { throws, assert } from '@briancavalier/assert'

import SettableDisposable from '../../src/disposable/SettableDisposable'
import { Disposable } from '@most/types'

class TestDisposable implements Disposable {
  disposed = false

  dispose(): void {
    this.disposed = true
  }
}

describe('SettableDisposable', () => {
  it('should allow setDisposable before dispose', () => {
    const sd = new SettableDisposable()
    const d = new TestDisposable()

    sd.setDisposable(d)
    sd.dispose()

    assert(d.disposed)
  })

  it('should allow setDisposable after dispose', () => {
    const sd = new SettableDisposable()
    const d = new TestDisposable()

    sd.dispose()

    sd.setDisposable(d)

    assert(d.disposed)
  })

  it('should allow setDisposable at most once', () => {
    const d = new SettableDisposable()

    d.setDisposable(new TestDisposable())

    throws(() => {
      d.setDisposable(new TestDisposable())
    })
  })
})
