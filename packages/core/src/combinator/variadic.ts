import { Stream } from '@most/types' // eslint-disable-line no-unused-vars

// Map arrays to arrays of Streams:
// Array<A> => Array<Stream<A>>
// [A, B, C, ...] => [Stream<A>, Stream<B>, Stream<C>, ...]
// TODO: use readonly any[] once TS 3.4.x has been in the wild for "enough" time
export type ToStreamsArray<A extends ReadonlyArray<any>> = {
  [K in keyof A]: Stream<A[K]>
}
