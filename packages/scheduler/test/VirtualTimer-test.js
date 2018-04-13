// @flow
import { describe, it } from 'mocha'
import { eq, AssertionError } from '@briancavalier/assert'

import newVirtualTimer from '../src/VirtualTimer'

describe('VirtualTimer', () => {
  it('new timer should start at time: 0', () => {
    const timer = newVirtualTimer()
    eq(0, timer.now())
  })

  it('should expose a tick function', () => {
    const timer = newVirtualTimer()
    eq('function', typeof timer.tick)
  })

  it('should trigger timer upon ticking', () => {
    const timer = newVirtualTimer()
    const dt = 234
    return new Promise(resolve => {
      timer.setTimer(() => resolve(eq(timer.now(), dt)), dt)
      timer.tick(dt)
    })
  })

  it('should not trigger timer time upon ticking to an earlier time', () => {
    const timer = newVirtualTimer()
    const dt = 234
    return new Promise((resolve, reject) => {
      timer.setTimer(() => reject(new AssertionError('Timer triggered when it should not')), dt + 1)
      timer.tick(dt)
      setTimeout(resolve(), 0)
    })
  })

  it('should not trigger timer when we do not tick manually', () => {
    const timer = newVirtualTimer()
    const dt = 234
    return new Promise((resolve, reject) => {
      timer.setTimer(() => reject(new AssertionError('Timer triggered when it should not')), dt + 1)
      setTimeout(resolve(), 0)
    })
  })

  it('should push current time to requested value if timer is set after that time', () => {
    const timer = newVirtualTimer()
    const dt = 243
    const arbitraryExcessTime = 10
    const taskTime = dt + arbitraryExcessTime
    return new Promise(resolve => {
      timer.setTimer(() => undefined, taskTime)
      timer.tick(dt)
      setTimeout(() => resolve(eq(timer.now(), dt)), 0)
    })
  })
})
