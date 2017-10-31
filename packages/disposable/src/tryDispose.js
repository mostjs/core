/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { curry3 } from '@most/prelude'

// Try to dispose the disposable.  If it throws, send
// the error to sink.error with the provided Time value
export const tryDispose = curry3((t, disposable, sink) => {
  try {
    const result = disposable.dispose()
    if (result && typeof result.catch === 'function') {
      return result.catch((e) => {
        sink.error(t, e)
      })
    }
  } catch (e) {
    sink.error(t, e)
  }
})
