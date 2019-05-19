import { describe, it } from 'mocha'
import { assert, eq, fail } from '@briancavalier/assert'
import { disposeBoth } from '@most/disposable';

import { switchLatest } from '../src/combinator/switch'
import { take } from '../src/combinator/slice'
import { constant, map, tap } from '../src/combinator/transform'
import { periodic } from '../src/source/periodic'
import { empty, isCanonicalEmpty } from '../src/source/empty'
import { at } from '../src/source/at'
import { now } from '../src/source/now'
import { ticks, collectEventsFor, makeEvents, makeEventsFromArray } from './helper/testEnv'
import { runEffects } from '../src/runEffects'
import Pipe from '../src/sink/Pipe'

describe('switch', () => {
  it('given canonical empty string, should return canonical empty', () => {
    const s = switchLatest(empty())
    assert(isCanonicalEmpty(s))
  })

  describe('when input is empty', () => {
    it('should return empty', () => {
      return runEffects(tap(fail, switchLatest(empty())), ticks(1))
    })
  })

  it('should dispose penultimate stream when ending with empty', () => {
    // If we spy on the stream and collect its events, we should end
    // up seeing the same set of events as if we collect all the events
    // that can be observed (i.e. by observe())
    const events = []
    const push = x => events.push(x)
    const toInner = x => x === 0
      ? switchLatest(map(now, tap(push, take(1, periodic(1, 1)))))
      : empty()

    const s = switchLatest(map(toInner, makeEventsFromArray(0, [0, 1])))
    return collectEventsFor(10, s)
      .then(eq(events))
  })

  describe('when input contains a single stream', () => {
    it('should return an equivalent stream', () => {
      const s = now(makeEvents(1, 3))

      return collectEventsFor(3, switchLatest(s))
        .then(eq([
          { time: 0, value: 0 },
          { time: 1, value: 1 },
          { time: 2, value: 2 }
        ]))
    })
  })

  describe('when input contains many streams', () => {
    describe('and all items are instantaneous', () => {
      it('should be equivalent to the last inner stream', () => {
        const s = makeEventsFromArray(0, [
          makeEventsFromArray(1, [4, 5, 6]),
          makeEventsFromArray(1, [1, 2, 3])
        ])

        return collectEventsFor(2, switchLatest(s))
          .then(eq([
            { time: 0, value: 1 },
            { time: 1, value: 2 },
            { time: 2, value: 3 }
          ]))
      })
    })

    it('should switch when new stream arrives', () => {
      let i = 0
      const s = map(() => constant(++i, periodic(1)), periodic(3))

      return collectEventsFor(250, take(10, switchLatest(s)))
        .then(eq([
          { time: 0, value: 1 },
          { time: 1, value: 1 },
          { time: 2, value: 1 },
          { time: 3, value: 2 },
          { time: 4, value: 2 },
          { time: 5, value: 2 },
          { time: 6, value: 3 },
          { time: 7, value: 3 },
          { time: 8, value: 3 },
          { time: 9, value: 4 }
        ]))
    })
  })

  describe('when upper stream fails to dispose', () => {
    it('should emit an error event with correct time', () => {
      // This case is a failing test for:
      // https://github.com/mostjs/core/issues/284

      let errorEventTime = -1;

      class DisposeFailureStream {
        constructor (source) {
          this.source = source
        }

        run (sink, scheduler) {
          const disposeFailureSink = new DisposeFailureSink(sink)
          return disposeBoth(
            disposeFailureSink,
            this.source.run(disposeFailureSink, scheduler),
          )
        }
      }

      class DisposeFailureSink extends Pipe {
        dispose () {
          throw new Error()
        }
      }

      const disposeFailure = s => new DisposeFailureStream(s)

      class AssertErrorTimeStream {
        constructor (source) {
          this.source = source
        }

        run (sink, scheduler) {
          return this.source.run(new AssertErrorTimeSink(sink), scheduler)
        }
      }

      class AssertErrorTimeSink extends Pipe {
        error (t, e) {
          super.error(t, e)
          errorEventTime = t
        }
      }

      const assertErrorTime = s => new AssertErrorTimeStream(s)

      const s = assertErrorTime(switchLatest(at(1, disposeFailure(now(undefined)))))
      return runEffects(s, ticks(2)).then(() => {
        fail()
      }, () => {
        eq(1, errorEventTime)
      })
    });
  });
})
