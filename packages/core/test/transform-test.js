import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { assertSame } from '../test-buster-old/helper/stream-helper'
import { map, tap, constant } from '../src/combinator/transform'
import { just } from '../src/source/core'

import { collectEventsFor } from '../test-buster-old/helper/testEnv'

describe('map', function () {
  it('should satisfy identity', function () {
    // u.map(function(a) { return a; })) ~= u
    const u = just(Math.random())
    return assertSame(map(x => x, u), u)
  })

  it('should satisfy composition', function () {
    // u.map(function(x) { return f(g(x)); }) ~= u.map(g).map(f)
    const f = x => x + 'f'
    const g = x => x + 'g'

    const u = just('e')

    return assertSame(
      map(x => f(g(x)), u),
      map(f, map(g, u))
    )
  })
})

describe('constant', function () {
  it('should satisfy identity', function () {
    // u.constant(x) ~= u.map(function(){return x;})
    const u = just('e')
    const x = 1
    const f = () => x
    return assertSame(
      constant(x, u),
      map(f, u)
    )
  })
})

describe('tap', function () {
  it('should not transform stream items', function () {
    const expected = Math.random()
    const s = tap(() => -1, just(expected))

    return collectEventsFor(1, s)
      .then(eq([{ time: 0, value: expected }]))
  })
})
