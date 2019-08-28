import { describe, it } from 'mocha'
import { eq, fail } from '@briancavalier/assert'

import { run } from '../src/run'
import { at } from '../src/source/at'

import { Event, ticks } from './helper/testEnv'
import { Sink } from '@most/types'

describe('run', () => {
  it('should run a stream', done => {
    // This could be tested with a spy that verifies
    // stream.run was called with the same arguments
    // and runStream doesn't modify the return value
    // But, I think this is better: test the invariants
    // rather than the implementation.  If we construct
    // a stream with an expected outcome, then run
    // the stream, it should, in fact, produce that
    // outcome.
    const events: Event<number>[] = []
    const expectedTime = 10 * Math.random()
    const expectedValue = Math.random()
    const expected = [
      { time: expectedTime, value: expectedValue }
    ]
    const sink: Sink<number> = {
      event (time, value) {
        events.push({ time, value })
      },
      end (time) {
        eq(expectedTime, time)
        eq(expected, events)
        done()
      },
      error (t, e) {
        fail(`Stream failed: ${t} ${e}`)
      }
    }

    const s = at(expectedTime, expectedValue)
    run(sink, ticks(expectedTime), s)
  })
})
