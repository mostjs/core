/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha';
import assert from 'assert';

import { id, compose, apply } from '../src/function';

describe('id', () => {
  it('id(x) === x', () => {
    const x = {};
    assert.strictEqual(id(x), x);
  });
});

describe('compose', () => {
  it('compose(f, g)(x) === f(g(x))', () => {
    const fx = '' + Math.random();
    const gx = '' + Math.random();
    const x = '' + Math.random();

    const f = x => x + fx;
    const g = x => x + gx;
    const h = compose(f, g);

    assert.strictEqual(f(g(x)), h(x));
  });
});

describe('apply', () => {
  it('apply(f, x) === f(x)', () => {
    const x = Math.random();
    const f = x => x+1;
    assert.strictEqual(apply(f, x), f(x));
  });
});
