// @flow
import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import AbstractScheduler from '../src/AbstractScheduler'
import ScheduledTask from '../src/ScheduledTask'

import { asap } from '../src/schedule'

class FakeScheduler extends AbstractScheduler {
  now () {
    return 0
  }

  scheduleTask (localOffset, delay, period, task) {
    return new ScheduledTask(delay, localOffset, period, task, this)
  }

  relative (offset) {
    return this
  }

  cancel (task) {}
  cancelAll (f) {}
}

class FakeTask {
  run (t) {}
  error (t, e) {
    throw e
  }
}

describe('asap', () => {
  it('should schedule a task at time 0', () => {
    const scheduler = new FakeScheduler()
    const task = new FakeTask()

    const st = asap(task, scheduler)

    eq(scheduler.now(), st.time)
    eq(0, st.localOffset)
    eq(-1, st.period)
    is(task, st.task)
    is(scheduler, st.scheduler)
    assert(st.active)
  })
})
