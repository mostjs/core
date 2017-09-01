import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { now } from '../../src/source/now'
import { delay } from '../../src/combinator/delay'
import { merge, mergeArray } from '../../src/combinator/merge'

import { makeEventsFromArray, collectEventsFor } from '../helper/testEnv'

describe('merge', function() {
  it('should include items from all inputs', function() {
    return testMerge(merge)
  })

  it('should be associative', function() {
    const s1 = now(1)
    const s2 = now(2)
    const s3 = now(3)

    const m1 = merge(merge(s1, s2), s3)
    const m2 = merge(s1, merge(s2, s3))

    return collectEventsFor(1, m1).then(events1 =>
      collectEventsFor(1, m2).then(eq(events1))
    )
  })
})

describe('mergeArray', function() {
  it('should include items from all inputs', function() {
    return testMerge((s1, s2) => mergeArray([s1, s2]))
  })
})

function testMerge(merge) {
  const a = [1, 2, 3]
  const b = [4, 5, 6]
  const count = a.length + b.length
  const sa = makeEventsFromArray(0, a)
  const sb = makeEventsFromArray(0, b)

  const s = merge(delay(2, sa), delay(1, sb))

  return collectEventsFor(count, s).then(events => {
    eq(count, events.length)
    const expected = b
      .map(value => ({ time: 1, value }))
      .concat(a.map(value => ({ time: 2, value })))
    eq(expected, events)
  })
}
