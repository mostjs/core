/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha'
import assert from 'assert'

import { id, compose, apply, curry2, curry3 } from '../src/function'

describe('id', () => {
  it('id(x) === x', () => {
    const x = {}
    assert.strictEqual(id(x), x)
  })
})

describe('compose', () => {
  it('compose(f, g)(x) === f(g(x))', () => {
    const fx = '' + Math.random()
    const gx = '' + Math.random()
    const x = '' + Math.random()

    const f = x => x + fx
    const g = x => x + gx
    const h = compose(f, g)

    assert.strictEqual(f(g(x)), h(x))
  })
})

describe('apply', () => {
  it('apply(f, x) === f(x)', () => {
    const x = Math.random()
    const f = x => x + 1
    assert.strictEqual(apply(f, x), f(x))
  })
})

describe('curry2', () => {
  it('should return the original function if no args are given', () => {
    const fn = (a, b) => a + b
    const curriedFn = curry2(fn)
    assert.strictEqual(curriedFn().length, 2)
  })

  it('should return a function of length 1 when 1 arg is given', () => {
    const fn = (a, b) => a + b
    const curriedFn = curry2(fn)
    assert.strictEqual(curriedFn(1).length, 1)
  })

  it('should execute function when given 2 args', () => {
    const fn = (a, b) => a + b
    const curriedFn = curry2(fn)
    assert.strictEqual(typeof curriedFn(1, 2).length, 'undefined')
    assert.strictEqual(curriedFn(1, 2), 3)
  })

  it('should be invariant', () => {
    const f = (x, y) => x + y
    const a = 1
    const b = 2

    const bool =
      curry2(f)(a)(b) === 3 &&
      curry2(f)(a, b) === 3 &&
      f(a, b) === 3

    assert.strictEqual(bool, true)
  })
})

describe('curry3', () => {
  it('should return the original function if no args are given', () => {
    const fn = (a, b, c) => a + b + c
    const curriedFn = curry3(fn)
    assert.strictEqual(curriedFn().length, 3)
  })

  it('should return a function of length 2 when 1 arg is given', () => {
    const fn = (a, b, c) => a + b + c
    const curriedFn = curry3(fn)
    assert.strictEqual(curriedFn(1).length, 2)
  })

  it('should return function of lenght 1 when given 2 args', () => {
    const fn = (a, b, c) => a + b + c
    const curriedFn = curry3(fn)
    const addOneTwo = curriedFn(1, 2)
    assert.strictEqual(addOneTwo.length, 1)
    assert.strictEqual(addOneTwo(3), 6)
  })

  it('should execute function when given 3 args', () => {
    const fn = (a, b, c) => a + b + c
    const curriedFn = curry3(fn)
    assert.strictEqual(typeof curriedFn(1, 2, 3).length, 'undefined')
    assert.strictEqual(curriedFn(1, 2, 3), 6)
  })

  it('should be invariant', () => {
    const f = (x, y, z) => x + y + z
    const a = 1
    const b = 2
    const c = 3

    const bool =
      curry3(f)(a)(b)(c) === 6 &&
      curry3(f)(a, b)(c) === 6 &&
      curry3(f)(a)(b, c) === 6 &&
      curry3(f)(a, b, c) === 6 &&
      f(a, b, c) === 6

    assert.strictEqual(bool, true)
  })
})
