import { Stream } from '../types';

export function continueWith<A>(f: (a: any) => Stream<A>, s: Stream<A>): Stream<A>;
export function continueWith<A>(f: (a: any) => Stream<A>): (s: Stream<A>) => Stream<A>;
