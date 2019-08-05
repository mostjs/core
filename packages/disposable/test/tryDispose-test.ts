import { describe, it } from 'mocha'
import { assert } from '@briancavalier/assert'
import { spy } from 'sinon'
import { tryDispose } from '../src/tryDispose'

describe('tryDispose', () => {
  it('should not propagate error if disposable returns', () => {
    const disposable = { dispose: spy() }
    const sink = { event () {}, end () {}, error: spy() }

    tryDispose(1, disposable, sink)

    assert(disposable.dispose.calledOnce)
    assert(!sink.error.called)
  })

  it('should not propagate error if disposable throws', () => {
    const t = Math.floor(Math.random() * 1000)
    const error = new Error()
    const disposable = {
      dispose: spy(() => { throw error })
    }

    const sink = { event () {}, end () {}, error: spy() }

    tryDispose(t, disposable, sink)

    assert(disposable.dispose.calledOnce)
    assert(sink.error.calledOnce)
    assert(sink.error.calledWithExactly(t, error))
  })
})
