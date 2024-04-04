import { fantasyLand, FantasyLandStream } from './FantasyLandStream'
import { compose, curry2 } from '@most/prelude'
import { Stream } from '@most/types'

import { periodic as _periodic, take as _take, tap as _tap } from '../../core/src'

export const periodic = compose(fantasyLand, _periodic)

interface Take {
  <A>(n: number, s: Stream<A>): FantasyLandStream<A>
  <A>(n: number): (s: Stream<A>) => FantasyLandStream<A>
}
export const take: Take = curry2((x, y) => fantasyLand(_take(x, y)))

interface Tap {
  <A>(f: (a: A) => any, s: Stream<A>): FantasyLandStream<A>
  <A>(f: (a: A) => any): (s: Stream<A>) => FantasyLandStream<A>
}
export const tap: Tap = curry2((x, y) => fantasyLand(_tap(x, y)))

export { fantasyLand, FantasyLandStream }
export { runEffects } from '../../core'
