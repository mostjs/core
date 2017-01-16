import { Stream } from '../types';

export function observe<A>(f: (a: A) => any, s: Stream<A>): Promise<any>;
export function observe<A>(f: (a: A) => any): (s: Stream<A>) => Promise<any>;

export function drain<A>(s: Stream<A>): Promise<any>;
