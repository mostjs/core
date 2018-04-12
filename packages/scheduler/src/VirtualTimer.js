/** @license MIT License (c) copyright 2010-2018 original author or authors */

export default function newVirtualTimer () {
  let nows = 0
  let targetNow = 0
  let task
  let timer = null
  let running = false
  const key = {}

  function stepTimer () {
    if (nows >= targetNow) {
      nows = targetNow
      running = false
      return
    }
    if (task !== undefined && targetNow >= task.time) {
      nows = task.time
    } else {
      nows = targetNow
    }
    if (task !== undefined && nows === task.time) {
      const fn = task.fn
      task = undefined
      if (typeof fn === 'function') {
        fn()
      }
    }
    timer = setTimeout(stepTimer, 0)
  }

  return {
    now: () => nows,
    setTimer: function (fn, dt) {
      if (task !== undefined) {
        throw new Error('VirtualTimer: Only supports one in-flight timer')
      }
      task = {fn, time: nows + Math.max(0, dt)}
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
      targetNow = nows + dt
      if (running) {
        return
      }
      running = true
      timer = setTimeout(stepTimer, 0)
    }
  }
}
