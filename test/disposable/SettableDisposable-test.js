import { describe, it } from 'mocha'
import { eq, throws } from '@briancavalier/assert'

import { default as SettableDisposable } from '../../src/disposable/SettableDisposable'

describe('SettableDisposable', function () {
  it('should allow setDisposable before dispose', function () {
    var d = new SettableDisposable()
    var data = {}

    d.setDisposable({
      dispose: function () { return data }
    })

    var x = d.dispose()

    eq(x, data)
  })

  it('should allow setDisposable after dispose', function () {
    var d = new SettableDisposable()
    var data = {}

    var p = d.dispose()

    d.setDisposable({
      dispose: function () { return data }
    })

    return p.then(eq(data))
  })

  it('should allow setDisposable at most once', function () {
    var d = new SettableDisposable()

    d.setDisposable({})

    throws(() => {
      d.setDisposable({})
    })
  })
})
