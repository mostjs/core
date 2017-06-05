/** @license MIT License (c) copyright 2010-2017 original author or authors */

/*global performance, process*/

export class RelativeClock {
  constructor (clock, origin) {
    this.origin = origin
    this.clock = clock
  }

  now () {
    return this.clock.now() - this.origin
  }
}

export class HRTimeClock {
  constructor (hrtime, origin) {
    this.origin = origin
    this.hrtime = hrtime
  }

  now () {
    const hrt = this.hrtime(this.origin)
    return (hrt[0] * 1e9 + hrt[1]) / 1e6
  }
}

export const clockRelativeTo = clock =>
  new RelativeClock(clock, clock.now())

export const newPerformanceClock = () =>
  clockRelativeTo(performance)

export const newDateClock = () =>
  clockRelativeTo(Date)

export const newHRTimeClock = () =>
  new HRTimeClock(process.hrtime, process.hrtime())

export const newPlatformClock = () => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return newPerformanceClock()
  } else if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    return newHRTimeClock()
  }

  return newDateClock()
}
