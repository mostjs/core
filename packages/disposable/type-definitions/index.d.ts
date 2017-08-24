import { Time, Disposable, Sink } from '@most/types';

declare function disposeNone (): Disposable;

declare function disposeWith <R> (dispose: (resource: R) => void, resource: R): Disposable;
declare function disposeWith <R> (dispose: (resource: R) => void): (resource: R) => Disposable

declare function disposeOnce (d: Disposable): Disposable;

declare function disposeBoth (d1: Disposable, d2: Disposable): Disposable;
declare function disposeBoth (d1: Disposable): (d2: Disposable) => Disposable

declare function disposeAll (ds: Array<Disposable>): Disposable;

declare function tryDispose (t: Time, disposable: Disposable, sink: Sink<any>): void
declare function tryDispose (t: Time): (disposable: Disposable, sink: Sink<any>) => void
declare function tryDispose (t: Time, disposable: Disposable): (sink: Sink<any>) => void
declare function tryDispose (t: Time): (disposable: Disposable) => (sink: Sink<any>) => void
