import { Sink, Task } from './types';

export function propagateTask<T>(time: number, value: T, sink: Sink<T>): Task;
export function propagateTask<T>(time: number, value: T): (sink: Sink<T>) => Task;
export function propagateTask<T>(time: number): (value: T, sink: Sink<T>) => Task;
export function propagateTask<T>(time: number): (value: T) => (sink: Sink<T>) => Task;

export function propagateEventTask<T>(value: T, sink: Sink<T>): Task;
export function propagateEventTask<T>(value: T): (sink: Sink<T>) => Task;

export function propagateEndTask<T>(value: T | void, sink: Sink<T>): Task;
export function propagateEndTask<T>(value: T | void): (sink: Sink<T>) => Task;

export function propagateErrorTask(error: Error, sink: Sink<any>): Task;
export function propagateErrorTask(error: Error): (sink: Sink<any>) => Task;
