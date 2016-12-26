/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import { fromArray } from './fromArray'
import { isIterable } from '../iterable'
import { fromIterable } from './fromIterable'
import { isArrayLike } from '@most/prelude'

function coerce (a) { // eslint-disable-line complexity
  if (a instanceof Stream) {
    return a
  }

  if (Array.isArray(a) || isArrayLike(a)) {
    return fromArray(a)
  }

  if (isIterable(a)) {
    return fromIterable(a)
  }

  throw new TypeError('from(x) must be observable, iterable, or array-like: ' + a)
}

export { coerce as from }
