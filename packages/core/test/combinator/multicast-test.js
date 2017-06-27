import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { now } from '../../src/source/now'
import { map, tap } from '../../src/combinator/transform'
import { multicast } from '../../src/combinator/multicast'
import { runEffects } from '../../src/runEffects'
import { ticks } from '../helper/testEnv'

describe('multicast', () => {
  it('should be identity for already-multicasted stream', () => {
    const s = multicast(now(1))
    eq(s, multicast(s))
  })

  it('should call mapper function once when there are > 1 observer', () => {
    const observer1Spy = spy()
    const observer2Spy = spy()
    const observer3Spy = spy()

    const f = x => x + 1
    const x = Math.random()
    const s = now(x)

    const mapperSpy = spy(f)
    const mapped = map(mapperSpy, s)
    const multicasted = multicast(mapped)

    const o1 = runEffects(tap(observer1Spy, multicasted), ticks(1))
    const o2 = runEffects(tap(observer2Spy, multicasted), ticks(1))
    const o3 = runEffects(tap(observer3Spy, multicasted), ticks(1))

    return Promise.all([o1, o2, o3]).then(() => {
      assert(mapperSpy.calledOnce)

      const expected = f(x)

      assert(observer1Spy.calledOnce)
      eq(expected, observer1Spy.getCall(0).args[0])

      assert(observer2Spy.calledOnce)
      eq(expected, observer2Spy.getCall(0).args[0])

      assert(observer3Spy.calledOnce)
      eq(expected, observer3Spy.getCall(0).args[0])
    })
  })
})
