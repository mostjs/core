import { Stream } from '@most/types';

export function iterate<A>(f: (a: A) => A | Promise<A>, a: A): Stream<A>;
export function iterate<A>(f: (a: A) => A | Promise<A>): (a: A) => Stream<A>;
