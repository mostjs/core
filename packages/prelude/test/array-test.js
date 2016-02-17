/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha';
import assert from 'assert';

import { cons } from '../src/array';

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
