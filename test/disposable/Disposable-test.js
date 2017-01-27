import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import * as sinon from 'sinon'

import { default as Disposable } from '../../src/disposable/Disposable'

describe('Disposable', function () {
  it('should call disposer with data', function () {
    var spy = sinon.spy(function (x) {
      return x
    })
    var data = {}

    var d = new Disposable(spy, data)

    eq(d.dispose(), data)
    assert(spy.calledWith(data))
  })
})
