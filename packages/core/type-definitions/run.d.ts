import { Sink, Scheduler, Stream, Disposable } from '@most/types';

export function run <A> (sink: Sink<A>, scheduler: Scheduler, s: Stream<A>): Disposable;
export function run <A> (sink: Sink<A>): (scheduler: Scheduler, s: Stream<A>) => Disposable;
export function run <A> (sink: Sink<A>, scheduler: Scheduler): (s: Stream<A>) => Disposable;
export function run <A> (sink: Sink<A>): (scheduler: Scheduler) => (s: Stream<A>) => Disposable;
