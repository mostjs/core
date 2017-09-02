// @flow
import { describe, it } from 'mocha'
import { eq, fail } from '@briancavalier/assert'

import { runStream } from '../src/runStream'
import { at } from '../src/source/at'

import { ticks } from './helper/testEnv'

describe('runStream', () => {
  it('should run a stream', done => {
    // This could be tested with a spy that verifies
    // stream.run was called with the same arguments
    // and runStream doesn't modify the return value
    // But, I think this is better: test the invariants
    // rather than the implementation.  If we construct
    // a stream with an expected outcome, then run
    // the stream, it should, in fact, produce that
    // outcome.
    const events = []
    const expectedTime = 10 * Math.random()
    const expectedValue = Math.random()
    const expected = [
      { time: expectedTime, value: expectedValue }
    ]
    const sink = {
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
    runStream(sink, ticks(expectedTime), s)
  })
})
