/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

export interface DeferrableTask<E, A> {
  run(): A;
  error(e: Error): E;
}

export function defer <E, A> (task: DeferrableTask<E, A>): Promise<E | A> {
  return Promise.resolve(task).then(runTask)
}

export function runTask <E, A> (task: DeferrableTask<E, A>): E | A {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}
