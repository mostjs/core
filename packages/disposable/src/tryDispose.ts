/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { curry3 } from '@most/prelude'
import { Disposable, Sink, Time } from '@most/types'

// Try to dispose the disposable.  If it throws, send
// the error to sink.error with the provided Time value
export const tryDispose = curry3((t: Time, disposable: Disposable, sink: Sink<unknown>): void => {
  try {
    disposable.dispose()
  } catch (e) {
    sink.error(t, e)
  }
})
