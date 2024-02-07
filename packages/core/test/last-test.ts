import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'
import { newDefaultScheduler } from '@most/scheduler'
import { Stream } from '@most/types'

import { last } from '../src/combinator/slice/last'

import { collectEventsFor, makeEventsFromArray } from './helper/testEnv'
import { empty, isCanonicalEmpty } from '../src/source/empty'
import { chain, now, runEffects, throwError } from '../src/index'
import { flow } from '../../prelude/src/function'

const defaultScheduler = newDefaultScheduler()
const runEffectsWithDefaultScheduler = <A>(s: Stream<A>): Promise<void> => runEffects(s, defaultScheduler)

describe('last', function () {
  const x = [0, 1, 2, 3]
  const sampleError = new Error('sample error')
  it('should return a stream containing only the last item', function () {
    const s = last(makeEventsFromArray(1, x))

    return collectEventsFor(x.length, s)
      .then(eq([
        { time: 3, value: 3 }
      ]))
  })

  it('fails with a source error', () => flow(
    makeEventsFromArray(1, x),
    chain(x => x === 2
      ? throwError(sampleError)
      : now(x)
    ),
    // @ts-ignore
    last,
    chain(val => throwError(new Error(`Unexpected value ${val}!`))),
    runEffectsWithDefaultScheduler,
    (p: Promise<void>) => p.then(
      () => { assert(false) },
      (e: Error) => { eq(e, sampleError) }
    )
  ))

  describe('given a canonical empty stream', function () {
    it('should return a canonical empty stream', function () {
      // Fixture setup
      const emptyStream = empty()
      // Exercise system
      const sut = last(emptyStream)
      // Verify outcome
      assert(isCanonicalEmpty(sut))
    })

    it('ends w/o value for an empty source', () => flow(
      empty(),
      last,
      // @ts-ignore
      chain(val => throwError(new Error(`Unexpected value ${val}!`))),
      runEffectsWithDefaultScheduler
    ))
  })
})
