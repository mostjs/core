/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/* global setTimeout, clearTimeout */

import { Timer } from '@most/types'

export default class VirtualTimer implements Timer {
  _now = 0
  _targetNow = 0
  _time = Infinity
  _task?: Function = undefined
  _timer?: number = undefined
  _active = false
  _running = false
  _key = {}

  now (): number {
    return this._now
  }

  setTimer (f: Function, dt: number): {} {
    if (this._task !== undefined) {
      throw new Error('VirtualTimer: Only supports one in-flight timer')
    }

    this._task = f
    this._time = this._now + Math.max(0, dt)
    if (this._active) {
      this._run()
    }
    return this._key
  }

  clearTimer (t: unknown): void {
    if (t !== this._key) {
      return
    }

    this._cancel()
    this._time = Infinity
    this._task = undefined
  }

  tick (dt: number): void {
    if (dt <= 0) {
      return
    }

    this._targetNow = this._targetNow + dt
    this._run()
  }

  step (): void {
    this._timer = setTimeout(stepTimer, 0, this)
  }

  private _run (): void {
    if (this._running) {
      return
    }

    this._active = true
    this._running = true
    this.step()
  }

  private _cancel (): void {
    clearTimeout(this._timer)
    this._timer = undefined
  }
}

function stepTimer (vt: VirtualTimer): void {
  if (vt._now >= vt._targetNow) {
    vt._now = vt._targetNow
    vt._time = Infinity
    vt._running = false
    return
  }

  const task = vt._task
  vt._task = undefined
  vt._now = vt._time
  vt._time = Infinity

  if (typeof task === 'function') {
    task()
  }

  vt.step()
}
