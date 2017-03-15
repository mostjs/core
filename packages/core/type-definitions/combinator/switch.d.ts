import { Stream } from '@most/types';

export function switchLatest<A>(s: Stream<Stream<A>>): Stream<A>;
