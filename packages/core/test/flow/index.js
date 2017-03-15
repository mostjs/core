// @flow

// Flow type tests

import { just, switchLatest, map, constant, runEffects } from '../../src/index'
import { newDefaultScheduler } from '@most/scheduler'

const f: (number) => number = a => a

const scheduler = newDefaultScheduler()
const s = constant('hi')(map(f)(switchLatest(map(just, just(123)))))

runEffects(s, scheduler)
  .then(console.log)
