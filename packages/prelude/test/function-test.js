/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha'
import assert from 'assert'

import { id, compose, apply, curry2, curry3, curry4 } from '../src/function'

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

  it('should be invariant', () => {
    const f = (x, y) => '' + x + y
    const a = 1
    const b = 2

    const expected = f(a, b)

    assert.strictEqual(expected, curry2(f)(a)(b))
    assert.strictEqual(expected, curry2(f)(a, b))
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

  it('should return function of length 1 when given 2 args', () => {
    const fn = (a, b, c) => a + b + c
    const curriedFn = curry3(fn)
    const addOneTwo = curriedFn(1, 2)
    assert.strictEqual(addOneTwo.length, 1)
  })

  it('should be invariant', () => {
    const f = (x, y, z) => '' + x + y + z
    const a = 1
    const b = 2
    const c = 3

    const expected = f(a, b, c)

    assert.strictEqual(expected, curry3(f)(a)(b)(c))
    assert.strictEqual(expected, curry3(f)(a, b)(c))
    assert.strictEqual(expected, curry3(f)(a)(b, c))
    assert.strictEqual(expected, curry3(f)(a, b, c))
  })
})

describe('curry4', () => {
  it('should return the original function if no args are given', () => {
    const fn = (a, b, c, d) => a + b + c + d
    const curriedFn = curry4(fn)
    assert.strictEqual(curriedFn().length, 4)
  })

  it('should return a function of length 3 when 1 arg is given', () => {
    const fn = (a, b, c, d) => a + b + c + d
    const curriedFn = curry4(fn)
    assert.strictEqual(curriedFn(1).length, 3)
  })

  it('should return function of length 2 when given 2 args', () => {
    const fn = (a, b, c, d) => a + b + c + d
    const curriedFn = curry4(fn)
    assert.strictEqual(curriedFn(1, 2).length, 2)
  })

  it('should return function of length 1 when given 3 args', () => {
    const fn = (a, b, c, d) => a + b + c + d
    const curriedFn = curry4(fn)
    assert.strictEqual(curriedFn(1, 2, 3).length, 1)
  })

  it('should be invariant', () => {
    const f = (w, x, y, z) => '' + w + x + y + z
    const a = 1
    const b = 2
    const c = 3
    const d = 4

    const expected = f(a, b, c, d)

    assert.strictEqual(expected, curry4(f)(a)(b)(c)(d))
    assert.strictEqual(expected, curry4(f)(a, b)(c)(d))
    assert.strictEqual(expected, curry4(f)(a)(b, c)(d))
    assert.strictEqual(expected, curry4(f)(a)(b)(c, d))
    assert.strictEqual(expected, curry4(f)(a, b)(c, d))
    assert.strictEqual(expected, curry4(f)(a, b, c)(d))
    assert.strictEqual(expected, curry4(f)(a)(b, c, d))
    assert.strictEqual(expected, curry4(f)(a, b, c, d))
  })
})
