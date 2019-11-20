import { describe, it } from 'mocha'
import { assert, is } from '@briancavalier/assert'
import { spy } from 'sinon'
import { disposeOnce } from '../src/disposeOnce'
import { disposeWith } from '../src/disposeWith'

describe('disposeOnce', function () {
  it('should call underlying dispose', function () {
    const x = {}
    const dispose = spy()
    const d = disposeOnce(disposeWith(dispose, x))

    is(d.dispose(), d.dispose())
    assert(dispose.calledOnce)
    assert(dispose.calledWithExactly(x))
  })
})
