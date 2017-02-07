/** @license MIT License (c) copyright 2010-2016 original author or authors */

export function disposeSafely (disposable) {
  try {
    return disposable.dispose()
  } catch (e) {
    return Promise.reject(e)
  }
}
