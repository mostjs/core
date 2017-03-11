/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { defer } from './task'

/*global setTimeout, clearTimeout*/

export default class ClockTimer {
  constructor () {
    this.now = Date.now
  }

  setTimer (f, dt) {
    return dt <= 0 ? runAsap(f) : setTimeout(f, dt)
  }

  clearTimer (t) {
    return t instanceof Asap ? t.cancel() : clearTimeout(t)
  }
}

class Asap {
  constructor (f) {
    this.f = f
    this.active = true
  }

  run () {
    return this.active && this.f()
  }

  error (e) {
    throw e
  }

  cancel () {
    this.active = false
  }
}

function runAsap (f) {
  const task = new Asap(f)
  defer(task)
  return task
}
