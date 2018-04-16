/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import type { Stream, Offset, Time } from '@most/types'
import { newScheduler, newTimeline } from '@most/scheduler'
import { run } from '@most/core'
import { newVirtualTimer } from './VirtualTimer'

export type TimeStampedEvent<A> = {
  time: Time,
  value: A
}

export type TimeStampedEvents<A> = Array<TimeStampedEvent<A>>

export function collectEventsFor<A> (nticks: Offset, stream: Stream<A>): Promise<TimeStampedEvents<A>> {
  return new Promise(function (resolve, reject) {
    const collectedEvents: TimeStampedEvents<A> = []
    run(
      {
        event: function (time, value) {
          if (time > nticks) {
            return resolve(collectedEvents)
          }
          collectedEvents.push({time, value})
        },
        end: () => resolve(collectedEvents),
        error: reject
      },
      newScheduler(newVirtualTimer().tick(nticks + 1), newTimeline()),
      stream
    )
  })
}

export function collectEvents<A> (stream: Stream<A>): Promise<TimeStampedEvents<A>> {
  return new Promise(function (resolve, reject) {
    const collectedEvents: TimeStampedEvents<A> = []
    const virtualTimer = newVirtualTimer()
    let timer
    const tickTheTime = function () {
      virtualTimer.tick(1)
      timer = setTimeout(tickTheTime, 0)
    }
    run(
      {
        event: function (time, value) {
          collectedEvents.push({time, value})
        },
        end: function () {
          clearTimeout(timer)
          resolve(collectedEvents)
        },
        error: function (error) {
          clearTimeout(timer)
          reject(error)
        }
      },
      newScheduler(virtualTimer, newTimeline()),
      stream
    )
    timer = setTimeout(tickTheTime, 0)
  })
}
