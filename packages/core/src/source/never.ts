/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { disposeNone } from '@most/disposable'
import { Disposable, Stream } from '@most/types'

export const never = (): Stream<never> => NEVER

class Never implements Stream<never> {
  run (): Disposable {
    return disposeNone()
  }
}

const NEVER = new Never()
