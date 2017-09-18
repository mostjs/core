// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { delay } from '@most/scheduler'
import { withTime } from '../src/timestamp'
import { collectEvents } from '../src/index'

const createTask = (sink, value, end) => ({
  run (t) {
    sink.event(t, value)
    if (end) {
      sink.end(t)
    }
  },
  error (t, e) {
    sink.error(t, e)
  }
})

const testStream = (events) => {
  return {
    run (sink, scheduler) {
      events.forEach(({ time, value }, i, events) =>
        delay(time, createTask(sink, value, i === events.length - 1), scheduler))
    }
  }
}

describe('withTime', () => {
  it('should have correct times', () => {
    let events = [{ time: 1, value: 1 }, { time: 3, value: 3 }]
    const s = withTime(testStream(events))
    return collectEvents(s)
      .then(eq(events.map((e) => ({ time: e.time, value: e }))))
  })
})
