import { Stream } from '@most/types';

export function until<A>(signal: Stream<any>, s: Stream<A>): Stream<A>;
export function until<A>(signal: Stream<A>): (s: Stream<A>) => Stream<A>;

export function skipUntil<A>(signal: Stream<any>, s: Stream<A>): Stream<A>;
export function skipUntil<A>(signal: Stream<any>): (s: Stream<A>) => Stream<A>;

export function during<A>(timeWindow: Stream<Stream<any>>, s: Stream<A>): Stream<A>;
export function during<A>(timeWindow: Stream<Stream<any>>): (s: Stream<A>) => Stream<A>;
