/** @license MIT License (c) copyright 2010 original author or authors */

export const newBounds = (unsafeMin, unsafeMax) => {
  const min = Math.max(0, unsafeMin)
  const max = Math.max(min, unsafeMax)
  return { min, max }
}

export const minBounds = min =>
  newBounds(min, Infinity)

export const maxBounds = max =>
  newBounds(0, max)

// Combine 2 bounds by narrowing min and max
export const mergeBounds = (b1, b2) =>
  newBounds(b1.min + b2.min, Math.min(b1.max, b2.max))

export const isNilBounds = b =>
  b.min >= b.max

export const isInfiniteBounds = b =>
  b.min <= 0 && b.max === Infinity
