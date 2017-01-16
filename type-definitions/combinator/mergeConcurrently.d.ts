import { Stream } from '../types';

export function mergeConcurrently<A>(concurrency: number, s: Stream<Stream<A>>): Stream<A>;
export function mergeConcurrently<A>(concurrency: number): (s: Stream<Stream<A>>) => Stream<A>;
