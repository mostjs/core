import {
  MulticastDisposable,
  MulticastSource,
  multicast
} from '../../src/combinator/multicast'
import { assert, eq } from '@briancavalier/assert'
import { collectEvents, makeEvents, ticks } from '../helper/testEnv'
import { describe, it } from 'mocha'
import { map, tap } from '../../src/combinator/transform'

import FakeDisposeStream from '../helper/FakeDisposeStream'
import { now } from '../../src/source/now'
import { runEffects } from '../../src/runEffects'
import { sinkSpy } from '../helper/sinkSpy'
import { spy } from 'sinon'

describe('multicast', () => {
  it('should be identity for already-multicasted stream', () => {
    const s = multicast(now(1))
    eq(s, multicast(s))
  })

  it('should call mapper function once when there are > 1 observer', () => {
    const observer1Spy = spy()
    const observer2Spy = spy()
    const observer3Spy = spy()
    const scheduler = ticks(1)

    const f = x => x + 1
    const x = Math.random()
    const s = now(x)

    const mapperSpy = spy(f)
    const mapped = map(mapperSpy, s)
    const multicasted = multicast(mapped)

    const o1 = runEffects(tap(observer1Spy, multicasted), scheduler)
    const o2 = runEffects(tap(observer2Spy, multicasted), scheduler)
    const o3 = runEffects(tap(observer3Spy, multicasted), scheduler)

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

const sentinel = { value: 'sentinel' }

describe('MulticastSource', () => {
  it('should call producer on first observer', () => {
    const eventSpy = spy()
    const s = new MulticastSource({ run: () => {} })
    const scheduler = ticks(1)

    s.run({ event: eventSpy }, scheduler)
    s.event(sentinel)

    eq(true, eventSpy.calledOnce)
  })

  it('should call producer ONLY on the first observer', () => {
    const sourceSpy = spy()
    const s = new MulticastSource({ run: sourceSpy })
    const scheduler = ticks(1)

    return Promise.all([
      s.run({ event: () => {} }, scheduler),
      s.run({ event: () => {} }, scheduler),
      s.run({ event: () => {} }, scheduler),
      s.run({ event: () => {} }, scheduler)
    ]).then(() => {
      eq(true, sourceSpy.calledOnce)
    })
  })

  it('should publish events to all observers', () => {
    const s = new MulticastSource(makeEvents(1, 2))
    const scheduler = ticks(2)

    return Promise.all([
      collectEvents(s, scheduler),
      collectEvents(s, scheduler)
    ]).then(
      eq([
        [{ time: 0, value: 0 }, { time: 1, value: 1 }],
        [{ time: 0, value: 0 }, { time: 1, value: 1 }]
      ])
    )
  })

  it('should propagate errors', () => {
    const fakeSource = {
      run () {}
    }
    const scheduler = ticks(1)

    const ms = new MulticastSource(fakeSource)
    const s1 = sinkSpy()
    ms.run(s1, scheduler)

    const e1 = new Error()
    ms.error(1, e1)
    eq(1, s1.errorCalled)
    eq(1, s1.errorTime)
    eq(e1, s1.errorValue)

    const s2 = sinkSpy()
    ms.run(s2, scheduler)

    const e2 = new Error()
    ms.error(2, e2)
    eq(2, s1.errorCalled)
    eq(2, s1.errorTime)
    eq(e2, s1.errorValue)

    eq(1, s2.errorCalled)
    eq(2, s2.errorTime)
    eq(e2, s2.errorValue)
  })

  it('should propagate errors only to errored observer', () => {
    const s = new MulticastSource(makeEvents(1, 2))
    const error = new Error()
    const scheduler = ticks(2)

    const p1 = runEffects(s, scheduler)
    const p2 = runEffects(
      map(() => {
        throw error
      }, s),
      scheduler
    ).catch(e => e)

    return Promise.all([p1, p2]).then(([a, b]) => {
      eq(undefined, a)
      eq(error, b)
    })
  })

  it('should call dispose if all observers disconnect', () => {
    const disposer = spy()
    const s = new MulticastSource(
      FakeDisposeStream.from(disposer, now(sentinel))
    )
    const scheduler = ticks(1)

    return Promise.all([
      runEffects(s, scheduler),
      runEffects(s, scheduler)
    ]).then(() => {
      eq(true, disposer.calledOnce)
    })
  })
})

describe('MulticastDisposable', () => {
  it('should dispose when sinks reaches zero', () => {
    const expectedSink = {}
    const source = {
      remove (sink) {
        eq(expectedSink, sink)
        return 0
      },

      dispose () {}
    }

    const disposed = spy(source, 'dispose')
    const removed = spy(source, 'remove')

    const md = new MulticastDisposable(source, expectedSink)

    md.dispose()

    assert(removed.calledOnce)
    assert(disposed.calledOnce)
  })

  it('should not dispose when sinks > 0', () => {
    const expectedSink = {}
    const source = {
      remove (sink) {
        eq(expectedSink, sink)
        return 1
      },

      dispose () {}
    }

    const disposed = spy(source, 'dispose')
    const removed = spy(source, 'remove')

    const md = new MulticastDisposable(source, expectedSink)

    md.dispose()

    assert(removed.calledOnce)
    assert(disposed.notCalled)
  })
})
