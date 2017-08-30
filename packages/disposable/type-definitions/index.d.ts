import { Time, Disposable, Sink } from '@most/types';

export function disposeNone (): Disposable;

export function disposeWith <R> (dispose: (resource: R) => void, resource: R): Disposable;
export function disposeWith <R> (dispose: (resource: R) => void): (resource: R) => Disposable

export function disposeOnce (d: Disposable): Disposable;

export function disposeBoth (d1: Disposable, d2: Disposable): Disposable;
export function disposeBoth (d1: Disposable): (d2: Disposable) => Disposable

export function disposeAll (ds: Array<Disposable>): Disposable;

export function dispose (d: Disposable): void

export function tryDispose (t: Time, disposable: Disposable, sink: Sink<any>): void
export function tryDispose (t: Time): (disposable: Disposable, sink: Sink<any>) => void
export function tryDispose (t: Time, disposable: Disposable): (sink: Sink<any>) => void
export function tryDispose (t: Time): (disposable: Disposable) => (sink: Sink<any>) => void
