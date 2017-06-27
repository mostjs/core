import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { now } from '../../src/source/now'
import { map } from '../../src/combinator/transform'
import { multicast } from '../../src/combinator/multicast'
import { observe } from '../helper/observe'

describe('multicast', () => {
  it('should be identity for already-multicasted stream', () => {
    const s = multicast(now(1))
    eq(s, multicast(s))
  })

  it('should call mapper function once when there are > 1 observer', () => {
    const mapperSpy = spy()
    const observer1Spy = spy()
    const observer2Spy = spy()
    const observer3Spy = spy()

    const s = now({value: 'sentinel'})
    const mapped = map(mapperSpy, s)
    const multicasted = multicast(mapped)

    const o1 = observe(observer1Spy, multicasted)
    const o2 = observe(observer2Spy, multicasted)
    const o3 = observe(observer3Spy, multicasted)

    Promise.all([o1, o2, o3]).then(() => {
      assert(mapperSpy.calledOnce)
      eq(true, observer1Spy.calledOnce)
      eq(true, observer2Spy.calledOnce)
      eq(true, observer3Spy.calledOnce)
    })
  })
})
