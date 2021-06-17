import { Stream } from '@most/types'

type LiteralArray<A extends ArrayLike<any>> = {
  [K in keyof A]: Stream<A[K]>
}

export type InputStreamArray<Args extends ArrayLike<any>> = Readonly<LiteralArray<Args> | Stream<unknown>[]>
