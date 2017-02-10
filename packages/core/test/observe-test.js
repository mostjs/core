import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { observe, drain } from '../src/combinator/observe'
import { iterate } from '../src/source/iterate'
import { take } from '../src/combinator/slice'
import { just as streamOf } from '../src/source/core'
import * as sinon from 'sinon'

const sentinel = { value: 'sentinel' }

describe('observe', function () {
  it('should call callback and return a promise', function () {
    const spy = sinon.spy()

    return observe(spy, streamOf(sentinel))
      .then(() => assert(spy.calledWith(sentinel)))
  })

  it('should call callback with expected values until end', function () {
    const n = 5
    const s = take(n, iterate(x => x + 1, 0))

    let y = 0
    const spy = sinon.spy(x => eq(x, y++))

    return observe(spy, s)
      .then(() => eq(y, n))
  })
})

describe('drain', function () {
  it('should drain all events', function () {
    let n = 5
    const s = take(n, iterate(x => {
      n -= 1
      return x + 1
    }, 0))

    n -= 1 // The initial value is emitted without calling the iterator function

    return drain(s)
      .then(() => eq(n, 0))
  })
})
