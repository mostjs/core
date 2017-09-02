import { Sink, Task } from '@most/types';

export function propagateTask<A, B = A>(run: PropagateTaskRun<A, B>, value: A, sink: Sink<B>): PropagateTask<A, B>;
export function propagateTask<A, B = A>(run: PropagateTaskRun<A, B>, value: A): (sink: Sink<B>) => PropagateTask<A, B>;
export function propagateTask<A, B = A>(run: PropagateTaskRun<A, B>): (value: A, sink: Sink<B>) => PropagateTask<A, B>;
export function propagateTask<A, B = A>(run: PropagateTaskRun<A, B>): (value: A) => (sink: Sink<B>) => PropagateTask<A, B>;

export function propagateEventTask<T>(value: T, sink: Sink<T>): PropagateTask<T>;
export function propagateEventTask<T>(value: T): (sink: Sink<T>) => PropagateTask<T>;

export function propagateEndTask<T>(sink: Sink<T>): PropagateTask<void>;

export function propagateErrorTask(error: Error, sink: Sink<any>): PropagateTask<any>;
export function propagateErrorTask(error: Error): (sink: Sink<any>) => PropagateTask<any>;

export type PropagateTaskRun<A, B = A> =
  (time: number, value: A, sink: Sink<B>) => any

export interface PropagateTask<A, B = A> extends Task {
  value: A;
  sink: Sink<B>;
  active: boolean;
}