/** @license MIT License (c) copyright 2010-2017 original author or authors */

export const newStream = run => new Stream(run)

class Stream {
  constructor(run) {
    this.run = run
  }
}
