/** @license MIT License (c) copyright 2010-2017 original author or authors */

// Try to dispose the disposable.  If it throws, send
// the error to sink.error with the provided Time value
export function tryDispose (t, disposable, sink) {
  try {
    disposable.dispose()
  } catch (e) {
    sink.error(t, e)
  }
}
