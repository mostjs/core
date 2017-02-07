import { spec, expect } from 'buster'
const { describe, it } = spec
import { delay } from '../src/combinator/delay'
import { just as streamOf } from '../src/source/core'

import { ticks, collectEvents } from './helper/testEnv'

var sentinel = { value: 'sentinel' }

describe('delay', function () {
  it('should delay events by delayTime', function () {
    var dt = 1
    var s = delay(dt, streamOf(sentinel))

    return collectEvents(s, ticks(dt + 1)).then(function (events) {
      expect(events.length).toBe(1)
      expect(events[0].time).toBe(dt)
      expect(events[0].value).toBe(sentinel)
    })
  })
})
