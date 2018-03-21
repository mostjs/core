/** @license MIT License (c) copyright 2010 original author or authors */

// A slice Bounds type that narrows min values via accumulation
// and max values via Math.min.
// 0 <= min <= max
// slice(min2, max2 slice(min1, max1, s)) ~ slice(min1 + min2, Math.min(max1, max2), s)
// type Bounds = { min: number, max: number }

// smart constructor that enforces bounds constraints
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

// nil bounds excludes all slice indices
export const isNilBounds = b =>
  b.min >= b.max

// infinite bounds excludes no slice indices
export const isInfiniteBounds = b =>
  b.min <= 0 && b.max === Infinity
