import { Stream } from '../types';

export function delay<A>(dt: number, s: Stream<A>): Stream<A>;
export function delay<A>(dt: number): (s: Stream<A>) => Stream<A>;
