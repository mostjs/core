import { describe, it } from 'mocha'
import { throws, assert } from '@briancavalier/assert'

import { default as SettableDisposable } from '../../src/disposable/SettableDisposable'

const testDisposable = () => ({
  disposed: false,
  dispose () {
    this.disposed = true
  }
})

describe('SettableDisposable', () => {
  it('should allow setDisposable before dispose', () => {
    const sd = new SettableDisposable()
    const d = testDisposable()

    sd.setDisposable(d)
    sd.dispose()

    assert(d.disposed)
  })

  it('should allow setDisposable after dispose', () => {
    const sd = new SettableDisposable()
    const d = testDisposable()

    sd.dispose()

    sd.setDisposable(d)

    assert(d.disposed)
  })

  it('should allow setDisposable at most once', () => {
    const d = new SettableDisposable()

    d.setDisposable(testDisposable())

    throws(() => {
      d.setDisposable(testDisposable())
    })
  })
})
