import { Stream } from '../types';

export function chain<A, B>(f: (value: A) => Stream<B>, stream: Stream<A>): Stream<B>;
export function chain(f: (value: any) => Stream<any>, stream: Stream<any>): Stream<any>;
export function chain<A, B>(f: (value: A) => Stream<B>): (stream: Stream<A>) => Stream<B>;
export function chain(f: (value: any) => Stream<any>): (stream: Stream<any>) => Stream<any>;

export function join<A>(higherOrderStream: Stream<Stream<A>>): Stream<A>;
export function join(higherOrderStream: Stream<Stream<any>>): Stream<any>;
