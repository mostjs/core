import { Stream } from '../types';

export function fromIterable<A>(iterable: Iterable<A>): Stream<A>;
