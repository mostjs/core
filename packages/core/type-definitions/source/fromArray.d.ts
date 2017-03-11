import { Stream } from '@most/types';

export function fromArray<A>(array: Array<A> | ArrayLike<A>): Stream<A>;
export function fromArray(array: Array<any> | ArrayLike<any>): Stream<any>;
