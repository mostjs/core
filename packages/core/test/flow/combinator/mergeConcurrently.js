// @flow
import { mergeMapConcurrently, now, runEffects } from '../../../src/index'
import { type Stream } from '@most/types'
import { newDefaultScheduler } from '@most/scheduler'

const s = now(123)
const s1: Stream<number> = mergeMapConcurrently(now, 2, s)
const s2: Stream<number> = mergeMapConcurrently(now, 2)(s)
const s3: Stream<number> = mergeMapConcurrently(now)(2, s)
const s4: Stream<number> = mergeMapConcurrently(now)(2)(s)

runEffects(s1, newDefaultScheduler())
runEffects(s2, newDefaultScheduler())
runEffects(s3, newDefaultScheduler())
runEffects(s4, newDefaultScheduler())
