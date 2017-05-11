import { Stream } from '@most/types';
import { SeedValue } from '../seedValue';

export function loop<A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>, seed: S, s: Stream<A>): Stream<B>;
export function loop<A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>): (seed: S, s: Stream<A>) => Stream<B>;
export function loop<A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>, seed: S): (s: Stream<A>) => Stream<B>;
export function loop<A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>): (seed: S) => (s: Stream<A>) => Stream<B>;
