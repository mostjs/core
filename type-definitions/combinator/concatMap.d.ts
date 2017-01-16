import { Stream } from '../types';

export function concatMap<A, B>(f: (a: A) => Stream<B>, stream: Stream<A>): Stream<B>;
export function concatMap(f: (a: any) => Stream<any>, stream: Stream<any>): Stream<any>;
export function concatMap<A, B>(f: (a: A) => Stream<B>): (stream: Stream<A>) => Stream<B>;
export function concatMap(f: (a: any) => Stream<any>): (stream: Stream<any>) => Stream<any>;