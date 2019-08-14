/** @license MIT License (c) copyright 2010-2017 original author or authors */

export interface DeferrableTask<E, A> {
  run(): A
  error(e: Error): E
}

export const defer = <E, A>(task: DeferrableTask<E, A>): Promise<E | A> =>
  Promise.resolve(task).then(runTask)

export function runTask <E, A> (task: DeferrableTask<E, A>): E | A {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}
