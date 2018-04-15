/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import { eq } from '@briancavalier/assert'
import {curry2} from '@most/prelude'
import {apply} from './helpers'
import {collectEvents} from './collectors'

export const assertSame = curry2((s1, s2) => Promise
  .all([
    collectEvents(s1),
    collectEvents(s2)
  ])
  .then(apply(eq)))

export const expectArray = curry2((array, s) => collectEvents(s).then(eq(array)))
