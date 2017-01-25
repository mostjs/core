import { Stream } from '../types';

export function throttle<A>(period: number, s: Stream<A>): Stream<A>;
export function throttle<A>(period: number): (s: Stream<A>) => Stream<A>;

export function debounce<A>(period: number, s: Stream<A>): Stream<A>;
export function debounce<A>(period: number): (s: Stream<A>) => Stream<A>;
