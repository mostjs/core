/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { defer, DeferrableTask } from './task'
import { Clock, Time, Timer } from '@most/types'

/* global setTimeout, clearTimeout */

export default class ClockTimer implements Timer {
  private _clock: Clock;
  constructor(clock: Clock) {
    this._clock = clock
  }

  now(): Time {
    return this._clock.now()
  }

  setTimer <A>(f: () => A, dt: Time): NodeJS.Timeout | Asap<A> {
    return dt <= 0 ? runAsap(f) : setTimeout(f, dt)
  }

  clearTimer <A>(t: number | Asap<A>): void {
    return t instanceof Asap ? t.cancel() : clearTimeout(t)
  }
}

class Asap<A> implements DeferrableTask<never, A | undefined> {
  private f: () => A | undefined;
  /**
   * @mutable
   */
  public active: boolean;

  constructor(f: () => A | undefined) {
    this.f = f
    this.active = true
  }

  run(): A | undefined {
    if (this.active) {
      return this.f()
    }
  }

  error(e: Error): never {
    throw e
  }

  cancel(): void {
    this.active = false
  }
}

function runAsap <A>(f: () => A): Asap<A> {
  const task = new Asap(f)
  defer(task)
  return task
}
