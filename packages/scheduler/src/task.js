/** @license MIT License (c) copyright 2010-2017 original author or authors */

export const defer = task =>
  Promise.resolve(task).then(runTask)

export function runTask (task) {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}
