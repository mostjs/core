import { Stream } from '../types';

export function filter<A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>;
export function filter<A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>;
export function filter(p: (a: any) => boolean, s: Stream<any>): Stream<any>;
export function filter(p: (a: any) => boolean): (s: Stream<any>) => Stream<any>;

export function skipRepeats<A>(s: Stream<A>): Stream<A>;

export function skipRepeatsWith<A>(eq: (a1: A, a2: A) => boolean, s: Stream<A>): Stream<A>;
export function skipRepeatsWith<A>(eq: (a1: A, a2: A) => boolean): (s: Stream<A>) => Stream<A>;
export function skipRepeatsWith(eq: (a1: any, a2: any) => boolean, s: Stream<any>): Stream<any>;
export function skipRepeatsWith(eq: (a1: any, a2: any) => boolean): (s: Stream<any>) => Stream<any>;