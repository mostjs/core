import { Stream } from '../types';

export function throttle<A>(period: number, s: Stream<A>): Stream<A>;
export function throttle<A>(period: number): (s: Stream<A>) => Stream<A>;
export function throttle(period: number, s: Stream<any>): Stream<any>;
export function throttle(period: number): (s: Stream<any>) => Stream<any>;

export function debounce<A>(period: number, s: Stream<A>): Stream<A>;
export function debounce<A>(period: number): (s: Stream<A>) => Stream<A>;
export function debounce(period: number, s: Stream<any>): Stream<any>;
export function debounce(period: number): (s: Stream<any>) => Stream<any>;