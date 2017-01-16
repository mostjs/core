import { Stream } from '../types';

export function continueWith<A>(f: (a: any) => Stream<A>, s: Stream<A>): Stream<A>;
export function continueWith(f: (a: any) => Stream<any>, s: Stream<any>): Stream<any>;

export function continueWith<A>(f: (a: any) => Stream<A>): (s: Stream<A>) => Stream<A>;
export function continueWith(f: (a: any) => Stream<any>): (s: Stream<any>) => Stream<any>;