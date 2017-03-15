import { Stream } from '@most/types';

export function fromIterable<A>(iterable: Iterable<A>): Stream<A>;
