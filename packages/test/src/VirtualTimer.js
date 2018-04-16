/** @license MIT License (c) copyright 2018 original author or authors */

// @flow
import type { Timer, Offset, Handle } from '@most/types'

export type VirtualTimer = Timer & {
  tick(dt: Offset): VirtualTimer
}

export function newVirtualTimer () : VirtualTimer {
  let currentTime = 0
  let targetTime = 0
  let task
  let timer
  let running = false
  const key: Handle = {}

  function stepTimer () {
    if (currentTime >= targetTime) {
      currentTime = targetTime
      running = false
      return
    }
    if (task !== undefined && targetTime >= task.time) {
      currentTime = task.time
    } else {
      currentTime = targetTime
    }
    if (task !== undefined && currentTime === task.time) {
      const fn: () => void = task.fn
      task = undefined
      if (typeof fn === 'function') {
        fn()
      }
    }
    timer = setTimeout(stepTimer, 0)
  }

  const virtualTimer = {
    now: () => currentTime,
    setTimer: function (fn: () => void, dt) {
      if (task !== undefined) {
        throw new Error('VirtualTimer: Only supports one in-flight timer')
      }
      task = {fn, time: currentTime + Math.max(0, dt)}
      return key
    },
    clearTimer: function (t: Handle) {
      if (t !== key) {
        return
      }
      clearTimeout(timer)
      task = undefined
    },
    tick: function (dt) {
      if (dt <= 0) {
        return virtualTimer
      }
      targetTime = currentTime + dt
      if (running) {
        return virtualTimer
      }
      running = true
      timer = setTimeout(stepTimer, 0)
      return virtualTimer
    }
  }

  return virtualTimer
}
