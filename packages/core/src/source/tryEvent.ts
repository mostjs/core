/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { Time, Sink } from '@most/types'

export function tryEvent <A>(t: Time, x: A, sink: Sink<A>): void {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e as Error)
  }
}

export function tryEnd(t: Time, sink: Sink<unknown>): void {
  try {
    sink.end(t)
  } catch (e) {
    sink.error(t, e as Error)
  }
}
