/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha';
import assert from 'assert';

import { id } from '../src/function';

describe('id', () => {
  it('should return its input', () => {
    const x = {};
    assert(id(x) === x);
  });
});
