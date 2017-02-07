import { Stream } from '../types';

export function switchLatest<A>(s: Stream<Stream<A>>): Stream<A>;
