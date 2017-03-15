import { Sink, Task } from '@most/types';

export function propagateTask<T>(run: PropagateTaskRun<T>, value: T, sink: Sink<T>): PropagateTask<T>;
export function propagateTask<T>(run: PropagateTaskRun<T>, value: T): (sink: Sink<T>) => PropagateTask<T>;
export function propagateTask<T>(run: PropagateTaskRun<T>): (value: T, sink: Sink<T>) => PropagateTask<T>;
export function propagateTask<T>(run: PropagateTaskRun<T>): (value: T) => (sink: Sink<T>) => PropagateTask<T>;

export function propagateEventTask<T>(value: T, sink: Sink<T>): PropagateTask<T>;
export function propagateEventTask<T>(value: T): (sink: Sink<T>) => PropagateTask<T>;

export function propagateEndTask<T>(value: T | void, sink: Sink<T>): PropagateTask<T>;
export function propagateEndTask<T>(value: T | void): (sink: Sink<T>) => PropagateTask<T>;

export function propagateErrorTask(error: Error, sink: Sink<any>): PropagateTask<any>;
export function propagateErrorTask(error: Error): (sink: Sink<any>) => PropagateTask<any>;

export type PropagateTaskRun<A> =
  (time: number, value: A, sink: Sink<A>, task: PropagateTask<A>) => any

export interface PropagateTask<A> extends Task {
  value: A;
  sink: Sink<A>;
  active: boolean;
}
