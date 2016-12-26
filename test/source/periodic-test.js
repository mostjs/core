import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { periodic } from '../../src/source/periodic'
import { take } from '../../src/combinator/slice'

import te from '../helper/testEnv'

const hasTimeAndValue = ({ time, value }, i) =>
  time === i && value === undefined

describe('periodic', function () {
  it('should emit value at tick periods', function () {
    const n = 10
    const s = take(n, periodic(1))

    return te.collectEvents(s, te.ticks(n)).then(function (events) {
      assert.same(n, events.length)
      assert(events.every(hasTimeAndValue))
    })
  })
})
