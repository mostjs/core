import { Sink, Scheduler, Stream, Time, Disposable } from '@most/types';

export function runStream <A> (sink: Sink<A>, scheduler: Scheduler, s: Stream<A>): Disposable;
export function runStream <A> (sink: Sink<A>): (scheduler: Scheduler, s: Stream<A>) => Disposable;
export function runStream <A> (sink: Sink<A>, scheduler: Scheduler): (s: Stream<A>) => Disposable;
export function runStream <A> (sink: Sink<A>): (scheduler: Scheduler) => (s: Stream<A>) => Disposable;

export function runStreamWithLocalTime <A> (sink: Sink<A>, scheduler: Scheduler, origin: Time, s: Stream<A>): Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>): (scheduler: Scheduler, origin: Time, s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>): (scheduler: Scheduler) => (origin: Time, s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>): (scheduler: Scheduler, origin: Time) => (s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>): (scheduler: Scheduler) => (origin: Time) => (s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>, scheduler: Scheduler): (origin: Time, s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>, scheduler: Scheduler): (origin: Time) => (s: Stream<A>) => Disposable;
export function runStreamWithLocalTime <A> (sink: Sink<A>, scheduler: Scheduler, origin: Time): (s: Stream<A>) => Disposable;
