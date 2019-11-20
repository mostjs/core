/** @license MIT License (c) copyright 2016 original author or authors */
/* eslint-disable import/first */
import { curry2, curry3, Curried2 } from '@most/prelude'

export { empty } from './source/empty'
export { never } from './source/never'
export { now } from './source/now'
export { at } from './source/at'

export { periodic } from './source/periodic'

export { newStream } from './source/newStream'

// -----------------------------------------------------------------------
// Observing

export { runEffects } from './runEffects'
import { run as _run } from './run'

interface Run {
  <A> (sink: Sink<A>, scheduler: Scheduler, s: Stream<A>): Disposable
  <A> (sink: Sink<A>, scheduler: Scheduler): (s: Stream<A>) => Disposable
  <A> (sink: Sink<A>): Curried2<Scheduler, Stream<A>, Disposable>
}
export const run: Run = curry3(_run)

// -------------------------------------------------------

import { withLocalTime as _withLocalTime } from './combinator/withLocalTime'

interface WithLocalTime {
  <A>(origin: Time, s: Stream<A>): Stream<A>
  <A>(origin: Time): (s: Stream<A>) => Stream<A>
}
export const withLocalTime: WithLocalTime = curry2(_withLocalTime)

// -------------------------------------------------------

import { loop as _loop, SeedValue } from './combinator/loop'

interface Loop {
  <A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>, seed: S, s: Stream<A>): Stream<B>
  <A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>, seed: S): (s: Stream<A>) => Stream<B>
  <A, B, S>(f: (seed: S, a: A) => SeedValue<S, B>): Curried2<S, Stream<A>, Stream<B>>
}
export const loop: Loop = curry3(_loop)

// -------------------------------------------------------

import { scan as _scan } from './combinator/scan'

interface Scan {
  <A, B>(f: (b: B, a: A) => B, b: B, s: Stream<A>): Stream<B>
  <A, B>(f: (b: B, a: A) => B, b: B): (s: Stream<A>) => Stream<B>
  <A, B>(f: (b: B, a: A) => B): Curried2<B, Stream<A>, Stream<B>>
}
export const scan: Scan = curry3(_scan)

// -----------------------------------------------------------------------
// Extending

import { startWith as _startWith } from './combinator/startWith'

interface StartWith {
  <A>(value: A, stream: Stream<A>): Stream<A>
  <A>(value: A): (stream: Stream<A>) => Stream<A>
}
export const startWith: StartWith = curry2(_startWith)

// -----------------------------------------------------------------------
// Transforming

import { map as _map, constant as _constant, tap as _tap } from './combinator/transform'
import { ap as _ap } from './combinator/applicative'

interface Map {
  <A, B>(f: (a: A) => B, s: Stream<A>): Stream<B>
  <A, B>(f: (a: A) => B): (s: Stream<A>) => Stream<B>
}
export const map: Map = curry2(_map)
interface Constant {
  <A, B>(b: B, s: Stream<A>): Stream<B>
  <A, B>(b: B): (s: Stream<A>) => Stream<B>
}
export const constant: Constant = curry2(_constant)
interface Tap {
  <A>(f: (a: A) => any, s: Stream<A>): Stream<A>
  <A>(f: (a: A) => any): (s: Stream<A>) => Stream<A>
}
export const tap: Tap = curry2(_tap)
interface Ap {
  <A, B>(streamofFunctions: Stream<(a: A) => B>, streamOfValues: Stream<A>): Stream<B>
  <A, B>(streamofFunctions: Stream<(a: A) => B>): (streamOfValues: Stream<A>) => Stream<B>
}
export const ap: Ap = curry2(_ap)

// -----------------------------------------------------------------------
// FlatMapping

import { chain as _chain, join } from './combinator/chain'
interface Chain {
  <A, B>(f: (value: A) => Stream<B>, stream: Stream<A>): Stream<B>
  <A, B>(f: (value: A) => Stream<B>): (stream: Stream<A>) => Stream<B>
}
export const chain: Chain = curry2(_chain)
export { join }

import { continueWith as _continueWith } from './combinator/continueWith'
interface ContinueWith {
  <A>(f: () => Stream<A>, s: Stream<A>): Stream<A>
  <A>(f: () => Stream<A>): (s: Stream<A>) => Stream<A>
}
export const continueWith: ContinueWith = curry2(_continueWith)

import { concatMap as _concatMap } from './combinator/concatMap'
interface ConcatMap {
  <A, B>(f: (a: A) => Stream<B>, stream: Stream<A>): Stream<B>
  <A, B>(f: (a: A) => Stream<B>): (stream: Stream<A>) => Stream<B>
}
export const concatMap: ConcatMap = curry2(_concatMap)

// -----------------------------------------------------------------------
// Concurrent merging

import { mergeConcurrently as _mergeConcurrently, mergeMapConcurrently as _mergeMapConcurrently } from './combinator/mergeConcurrently'

