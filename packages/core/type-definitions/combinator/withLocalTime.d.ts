import { Time, Stream } from '@most/types'

export function withLocalTime <A> (origin: Time, s: Stream<A>): Stream<A>
export function withLocalTime <A> (origin: Time): (s: Stream<A>) => Stream<A>
