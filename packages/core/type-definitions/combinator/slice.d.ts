import { Stream } from '@most/types';

export function take<A>(n: number, s: Stream<A>): Stream<A>;
export function take<A>(n: number): (s: Stream<A>) => Stream<A>;

export function skip<A>(n: number, s: Stream<A>): Stream<A>;
export function skip<A>(n: number): (s: Stream<A>) => Stream<A>;

export function takeWhile<A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>;
export function takeWhile<A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>;

export function skipWhile<A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>;
export function skipWhile<A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>;

export function skipAfter<A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>;
export function skipAfter<A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>;

export function slice<A>(start: number, end: number, s: Stream<A>): Stream<A>;
export function slice<A>(start: number): (end: number, s: Stream<A>) => Stream<A>;
export function slice<A>(start: number, end: number): (s: Stream<A>) => Stream<A>;
export function slice<A>(start: number): (end: number) => (s: Stream<A>) => Stream<A>;
