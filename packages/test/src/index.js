import { newTimeline, newScheduler } from '@most/scheduler'
import { runEffects, zip, tap } from '@most/core'
import { VirtualTimer } from './VirtualTimer'
import { withTime } from './timestamp'

export const testStream = (stream) =>
  runEffects(stream, testScheduler())

export const collectEvents = (stream) => {
  const into = []
  const s = tap(x => into.push(x), withTime(stream))
  return testStream(s).then(() => into)
}

export const newVirtualTimer = () =>
  new VirtualTimer()

export const testScheduler = () =>
  newScheduler(newVirtualTimer(), newTimeline())

export const compareEvents = (compare, s1, s2) =>
  zip(compare, withTime(s1), withTime(s2))
