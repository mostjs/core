import { Stream } from '@most/types';

export function delay<A>(dt: number, s: Stream<A>): Stream<A>;
export function delay<A>(dt: number): (s: Stream<A>) => Stream<A>;
