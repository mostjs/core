import { spec, expect } from 'buster'
const { describe, it } = spec

import { default as Disposable } from '../../src/disposable/Disposable'

describe('Disposable', function () {
  it('should call disposer with data', function () {
    var spy = this.spy(function (x) {
      return x
    })
    var data = {}

    var d = new Disposable(spy, data)

    expect(d.dispose()).toBe(data)
    expect(spy).toHaveBeenCalledOnceWith(data)
  })
})
