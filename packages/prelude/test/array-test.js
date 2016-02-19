/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha';
import assert from 'assert';

import { cons, append, drop, tail, copy, map, reduce } from '../src/array';

const rint = n => (Math.floor(Math.random() * n));
const same = (a, b) => a.length === b.length && _same(a, b, a.length-1);
const _same = (a, b, i) => i < 0 ? true : a[i] === b[i] && _same(a, b, i-1);

const assertSame = (a, b) => assert(same(a, b), `${a} != ${b}`);

describe('cons', () => {
  it('should increase length by 1', () => {
    const a = [];
    assert(cons(1, a).length === a.length+1);
    assert(cons(2, cons(1, a)).length === a.length+2);
  });

  it('should cons value', () => {
    const x = {};
    assert(cons(x, [])[0] === x);
    assert(cons({}, cons(x, []))[1] === x);
  });
});

describe('append', () => {
  it('should increase length by 1', () => {
    const a = [];
    assert(append(1, a).length === a.length+1);
    assert(append(2, append(1, a)).length === a.length+2);
  });

  it('should append value', () => {
    const x = {};
    assert(append(x, [])[0] === x);
    assert(append(x, append({}, []))[1] === x);
  });
});

describe('drop', () => {
  it('drop(n, []) === []', () => {
    assertSame(drop(rint(1000), []), []);
  });

  it('drop(0, a) === a', () => {
    const a = [1,2,3]
    assert.strictEqual(drop(0, a), a);
  });

  it('drop(n, a) where n < 0 should throw', () => {
    assert.throws(() => drop(-1, []), TypeError);
  });

  it('drop(n, a) === [], where n >= a.length', () => {
    const a = [1,2,3];
    assertSame(drop(a.length + rint(1000), a), []);
  });

  it('drop(n, a) === a.slice(n), where n < a.length', () => {
    const a = [1,2,3];
    const n = a.length - rint(a.length);
    const b = drop(n, a);
    assertSame(a.slice(n), b);
  });
});

describe('tail', () => {
  it('tail([]) === []', () => {
    assertSame(tail([]), []);
  });

  it('tail([x]) === []', () => {
    assertSame(tail([1]), []);
  });

  it('tail(a) === a.slice(1)', () => {
    const a = [1,2,3];
    assertSame(tail(a), a.slice(1));
  });
});

describe('copy', () => {
  it('copy([]) === []', () => {
    assertSame(copy([]), []);
  });

  it('copy(a) !== a', () => {
    const a = [1,2,3];
    assert(copy(a) !== a);
  });

  it('copy(a) == a', () => {
    const a = [1,2,3];
    assertSame(copy(a), a);
  });
});

describe('map', () => {
  it('map(f, []) === []', () => {
    assertSame([], map(Math.random, []));
  });

  it('map(x => x, a) === a', () => {
    const a = [1,2,3];
    assertSame(a, map(x => x, a));
  });

  it('map(g, map(f, a)) === map(compose(g, f), a)', () => {
    const a = ['a', 'b', 'c'];
    const f = x => x+'f';
    const g = x => x+'g';
    const h = x => g(f(x));

    assertSame(map(g, map(f, a)), map(h, a));
  });
});

describe('reduce', () => {
  it('reduce(f, x, []) === x', () => {
    const x = {};
    assert.strictEqual(reduce(() => {}, x, []), x);
  });

  it('reduce(append, [], a) === a', () => {
    const a = [1,2,3];
    const b = reduce((b, x) => append(x, b), [], a);
    assert(a !== b);
    assertSame(a, b);
  });
});