interface MergeConcurrently {
  <A>(concurrency: number, s: Stream<Stream<A>>): Stream<A>
  <A>(concurrency: number): (s: Stream<Stream<A>>) => Stream<A>
}
export const mergeConcurrently: MergeConcurrently = curry2<number, Stream<Stream<unknown>>, Stream<unknown>>(_mergeConcurrently)
interface MergeMapConcurrently {
  <A, B>(f: (a: A) => Stream<B>, concurrency: number, s: Stream<A>): Stream<B>
  <A, B>(f: (a: A) => Stream<B>, concurrency: number): (s: Stream<A>) => Stream<B>
  <A, B>(f: (a: A) => Stream<B>): Curried2<number, Stream<A>, Stream<B>>
}
export const mergeMapConcurrently: MergeMapConcurrently = curry3(_mergeMapConcurrently)

// -----------------------------------------------------------------------
// Merging

import { merge as _merge, mergeArray } from './combinator/merge'

interface Merge {
  <A, B>(s1: Stream<A>, s2: Stream<B>): Stream<A | B>
  <A, B>(s1: Stream<A>): (s2: Stream<B>) => Stream<A | B>
}
export const merge: Merge = curry2(_merge)
export { mergeArray }

// -----------------------------------------------------------------------
// Combining

import { combine as _combine, combineArray as _combineArray } from './combinator/combine'

