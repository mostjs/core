import { Scheduler, Time, Task, ScheduledTask } from '@most/types'
import ScheduledTaskImpl from '../../src/ScheduledTask'

export default class FakeScheduler implements Scheduler {
  private readonly time: Time;
  private tasks: ScheduledTask[];

  constructor(time: Time) {
    this.time = time
    this.tasks = []
  }

  currentTime(): Time {
    return this.time
  }

  scheduleTask(localOffset: Time, delay: Time, period: Time, task: Task): ScheduledTask {
    const st = new ScheduledTaskImpl(this.time + delay, localOffset, period, task, this)
    this.tasks.push(st)
    return st
  }

  relative(): Scheduler {
    return this
  }

  cancel(task: ScheduledTaskImpl): void {
    // Set task to inactive if it's in the tasks array
    task.active = task.active && !(this.tasks.indexOf(task) >= 0)
  }

  cancelAll(f: (task: ScheduledTask) => boolean): void {
    this.tasks = this.tasks.reduce<ScheduledTask[]>((tasks, task) => {
      if (f(task)) {
        task.dispose()
        return tasks
      }
      return tasks.concat(task)
    }, [])
  }
}
