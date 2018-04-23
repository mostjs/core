/** @license MIT License (c) copyright 2010 original author or authors */

// Based on https://github.com/invertase/denque

export default class Queue {
  constructor () {
    this._head = 0
    this._tail = 0
    this._capacityMask = 0x3
    this._list = new Array(4)
  }

  push (x) {
    const tail = this._tail
    this._list[tail] = x
    this._tail = (tail + 1) & this._capacityMask
    if (this._tail === this._head) {
      this._growArray()
    }

    if (this._head < this._tail) {
      return this._tail - this._head
    } else {
      return this._capacityMask + 1 - (this._head - this._tail)
    }
  }

  shift () {
    const head = this._head
    if (head === this._tail) {
      return undefined
    }

    const x = this._list[head]
    this._list[head] = undefined
    this._head = (head + 1) & this._capacityMask
    if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) {
      this._shrinkArray()
    }

    return x
  }

  isEmpty () {
    return this._head === this._tail
  }

  length () {
    if (this._head === this._tail) {
      return 0
    } else if (this._head < this._tail) {
      return this._tail - this._head
    } else {
      return this._capacityMask + 1 - (this._head - this._tail)
    }
  }

  _growArray () {
    if (this._head) {
      // copy existing data, head to end, then beginning to tail.
      this._list = this._copyArray(true)
      this._head = 0
    }

    // head is at 0 and array is now full, safe to extend
    this._tail = this._list.length

    this._list.length *= 2
    this._capacityMask = (this._capacityMask << 1) | 1
  }

  _shrinkArray () {
    this._list.length >>>= 1
    this._capacityMask >>>= 1
  }

  _copyArray (fullCopy) {
    const newArray = []
    const list = this._list
    const len = list.length

    let i
    if (fullCopy || this._head > this._tail) {
      for (i = this._head; i < len; i++) {
        newArray.push(list[i])
      }
      for (i = 0; i < this._tail; i++) {
        newArray.push(list[i])
      }
    } else {
      for (i = this._head; i < this._tail; i++) {
        newArray.push(list[i])
      }
    }

    return newArray
  }
}
