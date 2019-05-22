// @flow
import { mergeArray, now, runEffects } from '../../../src/index'
import { type Stream } from '@most/types'
import { newDefaultScheduler } from '@most/scheduler'

const s: Stream<number | string | boolean> = mergeArray([now(123), now('a'), now(true)])

runEffects(s, newDefaultScheduler())
