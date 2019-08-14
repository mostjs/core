/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateEndTask } from '../scheduler/PropagateTask'
import { asap } from '@most/scheduler'
import { Stream, Sink, Scheduler, Disposable } from '@most/types'

export const empty = (): Stream<never> => EMPTY

export const isCanonicalEmpty = (stream: Stream<unknown>): boolean =>
  stream === EMPTY

export const containsCanonicalEmpty = <A>(streams: Stream<A>[]): boolean =>
  streams.some(isCanonicalEmpty)

class Empty implements Stream<never> {
  run (sink: Sink<never>, scheduler: Scheduler): Disposable {
    return asap(propagateEndTask(sink), scheduler)
  }
}

const EMPTY = new Empty()
