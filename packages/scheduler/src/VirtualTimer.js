/** @license MIT License (c) copyright 2010-2018 original author or authors */

export default function newVirtualTimer () {
  let currentTime = 0
  let targetTime = 0
  let task
  let timer = null
  let running = false
  const key = {}

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
      const fn = task.fn
      task = undefined
      if (typeof fn === 'function') {
        fn()
      }
    }
    timer = setTimeout(stepTimer, 0)
  }

  return {
    now: () => currentTime,
    setTimer: function (fn, dt) {
      if (task !== undefined) {
        throw new Error('VirtualTimer: Only supports one in-flight timer')
      }
      task = {fn, time: currentTime + Math.max(0, dt)}
      return key
    },
    clearTimer: function (t) {
      if (t !== key) {
        return
      }
      clearTimeout(timer)
      task = undefined
    },
    tick: function (dt) {
      if (dt <= 0) {
        return
      }
      targetTime = currentTime + dt
      if (running) {
        return
      }
      running = true
      timer = setTimeout(stepTimer, 0)
    }
  }
}
