import { Stream } from '@most/types';

export function filter<A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>;
export function filter<A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>;

export function skipRepeats<A>(s: Stream<A>): Stream<A>;

export function skipRepeatsWith<A>(eq: (a1: A, a2: A) => boolean, s: Stream<A>): Stream<A>;
export function skipRepeatsWith<A>(eq: (a1: A, a2: A) => boolean): (s: Stream<A>) => Stream<A>;
