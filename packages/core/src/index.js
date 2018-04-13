/** @license MIT License (c) copyright 2016 original author or authors */
import { curry2, curry3 } from '@most/prelude'
import { zipItems as _zipItems, withItems as _withItems } from './combinator/zipItems'
import { runEffects as _runEffects } from './runEffects'
import { run as _run } from './run'
import { withLocalTime as _withLocalTime } from './combinator/withLocalTime'
import { loop as _loop } from './combinator/loop'
import { scan as _scan } from './combinator/scan'
import { startWith as _startWith } from './combinator/startWith'
import { map as _map, constant as _constant, tap as _tap } from './combinator/transform'
import { ap as _ap } from './combinator/applicative'
import { chain as _chain, join } from './combinator/chain'
import { continueWith as _continueWith } from './combinator/continueWith'
import { concatMap as _concatMap } from './combinator/concatMap'
import { mergeConcurrently as _mergeConcurrently, mergeMapConcurrently as _mergeMapConcurrently } from './combinator/mergeConcurrently'
import { merge as _merge, mergeArray } from './combinator/merge'
import { combine as _combine, combineArray as _combineArray } from './combinator/combine'
import { sample as _sample, snapshot as _snapshot } from './combinator/snapshot'
import { zip as _zip, zipArray as _zipArray } from './combinator/zip'
import { filter as _filter, skipRepeats, skipRepeatsWith as _skipRepeatsWith } from './combinator/filter'
import { take as _take, skip as _skip, slice as _slice, takeWhile as _takeWhile, skipWhile as _skipWhile, skipAfter as _skipAfter } from './combinator/slice'
import { until as _until, since as _since, during as _during } from './combinator/timeslice'
import { delay as _delay } from './combinator/delay'
import { throttle as _throttle, debounce as _debounce } from './combinator/limit'
import { recoverWith as _recoverWith, throwError } from './combinator/errors'
import {
  propagateTask as _propagateTask,
  propagateEventTask as _propagateEventTask,
  propagateErrorTask as _propagateErrorTask,
  propagateEndTask
} from './scheduler/PropagateTask'

export { empty } from './source/empty'
export { never } from './source/never'
export { now } from './source/now'
export { at } from './source/at'

export { periodic } from './source/periodic'

export { newStream } from './source/newStream'

export const zipItems = curry3(_zipItems)
export const withItems = curry2(_withItems)

// -----------------------------------------------------------------------
// Observing

export const runEffects = curry2(_runEffects)
export const run = curry3(_run)

// -------------------------------------------------------

export const withLocalTime = curry2(_withLocalTime)

// -------------------------------------------------------

export const loop = curry3(_loop)

// -------------------------------------------------------

export const scan = curry3(_scan)

// -----------------------------------------------------------------------
// Extending

export const startWith = curry2(_startWith)

// -----------------------------------------------------------------------
// Transforming

export const map = curry2(_map)
export const constant = curry2(_constant)
export const tap = curry2(_tap)
export const ap = curry2(_ap)

// -----------------------------------------------------------------------
// FlatMapping

export const chain = curry2(_chain)
export { join }

export const continueWith = curry2(_continueWith)
export const concatMap = curry2(_concatMap)

// -----------------------------------------------------------------------
// Concurrent merging

export const mergeConcurrently = curry2(_mergeConcurrently)
export const mergeMapConcurrently = curry3(_mergeMapConcurrently)

// -----------------------------------------------------------------------
// Merging

export const merge = curry2(_merge)
export { mergeArray }

// -----------------------------------------------------------------------
// Combining

export const combine = curry3(_combine)
export const combineArray = curry2(_combineArray)

// -----------------------------------------------------------------------
// Sampling

export const sample = curry2(_sample)
export const snapshot = curry3(_snapshot)

// -----------------------------------------------------------------------
// Zipping

export const zip = curry3(_zip)
export const zipArray = curry2(_zipArray)

// -----------------------------------------------------------------------
// Switching

export { switchLatest } from './combinator/switch'

// -----------------------------------------------------------------------
// Filtering

export const filter = curry2(_filter)
export { skipRepeats }
export const skipRepeatsWith = curry2(_skipRepeatsWith)

// -----------------------------------------------------------------------
// Slicing

export const take = curry2(_take)
export const skip = curry2(_skip)
export const slice = curry3(_slice)
export const takeWhile = curry2(_takeWhile)
export const skipWhile = curry2(_skipWhile)
export const skipAfter = curry2(_skipAfter)

// -----------------------------------------------------------------------
// Time slicing

export const until = curry2(_until)
export const since = curry2(_since)
export const during = curry2(_during)

// -----------------------------------------------------------------------
// Delaying

export const delay = curry2(_delay)

// -----------------------------------------------------------------------
// Rate limiting

export const throttle = curry2(_throttle)
export const debounce = curry2(_debounce)

// -----------------------------------------------------------------------
// Awaiting Promises

export { fromPromise, awaitPromises } from './combinator/promises'

// -----------------------------------------------------------------------
// Error handling

export const recoverWith = curry2(_recoverWith)
export { throwError }

// -----------------------------------------------------------------------
// Multicasting

export { multicast, MulticastSource } from './combinator/multicast'

// ----------------------------------------------------------------------
export const propagateTask = curry3(_propagateTask)
export const propagateEventTask = curry2(_propagateEventTask)
export const propagateErrorTask = curry2(_propagateErrorTask)
export { propagateEndTask }
