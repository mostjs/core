import { Scheduler, Time, Offset, Sink } from '@most/types';

export interface SinkSpy<A> extends Sink<A> {
  eventCalled(): number,
  eventTime(): Time,
  eventValue(): A,
  endCalled(): number,
  endTime(): Time,
  errorCalled(): number,
  errorTime(): Time,
  errorValue(): Error
};

export interface TestEnvironment {
  tick(dt: Offset): void,
  scheduler: Scheduler
};

export function newFakeDisposeStream(disposer: () => any, source: Stream): Stream;
export function newFakeDisposeStream(disposer: () => any): (source: Stream) => Stream;

export function drain(stream: Stream): Promise;
export function observe(fn: () => any, stream: Stream): Promise;
export function observe(fn: () => any): (stream: Stream) => Promise;

export function reduce<R>(fn: (acc: R, value: T) => R, initial: R, stream: Stream<T>): Promise<R>;
export function reduce<R>(fn: (acc: R, value: T) => R): (initial: R, stream: Stream<T>) => Promise<R>;
export function reduce<R>(fn: (acc: R, value: T) => R, initial: R): (stream: Stream<T>) => Promise<R>;
export function reduce<R>(fn: (acc: R, value: T) => R): (initial: R) => (stream: Stream<T>) => Promise<R>;

export function newSinkSpy<A>(
  eventCb: (time: Time, value: A) => any,
  endCb: (time: Time) => any,
  errorCb: (time: Time, error: Error) => any
): SinkSpy<A>;
export function newSinkSpy<A>(
  eventCb: (time: Time, value: A) => any
): (endCb: (time: Time) => any, errorCb: (time: Time, error: Error) => any) => SinkSpy<A>;
export function newSinkSpy<A>(
  eventCb: (time: Time, value: A) => any,
  endCb: (time: Time) => any
): (errorCb: (time: Time, error: Error) => any) => SinkSpy<A>;
export function newSinkSpy<A>(
  eventCb: (time: Time, value: A) => any
): (endCb: (time: Time) => any) => (errorCb: (time: Time, error: Error) => any) => SinkSpy<A>;

export function newEventErrorSinkSpy(e: Error): SinkSpy;
export function newEndErrorSinkSpy(e: Error): SinkSpy;

export function assertSame(s1: Stream<A>, s2: Stream<A>): Promise;
export function assertSame(s1: Stream<A>): (s2: Stream<A>) => Promise;

export function expectArray(array: Array<A>, s: Stream<A>): Promise;
export function expectArray(array: Array<A>): (s: Stream<A>) => Promise;

export function timestamp(stream: Stream): Stream;

export function newEnv(): TestEnvironment;

export function ticks(dt: Offset): Scheduler;

export function collectEvents(stream: Stream, scheduler: Scheduler): Promise;
export function collectEvents(stream: Stream): (scheduler: Scheduler) => Promise;

export function collectEventsFor(nticks: Offset, stream: Stream): Promise;
export function collectEventsFor(nticks: Offset): (stream: Stream) => Promise;

export function atTimes(array: Array): Stream;

export function atTime(time: Time, value: any): Stream;
export function atTime(time: Time): (value: any) => Stream;

export function makeEventsFromArray(dt: Offset, a: Array): Stream;
export function makeEventsFromArray(dt: Offset): (a: Array) => Stream;

export function makeEvents(dt: Offset, n: number): Stream;
export function makeEvents(dt: Offset): (n: number) => Stream;
