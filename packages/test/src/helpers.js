/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import {curry2} from '@most/prelude'

export const noop = () => undefined

export const bind = curry2((fn, object) => fn.bind(object))

export const apply = curry2((fn, values) => fn.apply(undefined, values))
