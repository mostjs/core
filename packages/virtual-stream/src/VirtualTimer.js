/** @license MIT License (c) copyright 2010-2017 original author or authors */

/*global setTimeout, clearTimeout*/

export class VirtualTimer {
  constructor (start) {
    this._now = this._targetNow = start
    this._time = Infinity
    this._task = void 0
    this._timer = null
    this._active = false
    this._running = false
    this._key = {}
  }

  now () {
    return this._now
  }

  setTimer (f, dt) {
    if (this._task !== void 0) {
      throw new Error('VirtualTimer: Only supports one in-flight timer')
    }

    this._task = f
    this._time = this._now + Math.max(0, dt)
    if (this._active) {
      this._run(f)
    }
    return this._key
  }

  clearTimer (t) {
    if (t !== this._key) {
      return
    }

    this._cancel()
    this._time = Infinity
    this._task = void 0
  }

  tick (dt) {
    if (dt <= 0) {
      return
    }

    this._targetNow = this._targetNow + dt
    this._run()
  }

  _run () {
    if (this._running) {
      return
    }

    this._active = true
    this._running = true
    this._step()
  }

  _step () {
    this._timer = setTimeout(stepTimer, 0, this)
  }

  _cancel () {
    clearTimeout(this._timer)
    this._timer = null
  }
}

function stepTimer (vt) {
  if (vt._now >= vt._targetNow) {
    vt._now = vt._targetNow
    vt._time = Infinity
    vt._running = false
    return
  }

  const task = vt._task
  vt._task = void 0
  vt._now = vt._time
  vt._time = Infinity

  if (typeof task === 'function') {
    task()
  }

  vt._step()
}
