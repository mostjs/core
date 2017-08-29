import AbstractScheduler from '../../src/AbstractScheduler'
import ScheduledTask from '../../src/ScheduledTask'

export default class FakeScheduler extends AbstractScheduler {
  constructor (time) {
    super()
    this.time = time
    this.tasks = []
  }

  currentTime () {
    return this.time
  }

  now () {
    return this.currentTime()
  }

  scheduleTask (localOffset, delay, period, task) {
    const st = new ScheduledTask(this.time + delay, localOffset, period, task, this)
    this.tasks.push(st)
    return st
  }

  relative (offset) {
    return this
  }

  cancel (task) {
    // Set task to inactive if it's in the tasks array
    task.active = task.active && !(this.tasks.indexOf(task) >= 0)
  }

  cancelAll (f) {
    this.tasks = this.tasks.reduce((tasks, task) => {
      if (f(task)) {
        task.dispose()
        return tasks
      }
      return tasks.concat(task)
    }, [])
  }
}
