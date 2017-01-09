/** @license MIT License (c) copyright 2016 original author or authors */
import { curry2, curry3 } from '@most/prelude'

export { default as Stream } from './Stream'

export { just, empty, never } from './source/core'

export { periodic } from './source/periodic'

export { fromArray } from './source/fromArray'

export { fromIterable } from './source/fromIterable'

// -----------------------------------------------------------------------
// Observing

import { runEffects as _runEffects } from './runEffects'

export const runEffects = curry2(_runEffects)

import { observe as _observe, drain } from './combinator/observe'

export { drain }
export const observe = curry2(_observe)

// -------------------------------------------------------

import { loop as _loop } from './combinator/loop'

export const loop = curry3(_loop)

// -------------------------------------------------------

import { scan as _scan } from './combinator/accumulate'

export const scan = curry3(_scan)

// -----------------------------------------------------------------------
// Building and extending

import { unfold as _unfold } from './source/unfold'
export const unfold = curry2(_unfold)

import { iterate as _iterate } from './source/iterate'
export const iterate = curry2(_iterate)

export { generate } from './source/generate'

import { concat as _concat, startWith as _startWith } from './combinator/build'
export const concat = curry2(_concat)
export const startWith = curry2(_startWith)

// -----------------------------------------------------------------------
// Transforming

import { map as _map, constant as _constant, tap as _tap } from './combinator/transform'
import { ap as _ap } from './combinator/applicative'

export const map = curry2(_map)
export const constant = curry2(_constant)
export const tap = curry2(_tap)
export const ap = curry2(_ap)

// -----------------------------------------------------------------------
// FlatMapping

import { chain as _chain, join } from './combinator/chain'
export const chain = curry2(_chain)
export { join }

import { continueWith as _continueWith } from './combinator/continueWith'
export const continueWith = curry2(_continueWith)

import { concatMap as _concatMap } from './combinator/concatMap'
export const concatMap = curry2(_concatMap)

// -----------------------------------------------------------------------
// Concurrent merging

import { mergeConcurrently as _mergeConcurrently, mergeMapConcurrently as _mergeMapConcurrently } from './combinator/mergeConcurrently'

export const mergeConcurrently = curry2(_mergeConcurrently)
export const mergeMapConcurrently = curry3(_mergeMapConcurrently)

// -----------------------------------------------------------------------
// Merging

export { merge, mergeArray } from './combinator/merge'

// -----------------------------------------------------------------------
// Combining

import { combine, combineArray as _combineArray } from './combinator/combine'

export { combine }
export const combineArray = curry2(_combineArray)

// -----------------------------------------------------------------------
// Sampling

import { sample as _sample } from './combinator/sample'

export const sample = curry3(_sample)

// -----------------------------------------------------------------------
// Zipping

import { zip, zipArray as _zipArray } from './combinator/zip'

export { zip }
export const zipArray = curry2(_zipArray)

// -----------------------------------------------------------------------
// Switching

export { switchLatest } from './combinator/switch'

// -----------------------------------------------------------------------
// Filtering

import { filter as _filter, skipRepeats, skipRepeatsWith as _skipRepeatsWith } from './combinator/filter'

export const filter = curry2(_filter)
export { skipRepeats }
export const skipRepeatsWith = curry2(_skipRepeatsWith)

// -----------------------------------------------------------------------
// Slicing

import { take as _take, skip as _skip, slice as _slice, takeWhile as _takeWhile, skipWhile as _skipWhile } from './combinator/slice'

export const take = curry2(_take)
export const skip = curry2(_skip)
export const slice = curry3(_slice)
export const takeWhile = curry2(_takeWhile)
export const skipWhile = curry2(_skipWhile)

// -----------------------------------------------------------------------
// Time slicing

import { takeUntil as _takeUntil, skipUntil as _skipUntil, during as _during } from './combinator/timeslice'

export const until = curry2(_takeUntil)
export const since = curry2(_skipUntil)
export const during = curry2(_during)

// -----------------------------------------------------------------------
// Delaying

import { delay as _delay } from './combinator/delay'

export const delay = curry2(_delay)

// -----------------------------------------------------------------------
// Getting event timestamp

export { timestamp } from './combinator/timestamp'

// -----------------------------------------------------------------------
// Rate limiting

import { throttle as _throttle, debounce as _debounce } from './combinator/limit'

export const throttle = curry2(_throttle)
export const debounce = curry2(_debounce)

// -----------------------------------------------------------------------
// Awaiting Promises

export { fromPromise, awaitPromises } from './combinator/promises'

// -----------------------------------------------------------------------
// Error handling

import { recoverWith as _recoverWith, throwError } from './combinator/errors'

export const recoverWith = curry2(_recoverWith)
export { throwError }

// export the instance of the defaultScheduler for third-party libraries
export { default as defaultScheduler } from './scheduler/defaultScheduler'

// export an implementation of Task used internally for third-party libraries
export { default as PropagateTask } from './scheduler/PropagateTask'
