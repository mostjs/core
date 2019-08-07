/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { disposeNone } from '@most/disposable'
import { Stream } from '@most/types' // eslint-disable-line no-unused-vars

export const never = (): Stream<never> => NEVER

class Never {
  run () {
    return disposeNone()
  }
}

const NEVER = new Never()
