import { describe, it } from 'mocha'
import { assert } from '@briancavalier/assert'
import { spy } from 'sinon'

import { disposeWith } from '../src/disposeWith'

describe('Disposable', function () {
  it('should call disposer with data', function () {
    const x = {}
    const dispose = spy()

    disposeWith(dispose, x).dispose()

    assert(dispose.calledOnce)
    assert(dispose.calledWithExactly(x))
  })
})
