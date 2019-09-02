/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Clock, Time } from '@most/types'

/* global performance, process */

export class RelativeClock implements Clock {
  private readonly clock: Clock;
  private readonly origin: Time;
  constructor(clock: Clock, origin: Time) {
    this.origin = origin
    this.clock = clock
  }

  now(): Time {
    return this.clock.now() - this.origin
  }
}

export class HRTimeClock implements Clock {
  private readonly hrtime: (time: [number, number]) => [number, number];
  private readonly origin: [Time, Time];
  constructor(hrtime: (time: [number, number]) => [number, number], origin: [Time, Time]) {
    this.origin = origin
    this.hrtime = hrtime
  }

  now(): Time {
    const hrt = this.hrtime(this.origin)
    return (hrt[0] * 1e9 + hrt[1]) / 1e6
  }
}

export const clockRelativeTo = (clock: Clock): Clock =>
  new RelativeClock(clock, clock.now())

export const newPerformanceClock = (): Clock =>
  clockRelativeTo(performance)

/**
 * @deprecated will be removed in 2.0.0
 * Date.now is not monotonic, and performance.now is ubiquitous:
 * @see https://caniuse.com/#search=performance.now
 */
export const newDateClock = (): Clock =>
  clockRelativeTo(Date)

export const newHRTimeClock = (): Clock =>
  new HRTimeClock(process.hrtime, process.hrtime())

export const newPlatformClock = (): Clock => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return newPerformanceClock()
  } else if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    return newHRTimeClock()
  }

  return newDateClock()
}
