import { Stream } from '@most/types';

export function startWith<A>(value: A, stream: Stream<A>): Stream<A>;
export function startWith<A>(value: A): (stream: Stream<A>) => Stream<A>;

export function concat<A>(leftStream: Stream<A>, rightStream: Stream<A>): Stream<A>;
export function concat<A>(leftStream: Stream<A>): (rightStream: Stream<A>) => Stream<A>;
