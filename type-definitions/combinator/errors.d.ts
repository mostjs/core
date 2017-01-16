import { Stream } from '../types';

export function recoverWith<A, B>(p: (a: B) => Stream<A>, s: Stream<A>): Stream<A>;
export function recoverWith<A, B>(p: (a: B) => Stream<A>): (s: Stream<A>) => Stream<A>;
export function recoverWith(p: (a: any) => Stream<any>, s: Stream<any>): Stream<any>;
export function recoverWith(p: (a: any) => Stream<any>): (s: Stream<any>) => Stream<any>;

export function throwError(e: Error): Stream<any>;
