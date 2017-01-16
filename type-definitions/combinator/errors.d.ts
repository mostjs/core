import { Stream } from '../types';

export function recoverWith<A, B>(p: (a: B) => Stream<A>, s: Stream<A>): Stream<A>;
export function recoverWith<A, B>(p: (a: B) => Stream<A>): (s: Stream<A>) => Stream<A>;

export function throwError(e: Error): Stream<any>;
