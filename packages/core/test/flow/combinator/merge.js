// @flow
import { merge, now, runEffects } from '../../../src/index'
import { type Stream } from '@most/types'
import { newDefaultScheduler } from '@most/scheduler'

const s1 = now(123)
const s2 = now('a')
const s = merge(s1, s2)

runEffects(s, newDefaultScheduler())
