/** @license MIT License (c) copyright 2018 original author or authors */

import { newScheduler, newTimeline } from '@most/scheduler'
import { run } from '@most/core'
import { curry2 } from '@most/prelude'
import { newVirtualTimer } from './VirtualTimer'

export const collectEventsFor = curry2((nticks, stream) =>
  new Promise(function (resolve, reject) {
    const collectedEvents = []
    run(
      {
        event: function (time, value) {
          if (time > nticks) {
            resolve(collectedEvents)
            return
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
)

export const collectEvents = (stream) =>
  new Promise(function (resolve, reject) {
    const collectedEvents = []
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
