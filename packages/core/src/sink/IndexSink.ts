/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from './Pipe'
import { Time, Sink } from '@most/types'

export interface IndexedValue<A> {
  readonly index: number
  readonly value: A
  readonly active: boolean
}

export class IndexSink<A> extends Pipe<A, Readonly<IndexedValue<A | undefined>>> implements Sink<A> {
  readonly index: number
  active: boolean
  value: A | undefined

  constructor (i: number, sink: Sink<Readonly<IndexedValue<A | undefined>>>) {
    super(sink)
    this.index = i
    this.active = true
    this.value = undefined
  }

  event (t: Time, x: A): void {
    if (!this.active) {
      return
    }
    this.value = x
    this.sink.event(t, this)
  }

  end (t: Time): void {
    if (!this.active) {
      return
    }
    this.active = false
    this.sink.event(t, this)
  }
}
