import { Stream } from '@most/types';
import { SeedValue } from '../seedValue';

export function unfold<A, B, S>(f: (seed: S) => SeedValue<S, B|Promise<B>>, seed: S): Stream<B>;
export function unfold<A, B, S>(f: (seed: S) => SeedValue<S, B|Promise<B>>): (seed: S) => Stream<B>;
