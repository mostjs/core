/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { just } from '../source/core'
import { continueWith } from './continueWith'

/**
 * @param {*} x value to prepend
 * @param {Stream} stream
 * @returns {Stream} new stream with x prepended
 */
export const startWith = (x, stream) => concat(just(x), stream)

/**
* @param {Stream} left
* @param {Stream} right
* @returns {Stream} new stream containing all events in left followed by all
*  events in right.  This *timeshifts* right to the end of left.
*/
export const concat = (left, right) => continueWith(() => right, left)
