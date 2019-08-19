import { zipItems, now, run, scan, loop, mergeMapConcurrently, combine, snapshot, zip, slice, propagateTask } from '../src'
import { Stream, Sink } from '@most/types'
import { newDefaultScheduler } from '@most/scheduler'
import { SeedValue } from '../src/combinator/loop'

// prepare
const add = (acc: number, n: number): number => acc + n
const addSeed = (acc: number, n: number): SeedValue<number, number> => {
  const s = add(acc, n)
  return {
    seed: s,
    value: s
  }
}
const sink: Sink<void> = {
  event () {},
  end () {},
  error () {}
}
const scheduler = newDefaultScheduler()

// run
export const t1 = run(sink, scheduler, now(undefined))
export const t2 = run(sink, scheduler)(now(undefined))
export const t3 = run(sink)(scheduler, now(undefined))
export const t4 = run(sink)(scheduler)(now(undefined))

// loop
export const t5: Stream<number> = loop(addSeed, 0, now(1))
export const t6: Stream<number> = loop(addSeed, 0)(now(1))
export const t7: Stream<number> = loop(addSeed)(0, now(1))
export const t8: Stream<number> = loop(addSeed)(0)(now(1))

// scan
export const t9: Stream<number> = scan(add, 0, now(1))
export const t10: Stream<number> = scan(add, 0)(now(1))
export const t11: Stream<number> = scan(add)(0, now(1))
export const t12: Stream<number> = scan(add)(0)(now(1))

// mergeMapConcurrently
export const t13: Stream<number> = mergeMapConcurrently(now, 1, now(123))
export const t14: Stream<number> = mergeMapConcurrently(now, 1)(now(123))
export const t15: Stream<number> = mergeMapConcurrently(now)(1, now(123))
export const t16: Stream<number> = mergeMapConcurrently(now)(1)(now(123))

// combine
export const t17: Stream<number> = combine(add, now(1), now(2))
export const t18: Stream<number> = combine(add, now(1))(now(2))
export const t19: Stream<number> = combine(add)(now(1), now(2))
export const t20: Stream<number> = combine(add)(now(1))(now(2))

// snapshot
export const t21: Stream<number> = snapshot(add, now(1), now(2))
export const t22: Stream<number> = snapshot(add, now(1))(now(2))
export const t23: Stream<number> = snapshot(add)(now(1), now(2))
export const t24: Stream<number> = snapshot(add)(now(1))(now(2))

// zipItems
export const t25: Stream<number> = zipItems(add, [0], now(1))
export const t26: Stream<number> = zipItems(add, [0])(now(1))
export const t27: Stream<number> = zipItems(add)([0], now(1))
export const t28: Stream<number> = zipItems(add)([0])(now(1))

// zip
export const t29: Stream<number> = zip(add, now(0), now(1))
export const t30: Stream<number> = zip(add, now(0))(now(1))
export const t31: Stream<number> = zip(add)(now(0), now(1))
export const t32: Stream<number> = zip(add)(now(0))(now(1))

// slice
export const t33: Stream<number> = slice(0, 1, now(1))
export const t34: Stream<number> = slice(0, 1)(now(1))
export const t35: Stream<number> = slice(0)(1, now(1))
export const t36: Stream<number> = slice(0)(1)(now(1))

// propagateTask
export const t37 = propagateTask(() => {}, undefined, sink)
export const t38 = propagateTask(() => {}, undefined)(sink)
export const t39 = propagateTask(() => {})(undefined, sink)
export const t40 = propagateTask(() => {})(undefined)(sink)
