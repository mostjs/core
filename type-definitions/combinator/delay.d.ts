import { Stream } from '../types';

export function delay<A>(dt: number, s: Stream<A>): Stream<A>;
export function delay<A>(dt: number): (s: Stream<A>) => Stream<A>;
export function delay(dt: number, s: Stream<any>): Stream<any>;
export function delay(dt: number): (s: Stream<any>) => Stream<any>;