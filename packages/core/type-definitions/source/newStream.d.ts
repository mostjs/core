import { Stream, Sink, Scheduler, Disposable } from '@most/types';

export type RunStream<A> = (sink: Sink<A>, scheduler: Scheduler) => Disposable

export function newStream<A>(run: RunStream<A>): Stream<A>;
