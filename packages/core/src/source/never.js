/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { disposeNone } from '@most/disposable'

export const never = () => NEVER

class Never {
  run () {
    return disposeNone()
  }
}

const NEVER = new Never()
