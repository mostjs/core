import { Stream } from '@most/types';

export function until<A>(signal: Stream<any>, s: Stream<A>): Stream<A>;
export function until<A>(signal: Stream<any>): (s: Stream<A>) => Stream<A>;

export function since<A>(signal: Stream<any>, s: Stream<A>): Stream<A>;
export function since<A>(signal: Stream<any>): (s: Stream<A>) => Stream<A>;

export function during<A>(timeWindow: Stream<Stream<any>>, s: Stream<A>): Stream<A>;
export function during<A>(timeWindow: Stream<Stream<any>>): (s: Stream<A>) => Stream<A>;
