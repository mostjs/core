/** @license MIT License (c) copyright 2010-2017 original author or authors */

/*global performance, process*/

class MillisecondClock {
  constructor (now, origin) {
    this.origin = origin
    this._now = now
  }

  now () {
    return this._now() - this.origin
  }
}

class HRTimeClock {
  constructor (hrtime, origin) {
    this.origin = origin
    this._hrtime = hrtime
  }

  now () {
    const hrt = this._hrtime(this.origin)
    return (hrt[0] * 1e9 + hrt[1]) / 1e6
  }
}

export const millisecondClockFromNow = now =>
  new MillisecondClock(now, now())

export const newPerformanceNowClock = () =>
  millisecondClockFromNow(performance.now)

export const newDateNowClock = () =>
  millisecondClockFromNow(Date.now)

export const newHRTimeClock = () =>
  new HRTimeClock(process.hrtime, process.hrtime())

export const newPlatformClock = () => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return newPerformanceNowClock()
  } else if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    return newHRTimeClock()
  }

  return newDateNowClock()
}
