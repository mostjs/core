/** @license MIT License (c) copyright 2016 original author or authors */

import {
  append,
  cons,
  copy,
  drop,
  findIndex,
  isArrayLike,
  map,
  reduce,
  remove,
  removeAll,
  replace,
  tail
} from '../src/array'
import { describe, it } from 'mocha'

import assert from 'assert'

const rint = n => (Math.floor(Math.random() * n))
const same = (a, b) => a.length === b.length && _same(a, b, a.length - 1)
const _same = (a, b, i) => i < 0 ? true : a[i] === b[i] && _same(a, b, i - 1)

const assertSame = (a, b) => assert(same(a, b), `${a} != ${b}`)

describe('cons', () => {
  it('should increase length by 1', () => {
    const a = []
    assert(cons(1, a).length === a.length + 1)
    assert(cons(2, cons(1, a)).length === a.length + 2)
  })

  it('should cons value', () => {
    const x = {}
    assert(cons(x, [])[0] === x)
    assert(cons({}, cons(x, []))[1] === x)
  })
})

describe('append', () => {
  it('should add 1 to the length', () => {
    const a = []
    const b = append(1, a)
    const c = append(2, b)
    assert(b.length === a.length + 1)
    assert(c.length === b.length + 1)
  })

  it('should append value', () => {
    const x = {}
    assert(append(x, [])[0] === x)
    assert(append(x, append({}, []))[1] === x)
  })
})

describe('drop', () => {
  it('drop(n, []) === []', () => {
    assertSame(drop(rint(1000), []), [])
  })

  it('drop(0, a) === a', () => {
    const a = [1, 2, 3]
    assert.strictEqual(drop(0, a), a)
  })

  it('drop(n, a) where n < 0 should throw TypeError', () => {
    assert.throws(() => drop(-1, []), TypeError)
  })

  it('drop(n, a) === [], where n >= a.length', () => {
    const a = [1, 2, 3]
    assertSame(drop(a.length + rint(1000), a), [])
  })

  it('drop(n, a) === a.slice(n), where n < a.length', () => {
    const a = [1, 2, 3]
    const n = a.length - rint(a.length)
    const b = drop(n, a)
    assertSame(a.slice(n), b)
  })
})

describe('tail', () => {
  it('tail([]) === []', () => {
    assertSame(tail([]), [])
  })

  it('tail([x]) === []', () => {
    assertSame(tail([1]), [])
  })

  it('tail(a) === a.slice(1)', () => {
    const a = [1, 2, 3]
    assertSame(tail(a), a.slice(1))
  })
})

describe('copy', () => {
  it('copy([]) === []', () => {
    assertSame(copy([]), [])
  })

  it('copy(a) !== a', () => {
    const a = [1, 2, 3]
    assert(copy(a) !== a)
  })

  it('copy(a) == a', () => {
    const a = [1, 2, 3]
    assertSame(copy(a), a)
  })
})

describe('map', () => {
  it('map(f, []) === []', () => {
    assertSame([], map(Math.random, []))
  })

  it('map(x => x, a) === a', () => {
    const a = [1, 2, 3]
    assertSame(a, map(x => x, a))
  })

  it('map(g, map(f, a)) === map(compose(g, f), a)', () => {
    const a = ['a', 'b', 'c']
    const f = x => x + 'f'
    const g = x => x + 'g'
    const h = x => g(f(x))

    assertSame(map(g, map(f, a)), map(h, a))
  })
})

describe('reduce', () => {
  it('reduce(f, x, []) === x', () => {
    const x = {}
    assert.strictEqual(reduce(() => { }, x, []), x)
  })

  it('reduce(append, [], a) === a', () => {
    const a = [1, 2, 3]
    const b = reduce((b, x) => append(x, b), [], a)
    assert(a !== b)
    assertSame(a, b)
  })
})

describe('replace', () => {
  it('replace(x, i, []) === []', () => {
    assertSame(replace(1, rint(100), []), [])
  })

  it('replace(x, i, a) when i < 0 should throw TypeError', () => {
    assert.throws(() => replace(1, -1, []), TypeError)
  })

  it('findIndex(x, replace(x, i, a)) === i', () => {
    const x = {}
    const a = [{}, {}, {}, {}, {}]
    const i = rint(a.length)
    assert.strictEqual(i, findIndex(x, replace(x, i, a)))
  })
})

describe('remove', () => {
  it('remove(i, []) === []', () => {
    assertSame([], remove(rint(100), []))
  })

  it('remove(i, a) === a when i >= a.length', () => {
    const a = [1, 2, 3]
    assertSame(a, remove(a.length, a))
  })

  it('remove(i, a) when i < 0 should throw TypeError', () => {
    assert.throws(() => remove(-1, []), TypeError)
  })

  it('remove(0, [x]) === []', () => {
    assertSame([], remove(0, [{}]))
  })

  it('remove(i, a) === a.splice(i, 1)', () => {
    const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const a = b.slice()
    const i = Math.floor(a.length / 2)

    b.splice(i, 1)
    assertSame(b, remove(i, a))
  })
})

describe('removeAll', () => {
  it('removeAll(f, []) === []', () => {
    assertSame([], removeAll(() => false, []))
  })

  it('removeAll(() => false, a) === a', () => {
    const a = [1, 2, 3]
    assertSame(a, removeAll(() => false, a))
  })

  it('findIndex(x, removeAll(y => y === x, a)) === -1', () => {
    const a = [1, 2, 1, 3, 1, 4, 1, 5, 1]
    assert.strictEqual(-1, findIndex(1, removeAll(x => x === 1, a)))
  })
})

describe('findIndex', () => {
  it('findIndex(x, []) === -1', () => {
    assert.strictEqual(-1, findIndex(1, []))
  })

  it('findIndex(x, [x, x]) === 0', () => {
    const x = {}
    assert.strictEqual(0, findIndex(x, [x]))
  })

  it('findIndex(x, [x, x]) === 0', () => {
    const x = {}
    assert.strictEqual(0, findIndex(x, [x, x]))
  })
})

describe('isArrayLike', () => {
  it('should be true for array-like', () => {
    assert(isArrayLike([]))
    assert(isArrayLike({ length: 0 }))
    assert(isArrayLike(''))
  })

  it('should be false for non-array-like', () => {
    assert(!isArrayLike({}))
    assert(!isArrayLike(null))
    assert(!isArrayLike(undefined))
    assert(!isArrayLike(1))
    assert(!isArrayLike(true))
    assert(!isArrayLike(new Date()))
    assert(!isArrayLike(new RegExp('')))
    assert(!isArrayLike(function () { }))
    assert(!isArrayLike(() => { }))
  })
})
