/** @license MIT License (c) copyright 2018 original author or authors */

// Time bounds
export const timeBounds = (min, max) =>
  ({ min, max })

export const minBounds = min =>
  timeBounds([min], [])

export const maxBounds = max =>
  timeBounds([], [max])

export const mergeTimeBounds = (b1, b2) =>
  timeBounds(b1.min.concat(b2.min), b1.max.concat(b2.max))
