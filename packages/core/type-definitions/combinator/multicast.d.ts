import { Stream } from '@most/types';

export function multicast<A>(s: Stream<A>): Stream<A>;
