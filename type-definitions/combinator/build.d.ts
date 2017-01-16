import { Stream } from '../types';

export function startWith<A>(value: A, stream: Stream<A>): Stream<A>;
export function startWith(value: any, stream: Stream<any>): Stream<any>;
export function startWith<A>(value: A): (stream: Stream<A>) => Stream<A>;
export function startWith(value: any): (stream: Stream<any>) => Stream<any>;

export function concat<A>(leftStream: Stream<A>, rightStream: Stream<A>): Stream<A>;
export function concat(leftStream: Stream<any>, rightStream: Stream<any>): Stream<any>;
export function concat<A>(leftStream: Stream<A>): (rightStream: Stream<A>) => Stream<A>;
export function concat(leftStream: Stream<any>): (rightStream: Stream<any>) => Stream<any>;