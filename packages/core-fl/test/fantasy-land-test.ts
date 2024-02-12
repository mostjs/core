import { describe, it } from 'mocha'
import { assert } from '@briancavalier/assert'
import { newDefaultScheduler } from '@most/scheduler'
import { Stream } from '@most/types'

import { periodic, runEffects, take, tap, FantasyLandStream } from '../src/index'
import { pipe } from 'fp-ts/function'
import { map as mapR } from 'ramda'

const map = mapR as unknown as <A, B>(fn: (x: A) => B) => (functor: FantasyLandStream<A>) => FantasyLandStream<B>

const defaultScheduler = newDefaultScheduler()
const runEff = <A>(s: Stream<A>): Promise<void> => runEffects(s, defaultScheduler)

describe('fantasy-land', function () {
  // const x = [0, 1, 2, 3]
  // const sampleError = new Error('sample error')

  it('the types should line up', function () {
    return runEff(take(2, periodic(10)))
      .then(res => {
        assert(typeof res === 'undefined')
      })
  })

  it('map', () => pipe(
    periodic(10),
    take(2),
    map(() => 'foo'),
    tap(x => {
      assert(x === 'foo')
    }),
    runEff
  ))
})