interface Combine {
  <A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>
  <A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>): (b: Stream<B>) => Stream<R>
  <A, B, R>(fn: (a: A, b: B) => R): Curried2<Stream<A>, Stream<B>, Stream<R>>
}
export const combine: Combine = curry3(_combine)
interface CombineArray {
  <Args extends unknown[], R>(fn: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R>
  <Args extends unknown[], R>(fn: (...args: Args) => R): (streams: ToStreamsArray<Args>) => Stream<R>
}
export const combineArray: CombineArray = curry2(_combineArray as any) as any

// -----------------------------------------------------------------------
// Sampling

import { sample as _sample, snapshot as _snapshot } from './combinator/snapshot'

interface Sample {
  <A, B>(values: Stream<A>, sampler: Stream<B>): Stream<A>
  <A, B>(values: Stream<A>): (sampler: Stream<B>) => Stream<A>
}
export const sample: Sample = curry2(_sample)
interface Snapshot {
  <A, B, C>(f: (a: A, b: B) => C, values: Stream<A>, sampler: Stream<B>): Stream<C>
  <A, B, C>(f: (a: A, b: B) => C, values: Stream<A>): (sampler: Stream<B>) => Stream<C>
  <A, B, C>(f: (a: A, b: B) => C): Curried2<Stream<A>, Stream<B>, Stream<C>>
}
export const snapshot: Snapshot = curry3(_snapshot)

// -----------------------------------------------------------------------
// Zipping

import { zipItems as _zipItems, withItems as _withItems } from './combinator/zipItems'
interface ZipItems {
  <A, B, C> (f: (a: A, b: B) => C, a: Array<A>, s: Stream<B>): Stream<C>
  <A, B, C> (f: (a: A, b: B) => C, a: Array<A>): (s: Stream<B>) => Stream<C>
  <A, B, C> (f: (a: A, b: B) => C): Curried2<Array<A>, Stream<B>, Stream<C>>
}
export const zipItems: ZipItems = curry3(_zipItems)
interface WithItems {
  <A>(a: Array<A>, s: Stream<unknown>): Stream<A>
  <A>(a: Array<A>): (s: Stream<unknown>) => Stream<A>
}
export const withItems: WithItems = curry2(_withItems)

import { zip as _zip, zipArray as _zipArray } from './combinator/zip'
interface Zip {
  <A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>
  <A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>): (b: Stream<B>) => Stream<R>
  <A, B, R>(fn: (a: A, b: B) => R): Curried2<Stream<A>, Stream<B>, Stream<R>>
}
export const zip: Zip = curry3(_zip)
interface ZipArray {
  <Args extends unknown[], R>(fn: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R>
  <Args extends unknown[], R>(fn: (...args: Args) => R): (streams: ToStreamsArray<Args>) => Stream<R>
}
export const zipArray: ZipArray = curry2(_zipArray as any) as any

// -----------------------------------------------------------------------
// Switching

export { switchLatest } from './combinator/switch'

// -----------------------------------------------------------------------
// Filtering

import { filter as _filter, skipRepeats, skipRepeatsWith as _skipRepeatsWith } from './combinator/filter'

interface Filter {
  <A, B extends A>(p: (a: A) => a is B, s: Stream<A>): Stream<B>
  <A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>
  <A, B extends A>(p: (a: A) => a is B): (s: Stream<A>) => Stream<B>
  <A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>
}
export const filter: Filter = curry2(_filter)
export { skipRepeats }
interface ShipRepeatsWith {
  <A>(eq: (a1: A, a2: A) => boolean, s: Stream<A>): Stream<A>
  <A>(eq: (a1: A, a2: A) => boolean): (s: Stream<A>) => Stream<A>
}
export const skipRepeatsWith: ShipRepeatsWith = curry2(_skipRepeatsWith)

// -----------------------------------------------------------------------
// Slicing

import { take as _take, skip as _skip, slice as _slice, takeWhile as _takeWhile, skipWhile as _skipWhile, skipAfter as _skipAfter } from './combinator/slice'

interface Take {
  <A>(n: number, s: Stream<A>): Stream<A>
  <A>(n: number): (s: Stream<A>) => Stream<A>
}
export const take: Take = curry2(_take)
interface Skip {
  <A>(n: number, s: Stream<A>): Stream<A>
  <A>(n: number): (s: Stream<A>) => Stream<A>
}
export const skip: Skip = curry2(_skip)
interface Slice {
  <A>(start: number, end: number, s: Stream<A>): Stream<A>
  <A>(start: number, end: number): (s: Stream<A>) => Stream<A>
  <A>(start: number): Curried2<number, Stream<A>, Stream<A>>
}
export const slice: Slice = curry3(_slice)
interface TakeWhile {
  <A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>
  <A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>
}
export const takeWhile: TakeWhile = curry2(_takeWhile)
interface SkipWhile {
  <A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>
  <A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>
}
export const skipWhile: SkipWhile = curry2(_skipWhile)
interface SkipAfter {
  <A>(p: (a: A) => boolean, s: Stream<A>): Stream<A>
  <A>(p: (a: A) => boolean): (s: Stream<A>) => Stream<A>
}
export const skipAfter: SkipAfter = curry2(_skipAfter)

// -----------------------------------------------------------------------
// Time slicing

import { until as _until, since as _since, during as _during } from './combinator/timeslice'

interface Until {
  <A>(signal: Stream<any>, s: Stream<A>): Stream<A>
  <A>(signal: Stream<any>): (s: Stream<A>) => Stream<A>
}
export const until: Until = curry2(_until)
interface Since {
  <A>(signal: Stream<any>, s: Stream<A>): Stream<A>
  <A>(signal: Stream<any>): (s: Stream<A>) => Stream<A>
}
export const since: Since = curry2(_since)
interface During {
  <A>(timeWindow: Stream<Stream<any>>, s: Stream<A>): Stream<A>
  <A>(timeWindow: Stream<Stream<any>>): (s: Stream<A>) => Stream<A>
}
export const during: During = curry2(_during)

// -----------------------------------------------------------------------
// Delaying

import { delay as _delay } from './combinator/delay'

interface Delay {
  <A>(dt: number, s: Stream<A>): Stream<A>
  <A>(dt: number): (s: Stream<A>) => Stream<A>
}
export const delay: Delay = curry2(_delay)

// -----------------------------------------------------------------------
// Rate limiting

import { throttle as _throttle, debounce as _debounce } from './combinator/limit'

interface Throttle {
  <A>(period: number, s: Stream<A>): Stream<A>
  <A>(period: number): (s: Stream<A>) => Stream<A>
}
export const throttle: Throttle = curry2(_throttle)
interface Debounce {
  <A>(period: number, s: Stream<A>): Stream<A>
  <A>(period: number): (s: Stream<A>) => Stream<A>
}
export const debounce: Debounce = curry2(_debounce)

// -----------------------------------------------------------------------
// Awaiting Promises

export { fromPromise, awaitPromises } from './combinator/promises'

// -----------------------------------------------------------------------
// Error handling

import { recoverWith as _recoverWith, throwError } from './combinator/errors'

interface RecoverWith {
  <A, E extends Error>(p: (error: E) => Stream<A>, s: Stream<A>): Stream<A>
  <A, E extends Error>(p: (error: E) => Stream<A>): (s: Stream<A>) => Stream<A>
}
export const recoverWith: RecoverWith = curry2(_recoverWith)
export { throwError }

// -----------------------------------------------------------------------
// Multicasting

export { multicast, MulticastSource } from './combinator/multicast'

// ----------------------------------------------------------------------
import {
  propagateTask as _propagateTask,
  propagateEventTask as _propagateEventTask,
  propagateErrorTask as _propagateErrorTask,
  propagateEndTask,
  PropagateTaskRun,
  PropagateTask as PropagateTaskResult
} from './scheduler/PropagateTask'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'
import { ToStreamsArray } from './combinator/variadic'

interface PropagateTask {
  <A>(run: PropagateTaskRun<A>, value: A, sink: Sink<A>): PropagateTaskResult
  <A>(run: PropagateTaskRun<A>, value: A): (sink: Sink<A>) => PropagateTaskResult
  <A>(run: PropagateTaskRun<A>): Curried2<A, Sink<A>, PropagateTaskResult>
}
export const propagateTask: PropagateTask = curry3(_propagateTask)
interface PropagateEventTask {
  <T>(value: T, sink: Sink<T>): PropagateTaskResult
  <T>(value: T): (sink: Sink<T>) => PropagateTaskResult
}
export const propagateEventTask: PropagateEventTask = curry2(_propagateEventTask)
export const propagateErrorTask: Curried2<Error, Sink<unknown>, PropagateTaskResult> = curry2(_propagateErrorTask)
export { propagateEndTask }
