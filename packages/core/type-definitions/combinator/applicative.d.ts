import { Stream } from '@most/types';

export function ap<A, B>(streamofFunctions: Stream<(a: A) => B>, streamOfValues: Stream<A>): Stream<B>;

export function ap<A, B>(streamofFunctions: Stream<(a: A) => B>): (streamOfValues: Stream<A>) => Stream<B>;
