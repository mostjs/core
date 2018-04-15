import { Scheduler, Time, Offset, Sink, Stream } from '@most/types';

export function newFakeDisposeStream(disposer: () => any, source: Stream): Stream;
export function newFakeDisposeStream(disposer: () => any): (source: Stream) => Stream;

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

// export function assertSame(s1: Stream<A>, s2: Stream<A>): Promise;
// export function assertSame(s1: Stream<A>): (s2: Stream<A>) => Promise;

// export function expectArray(array: Array<A>, s: Stream<A>): Promise;
// export function expectArray(array: Array<A>): (s: Stream<A>) => Promise;

export function collectEvents<A>(stream: Stream<A>): Promise<Array<TimeStampedEvent<A>>>;

export function collectEventsFor(nticks: Time, stream: Stream): Promise;
export function collectEventsFor(nticks: Time): (stream: Stream) => Promise;

export function atTimes(array: Array): Stream;

export function makeEventsFromArray(dt: Offset, a: Array): Stream;
export function makeEventsFromArray(dt: Offset): (a: Array) => Stream;

export function makeEvents(dt: Offset, n: number): Stream;
export function makeEvents(dt: Offset): (n: number) => Stream;
