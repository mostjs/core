import { Stream } from '@most/types';

export function recoverWith<A, E extends Error>(p: (error: E) => Stream<A>, s: Stream<A>): Stream<A>;
export function recoverWith<A, E extends Error>(p: (error: E) => Stream<A>): (s: Stream<A>) => Stream<A>;

export function throwError(e: Error): Stream<any>;
