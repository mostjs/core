import { Scheduler, Time, Offset, Sink, Stream } from '@most/types';

export function newFakeDisposeStream<T> (disposer: () => any, source: Stream<T>): Stream<T>;

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

export interface TimeStampedEvent<A> {
  time: Time,
  value: A
};

export type TimeStampedEvents<A> = Array<TimeStampedEvent<A>>;

export function newSinkSpy<A>(eventCb: (time: Time, value: A) => any, endCb: (time: Time) => any, errorCb: (time: Time, error: Error) => any): SinkSpy<A>;
export function newEventErrorSinkSpy<A>(e: Error): SinkSpy<A>;
export function newEndErrorSinkSpy<A>(e: Error): SinkSpy<A>;

export function assertSame<A>(s1: Stream<A>, s2: Stream<A>): Promise<boolean>;
export function expectArray<A>(array: TimeStampedEvents<A>, s: Stream<A>): Promise<boolean>;

export function collectEvents<A>(stream: Stream<A>): Promise<TimeStampedEvents<A>>;
export function collectEventsFor<A>(nticks: Time, stream: Stream<A>): Promise<TimeStampedEvents<A>>;

export function atTimes<A>(array: TimeStampedEvents<A>): Stream<A>;
export function makeEventsFromArray<A>(dt: Offset, a: Array<A>): Stream<A>;
export function makeEvents(dt: Offset, n: number): Stream<number>;
