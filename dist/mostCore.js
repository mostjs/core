(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.mostCore = global.mostCore || {})));
}(this, (function (exports) { 'use strict';

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

// cons :: a -> [a] -> [a]
// a with x prepended


// append :: a -> [a] -> [a]
// a with x appended


// drop :: Int -> [a] -> [a]
// drop first n elements
function drop (n, a) { // eslint-disable-line complexity
  if (n < 0) {
    throw new TypeError('n must be >= 0')
  }

  var l = a.length;
  if (n === 0 || l === 0) {
    return a
  }

  if (n >= l) {
    return []
  }

  return unsafeDrop(n, a, l - n)
}

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop (n, a, l) {
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[n + i];
  }
  return b
}

// tail :: [a] -> [a]
// drop head element
function tail (a) {
  return drop(1, a)
}

// copy :: [a] -> [a]
// duplicate a (shallow duplication)
function copy (a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[i];
  }
  return b
}

// map :: (a -> b) -> [a] -> [b]
// transform each element with f
function map$1 (f, a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = f(a[i]);
  }
  return b
}

// reduce :: (a -> b -> a) -> a -> [b] -> a
// accumulate via left-fold
function reduce$1 (f, z, a) {
  var r = z;
  for (var i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i);
  }
  return r
}

// replace :: a -> Int -> [a]
// replace element at index


// remove :: Int -> [a] -> [a]
// remove element at index


// removeAll :: (a -> boolean) -> [a] -> [a]
// remove all elements matching a predicate
function removeAll (f, a) {
  var l = a.length;
  var b = new Array(l);
  var j = 0;
  for (var x = (void 0), i = 0; i < l; ++i) {
    x = a[i];
    if (!f(x)) {
      b[j] = x;
      ++j;
    }
  }

  b.length = j;
  return b
}

// findIndex :: a -> [a] -> Int
// find index of x in a, from the left
function findIndex (x, a) {
  for (var i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i
    }
  }
  return -1
}

// isArrayLike :: * -> boolean
// Return true iff x is array-like
function isArrayLike (x) {
  return x != null && typeof x.length === 'number' && typeof x !== 'function'
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// id :: a -> a
var id = function (x) { return x; };

// compose :: (b -> c) -> (a -> b) -> (a -> c)
var compose = function (f, g) { return function (x) { return f(g(x)); }; };

// apply :: (a -> b) -> a -> b
var apply = function (f, x) { return f(x); };

// curry2 :: ((a, b) -> c) -> (a -> b -> c)
function curry2 (f) {
  function curried (a, b) {
    switch (arguments.length) {
      case 0: return curried
      case 1: return function (b) { return f(a, b); }
      default: return f(a, b)
    }
  }
  return curried
}

// curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
function curry3 (f) {
  function curried (a, b, c) { // eslint-disable-line complexity
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry2(function (b, c) { return f(a, b, c); })
      case 2: return function (c) { return f(a, b, c); }
      default:return f(a, b, c)
    }
  }
  return curried
}

/** @license MIT License (c) copyright 2016 original author or authors */

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Stream (source) {
  this.source = source;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a new Disposable which will dispose its underlying resource.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @constructor
 */
function Disposable (dispose, data) {
  this._dispose = dispose;
  this._data = data;
}

Disposable.prototype.dispose = function () {
  return this._dispose(this._data)
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SettableDisposable () {
  this.disposable = void 0;
  this.disposed = false;
  this._resolve = void 0;

  var self = this;
  this.result = new Promise(function (resolve) {
    self._resolve = resolve;
  });
}

SettableDisposable.prototype.setDisposable = function (disposable) {
  if (this.disposable !== void 0) {
    throw new Error('setDisposable called more than once')
  }

  this.disposable = disposable;

  if (this.disposed) {
    this._resolve(disposable.dispose());
  }
};

SettableDisposable.prototype.dispose = function () {
  if (this.disposed) {
    return this.result
  }

  this.disposed = true;

  if (this.disposable !== void 0) {
    this.result = this.disposable.dispose();
  }

  return this.result
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function isPromise (p) {
  return p !== null && typeof p === 'object' && typeof p.then === 'function'
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
var map$2 = map$1;
var identity = id;

/**
 * Call disposable.dispose.  If it returns a promise, catch promise
 * error and forward it through the provided sink.
 * @param {number} t time
 * @param {{dispose: function}} disposable
 * @param {{error: function}} sink
 * @return {*} result of disposable.dispose
 */
function tryDispose (t, disposable, sink) {
  var result = disposeSafely(disposable);
  return isPromise(result)
    ? result.catch(function (e) {
      sink.error(t, e);
    })
    : result
}

/**
 * Create a new Disposable which will dispose its underlying resource
 * at most once.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @return {Disposable}
 */
function create (dispose, data) {
  return once(new Disposable(dispose, data))
}

/**
 * Create a noop disposable. Can be used to satisfy a Disposable
 * requirement when no actual resource needs to be disposed.
 * @return {Disposable|exports|module.exports}
 */
function empty$1 () {
  return new Disposable(identity, void 0)
}

/**
 * Create a disposable that will dispose all input disposables in parallel.
 * @param {Array<Disposable>} disposables
 * @return {Disposable}
 */
function all (disposables) {
  return create(disposeAll, disposables)
}

function disposeAll (disposables) {
  return Promise.all(map$2(disposeSafely, disposables))
}

function disposeSafely (disposable) {
  try {
    return disposable.dispose()
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Create a disposable from a promise for another disposable
 * @param {Promise<Disposable>} disposablePromise
 * @return {Disposable}
 */


/**
 * Create a disposable proxy that allows its underlying disposable to
 * be set later.
 * @return {SettableDisposable}
 */
function settable () {
  return new SettableDisposable()
}

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 * @param {{ dispose: function() }} disposable
 * @return {Disposable} wrapped disposable
 */
function once (disposable) {
  return new Disposable(disposeMemoized, memoized(disposable))
}

function disposeMemoized (memoized) {
  if (!memoized.disposed) {
    memoized.disposed = true;
    memoized.value = disposeSafely(memoized.disposable);
    memoized.disposable = void 0;
  }

  return memoized.value
}

function memoized (disposable) {
  return { disposed: false, disposable: disposable, value: void 0 }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fatalError (e) {
  setTimeout(function () {
    throw e
  }, 0);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function PropagateTask (run, value, sink) {
  this._run = run;
  this.value = value;
  this.sink = sink;
  this.active = true;
}

PropagateTask.event = function (value, sink) {
  return new PropagateTask(emit, value, sink)
};

PropagateTask.end = function (value, sink) {
  return new PropagateTask(end, value, sink)
};

PropagateTask.error = function (value, sink) {
  return new PropagateTask(error, value, sink)
};

PropagateTask.prototype.dispose = function () {
  this.active = false;
};

PropagateTask.prototype.run = function (t) {
  if (!this.active) {
    return
  }
  this._run(t, this.value, this.sink);
};

PropagateTask.prototype.error = function (t, e) {
  if (!this.active) {
    return fatalError(e)
  }
  this.sink.error(t, e);
};

function error (t, e, sink) {
  sink.error(t, e);
}

function emit (t, x, sink) {
  sink.event(t, x);
}

function end (t, x, sink) {
  sink.end(t, x);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Stream containing only x
 * @param {*} x
 * @returns {Stream}
 */
function of (x) {
  return new Stream(new Just(x))
}

function Just (x) {
  this.value = x;
}

Just.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runJust, this.value, sink))
};

function runJust (t, x, sink) {
  sink.event(t, x);
  sink.end(t, void 0);
}

/**
 * Stream containing no events and ends immediately
 * @returns {Stream}
 */
function empty$$1 () {
  return EMPTY
}

function EmptySource () {}

EmptySource.prototype.run = function (sink, scheduler) {
  var task = PropagateTask.end(void 0, sink);
  scheduler.asap(task);

  return create(disposeEmpty, task)
};

function disposeEmpty (task) {
  return task.dispose()
}

var EMPTY = new Stream(new EmptySource());

/**
 * Stream containing no events and never ends
 * @returns {Stream}
 */
function never () {
  return NEVER
}

function NeverSource () {}

NeverSource.prototype.run = function () {
  return empty$1()
};

var NEVER = new Stream(new NeverSource());

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fromArray (a) {
  return new Stream(new ArraySource(a))
}

function ArraySource (a) {
  this.array = a;
}

ArraySource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runProducer, this.array, sink))
};

function runProducer (t, array, sink) {
  for (var i = 0, l = array.length; i < l && this.active; ++i) {
    sink.event(t, array[i]);
  }

  this.active && end(t);

  function end (t) {
    sink.end(t);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global Set, Symbol*/
var iteratorSymbol;
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
if (typeof Set === 'function' && typeof new Set()['@@iterator'] === 'function') {
  iteratorSymbol = '@@iterator';
} else {
  iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator ||
  '_es6shim_iterator_';
}

function isIterable (o) {
  return typeof o[iteratorSymbol] === 'function'
}

function getIterator (o) {
  return o[iteratorSymbol]()
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fromIterable (iterable) {
  return new Stream(new IterableSource(iterable))
}

function IterableSource (iterable) {
  this.iterable = iterable;
}

IterableSource.prototype.run = function (sink, scheduler) {
  return new IteratorProducer(getIterator(this.iterable), sink, scheduler)
};

function IteratorProducer (iterator, sink, scheduler) {
  this.scheduler = scheduler;
  this.iterator = iterator;
  this.task = new PropagateTask(runProducer$1, this, sink);
  scheduler.asap(this.task);
}

IteratorProducer.prototype.dispose = function () {
  return this.task.dispose()
};

function runProducer$1 (t, producer, sink) {
  var x = producer.iterator.next();
  if (x.done) {
    sink.end(t, x.value);
  } else {
    sink.event(t, x.value);
  }

  producer.scheduler.asap(producer.task);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function coerce (a) { // eslint-disable-line complexity
  if (a instanceof Stream) {
    return a
  }

  if (Array.isArray(a) || isArrayLike(a)) {
    return fromArray(a)
  }

  if (isIterable(a)) {
    return fromIterable(a)
  }

  throw new TypeError('from(x) must be observable, iterable, or array-like: ' + a)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream of events that occur at a regular period
 * @param {Number} period periodicity of events in millis
 * @returns {Stream} new stream of periodic events, the event value is undefined
 */
function periodic (period) {
  return new Stream(new Periodic(period))
}

var Periodic = function Periodic (period) {
  this.period = period;
};

Periodic.prototype.run = function run (sink, scheduler) {
  return scheduler.periodic(this.period, PropagateTask.event(undefined, sink))
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function EventTargetSource (event, source, capture) {
  this.event = event;
  this.source = source;
  this.capture = capture;
}

EventTargetSource.prototype.run = function (sink, scheduler) {
  function addEvent (e) {
    tryEvent(scheduler.now(), e, sink);
  }

  this.source.addEventListener(this.event, addEvent, this.capture);

  return create(disposeEventTarget,
    { target: this, addEvent: addEvent })
};

function disposeEventTarget (info) {
  var target = info.target;
  target.source.removeEventListener(target.event, info.addEvent, target.capture);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function defer (task) {
  return Promise.resolve(task).then(runTask)
}

function runTask (task) {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function DeferredSink (sink) {
  this.sink = sink;
  this.events = [];
  this.active = true;
}

DeferredSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  if (this.events.length === 0) {
    defer(new PropagateAllTask(this.sink, t, this.events));
  }

  this.events.push({ time: t, value: x });
};

DeferredSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  this._end(new EndTask(t, x, this.sink));
};

DeferredSink.prototype.error = function (t, e) {
  this._end(new ErrorTask(t, e, this.sink));
};

DeferredSink.prototype._end = function (task) {
  this.active = false;
  defer(task);
};

function PropagateAllTask (sink, time, events) {
  this.sink = sink;
  this.events = events;
  this.time = time;
}

PropagateAllTask.prototype.run = function () {
  var this$1 = this;

  var events = this.events;
  var sink = this.sink;
  var event;

  for (var i = 0, l = events.length; i < l; ++i) {
    event = events[i];
    this$1.time = event.time;
    sink.event(event.time, event.value);
  }

  events.length = 0;
};

PropagateAllTask.prototype.error = function (e) {
  this.sink.error(this.time, e);
};

function EndTask (t, x, sink) {
  this.time = t;
  this.value = x;
  this.sink = sink;
}

EndTask.prototype.run = function () {
  this.sink.end(this.time, this.value);
};

EndTask.prototype.error = function (e) {
  this.sink.error(this.time, e);
};

function ErrorTask (t, e, sink) {
  this.time = t;
  this.value = e;
  this.sink = sink;
}

ErrorTask.prototype.run = function () {
  this.sink.error(this.time, this.value);
};

ErrorTask.prototype.error = function (e) {
  throw e
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function EventEmitterSource (event, source) {
  this.event = event;
  this.source = source;
}

EventEmitterSource.prototype.run = function (sink, scheduler) {
  // NOTE: Because EventEmitter allows events in the same call stack as
  // a listener is added, use a DeferredSink to buffer events
  // until the stack clears, then propagate.  This maintains most.js's
  // invariant that no event will be delivered in the same call stack
  // as an observer begins observing.
  var dsink = new DeferredSink(sink);

  function addEventVariadic (a) {
    var arguments$1 = arguments;

    var l = arguments.length;
    if (l > 1) {
      var arr = new Array(l);
      for (var i = 0; i < l; ++i) {
        arr[i] = arguments$1[i];
      }
      tryEvent(scheduler.now(), arr, dsink);
    } else {
      tryEvent(scheduler.now(), a, dsink);
    }
  }

  this.source.addListener(this.event, addEventVariadic);

  return create(disposeEventEmitter, { target: this, addEvent: addEventVariadic })
};

function disposeEventEmitter (info) {
  var target = info.target;
  target.source.removeListener(target.event, info.addEvent);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream from an EventTarget, such as a DOM Node, or EventEmitter.
 * @param {String} event event type name, e.g. 'click'
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter
 * @param {*?} capture for DOM events, whether to use
 *  capturing--passed as 3rd parameter to addEventListener.
 * @returns {Stream} stream containing all events of the specified type
 * from the source.
 */
function fromEvent$1 (event, source, capture) { // eslint-disable-line complexity
  var s;

  if (typeof source.addEventListener === 'function' && typeof source.removeEventListener === 'function') {
    if (arguments.length < 3) {
      capture = false;
    }

    s = new EventTargetSource(event, source, capture);
  } else if (typeof source.addListener === 'function' && typeof source.removeListener === 'function') {
    s = new EventEmitterSource(event, source);
  } else {
    throw new Error('source must support addEventListener/removeEventListener or addListener/removeListener')
  }

  return new Stream(s)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function ScheduledTask (delay, period, task, scheduler) {
  this.time = delay;
  this.period = period;
  this.task = task;
  this.scheduler = scheduler;
  this.active = true;
}

ScheduledTask.prototype.run = function () {
  return this.task.run(this.time)
};

ScheduledTask.prototype.error = function (e) {
  return this.task.error(this.time, e)
};

ScheduledTask.prototype.dispose = function () {
  this.scheduler.cancel(this);
  return this.task.dispose()
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Scheduler (timer, timeline) {
  this.timer = timer;
  this.timeline = timeline;

  this._timer = null;
  this._nextArrival = Infinity;

  var self = this;
  this._runReadyTasksBound = function () {
    self._runReadyTasks(self.now());
  };
}

Scheduler.prototype.now = function () {
  return this.timer.now()
};

Scheduler.prototype.asap = function (task) {
  return this.schedule(0, -1, task)
};

Scheduler.prototype.delay = function (delay, task) {
  return this.schedule(delay, -1, task)
};

Scheduler.prototype.periodic = function (period, task) {
  return this.schedule(0, period, task)
};

Scheduler.prototype.schedule = function (delay, period, task) {
  var now = this.now();
  var st = new ScheduledTask(now + Math.max(0, delay), period, task, this);

  this.timeline.add(st);
  this._scheduleNextRun(now);
  return st
};

Scheduler.prototype.cancel = function (task) {
  task.active = false;
  if (this.timeline.remove(task)) {
    this._reschedule();
  }
};

Scheduler.prototype.cancelAll = function (f) {
  this.timeline.removeAll(f);
  this._reschedule();
};

Scheduler.prototype._reschedule = function () {
  if (this.timeline.isEmpty()) {
    this._unschedule();
  } else {
    this._scheduleNextRun(this.now());
  }
};

Scheduler.prototype._unschedule = function () {
  this.timer.clearTimer(this._timer);
  this._timer = null;
};

Scheduler.prototype._scheduleNextRun = function (now) { // eslint-disable-line complexity
  if (this.timeline.isEmpty()) {
    return
  }

  var nextArrival = this.timeline.nextArrival();

  if (this._timer === null) {
    this._scheduleNextArrival(nextArrival, now);
  } else if (nextArrival < this._nextArrival) {
    this._unschedule();
    this._scheduleNextArrival(nextArrival, now);
  }
};

Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
  this._nextArrival = nextArrival;
  var delay = Math.max(0, nextArrival - now);
  this._timer = this.timer.setTimer(this._runReadyTasksBound, delay);
};

Scheduler.prototype._runReadyTasks = function (now) {
  this._timer = null;
  this.timeline.runTasks(now, runTask);
  this._scheduleNextRun(this.now());
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global setTimeout, clearTimeout*/

function ClockTimer () {}

ClockTimer.prototype.now = Date.now;

ClockTimer.prototype.setTimer = function (f, dt) {
  return dt <= 0 ? runAsap(f) : setTimeout(f, dt)
};

ClockTimer.prototype.clearTimer = function (t) {
  return t instanceof Asap ? t.cancel() : clearTimeout(t)
};

function Asap (f) {
  this.f = f;
  this.active = true;
}

Asap.prototype.run = function () {
  return this.active && this.f()
};

Asap.prototype.error = function (e) {
  throw e
};

Asap.prototype.cancel = function () {
  this.active = false;
};

function runAsap (f) {
  var task = new Asap(f);
  defer(task);
  return task
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Timeline () {
  this.tasks = [];
}

Timeline.prototype.nextArrival = function () {
  return this.isEmpty() ? Infinity : this.tasks[0].time
};

Timeline.prototype.isEmpty = function () {
  return this.tasks.length === 0
};

Timeline.prototype.add = function (st) {
  insertByTime(st, this.tasks);
};

Timeline.prototype.remove = function (st) {
  var i = binarySearch(st.time, this.tasks);

  if (i >= 0 && i < this.tasks.length) {
    var at = findIndex(st, this.tasks[i].events);
    if (at >= 0) {
      this.tasks[i].events.splice(at, 1);
      return true
    }
  }

  return false
};

Timeline.prototype.removeAll = function (f) {
  var this$1 = this;

  for (var i = 0, l = this.tasks.length; i < l; ++i) {
    removeAllFrom(f, this$1.tasks[i]);
  }
};

Timeline.prototype.runTasks = function (t, runTask) {
  var this$1 = this;

  var tasks = this.tasks;
  var l = tasks.length;
  var i = 0;

  while (i < l && tasks[i].time <= t) {
    ++i;
  }

  this.tasks = tasks.slice(i);

  // Run all ready tasks
  for (var j = 0; j < i; ++j) {
    this$1.tasks = runTasks(runTask, tasks[j], this$1.tasks);
  }
};

function runTasks (runTask, timeslot, tasks) { // eslint-disable-line complexity
  var events = timeslot.events;
  for (var i = 0; i < events.length; ++i) {
    var task = events[i];

    if (task.active) {
      runTask(task);

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period;
        insertByTime(task, tasks);
      }
    }
  }

  return tasks
}

function insertByTime (task, timeslots) { // eslint-disable-line complexity
  var l = timeslots.length;

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]));
    return
  }

  var i = binarySearch(task.time, timeslots);

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]));
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task);
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]));
  }
}

function removeAllFrom (f, timeslot) {
  timeslot.events = removeAll(f, timeslot.events);
}

function binarySearch (t, sortedArray) { // eslint-disable-line complexity
  var lo = 0;
  var hi = sortedArray.length;
  var mid, y;

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    y = sortedArray[mid];

    if (t === y.time) {
      return mid
    } else if (t < y.time) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return hi
}

function newTimeslot (t, events) {
  return { time: t, events: events }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var defaultScheduler = new Scheduler(new ClockTimer(), new Timeline());

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function withDefaultScheduler (source) {
  return withScheduler(source, defaultScheduler)
}

function withScheduler (source, scheduler) {
  return new Promise(function (resolve, reject) {
    runSource(source, scheduler, resolve, reject);
  })
}

function runSource (source, scheduler, resolve, reject) {
  var disposable = settable();
  var observer = new Drain(resolve, reject, disposable);

  disposable.setDisposable(source.run(observer, scheduler));
}

function Drain (end, error, disposable) {
  this._end = end;
  this._error = error;
  this._disposable = disposable;
  this.active = true;
}

Drain.prototype.event = function (t, x) {};

Drain.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false;
  disposeThen(this._end, this._error, this._disposable, x);
};

Drain.prototype.error = function (t, e) {
  this.active = false;
  disposeThen(this._error, this._error, this._disposable, e);
};

function disposeThen (end, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    end(x);
  }, error);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * A sink mixin that simply forwards event, end, and error to
 * another sink.
 * @param sink
 * @constructor
 */
function Pipe (sink) {
  this.sink = sink;
}

Pipe.prototype.event = function (t, x) {
  return this.sink.event(t, x)
};

Pipe.prototype.end = function (t, x) {
  return this.sink.end(t, x)
};

Pipe.prototype.error = function (t, e) {
  return this.sink.error(t, e)
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Filter (p, source) {
  this.p = p;
  this.source = source;
}

/**
 * Create a filtered source, fusing adjacent filter.filter if possible
 * @param {function(x:*):boolean} p filtering predicate
 * @param {{run:function}} source source to filter
 * @returns {Filter} filtered source
 */
Filter.create = function createFilter (p, source) {
  if (source instanceof Filter) {
    return new Filter(and(source.p, p), source.source)
  }

  return new Filter(p, source)
};

Filter.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterSink(this.p, sink), scheduler)
};

function FilterSink (p, sink) {
  this.p = p;
  this.sink = sink;
}

FilterSink.prototype.end = Pipe.prototype.end;
FilterSink.prototype.error = Pipe.prototype.error;

FilterSink.prototype.event = function (t, x) {
  var p = this.p;
  p(x) && this.sink.event(t, x);
};

function and (p, q) {
  return function (x) {
    return p(x) && q(x)
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function FilterMap (p, f, source) {
  this.p = p;
  this.f = f;
  this.source = source;
}

FilterMap.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler)
};

function FilterMapSink (p, f, sink) {
  this.p = p;
  this.f = f;
  this.sink = sink;
}

FilterMapSink.prototype.event = function (t, x) {
  var f = this.f;
  var p = this.p;
  p(x) && this.sink.event(t, f(x));
};

FilterMapSink.prototype.end = Pipe.prototype.end;
FilterMapSink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Map (f, source) {
  this.f = f;
  this.source = source;
}

/**
 * Create a mapped source, fusing adjacent map.map, filter.map,
 * and filter.map.map if possible
 * @param {function(*):*} f mapping function
 * @param {{run:function}} source source to map
 * @returns {Map|FilterMap} mapped source, possibly fused
 */
Map.create = function createMap (f, source) {
  if (source instanceof Map) {
    return new Map(compose(f, source.f), source.source)
  }

  if (source instanceof Filter) {
    return new FilterMap(source.p, f, source.source)
  }

  return new Map(f, source)
};

Map.prototype.run = function (sink, scheduler) { // eslint-disable-line no-extend-native
  return this.source.run(new MapSink(this.f, sink), scheduler)
};

function MapSink (f, sink) {
  this.f = f;
  this.sink = sink;
}

MapSink.prototype.end = Pipe.prototype.end;
MapSink.prototype.error = Pipe.prototype.error;

MapSink.prototype.event = function (t, x) {
  var f = this.f;
  this.sink.event(t, f(x));
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
function map$3 (f, stream) {
  return new Stream(Map.create(f, stream.source))
}

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
function constant$1 (x, stream) {
  return map$3(function () {
    return x
  }, stream)
}

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
function tap$1 (f, stream) {
  return new Stream(new Tap(f, stream.source))
}

function Tap (f, source) {
  this.source = source;
  this.f = f;
}

Tap.prototype.run = function (sink, scheduler) {
  return this.source.run(new TapSink(this.f, sink), scheduler)
};

function TapSink (f, sink) {
  this.sink = sink;
  this.f = f;
}

TapSink.prototype.end = Pipe.prototype.end;
TapSink.prototype.error = Pipe.prototype.error;

TapSink.prototype.event = function (t, x) {
  var f = this.f;
  f(x);
  this.sink.event(t, x);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param {function(x:T):*} f function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function observe$1 (f, stream) {
  return drain(tap$1(f, stream))
}

/**
 * "Run" a stream by creating demand and consuming all events
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function drain (stream) {
  return withDefaultScheduler(stream.source)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @param {Stream} stream event stream
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
function loop$1 (stepper, seed, stream) {
  return new Stream(new Loop(stepper, seed, stream.source))
}

function Loop (stepper, seed, source) {
  this.step = stepper;
  this.seed = seed;
  this.source = source;
}

Loop.prototype.run = function (sink, scheduler) {
  return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler)
};

function LoopSink (stepper, seed, sink) {
  this.step = stepper;
  this.seed = seed;
  this.sink = sink;
}

LoopSink.prototype.error = Pipe.prototype.error;

LoopSink.prototype.event = function (t, x) {
  var result = this.step(this.seed, x);
  this.seed = result.seed;
  this.sink.event(t, result.value);
};

LoopSink.prototype.end = function (t) {
  this.sink.end(t, this.seed);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
function scan$1 (f, initial, stream) {
  return new Stream(new Scan(f, initial, stream.source))
}

function Scan (f, z, source) {
  this.source = source;
  this.f = f;
  this.value = z;
}

Scan.prototype.run = function (sink, scheduler) {
  var d1 = scheduler.asap(PropagateTask.event(this.value, sink));
  var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler);
  return all([d1, d2])
};

function ScanSink (f, z, sink) {
  this.f = f;
  this.value = z;
  this.sink = sink;
}

ScanSink.prototype.event = function (t, x) {
  var f = this.f;
  this.value = f(this.value, x);
  this.sink.event(t, this.value);
};

ScanSink.prototype.error = Pipe.prototype.error;
ScanSink.prototype.end = Pipe.prototype.end;

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the file result of the reduce
*/
function reduce$2 (f, initial, stream) {
  return withDefaultScheduler(new Reduce(f, initial, stream.source))
}

function Reduce (f, z, source) {
  this.source = source;
  this.f = f;
  this.value = z;
}

Reduce.prototype.run = function (sink, scheduler) {
  return this.source.run(new ReduceSink(this.f, this.value, sink), scheduler)
};

function ReduceSink (f, z, sink) {
  this.f = f;
  this.value = z;
  this.sink = sink;
}

ReduceSink.prototype.event = function (t, x) {
  var f = this.f;
  this.value = f(this.value, x);
  this.sink.event(t, this.value);
};

ReduceSink.prototype.error = Pipe.prototype.error;

ReduceSink.prototype.end = function (t) {
  this.sink.end(t, this.value);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by unfolding tuples of future values from a seed value
 * Event times may be controlled by returning a Promise from f
 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
 *  If tuple.done is true, the stream will end.
 * @param {*} seed seed value
 * @returns {Stream} stream containing all value of all tuples produced by the
 *  unfolding function.
 */
function unfold$1 (f, seed) {
  return new Stream(new UnfoldSource(f, seed))
}

function UnfoldSource (f, seed) {
  this.f = f;
  this.value = seed;
}

UnfoldSource.prototype.run = function (sink, scheduler) {
  return new Unfold(this.f, this.value, sink, scheduler)
};

function Unfold (f, x, sink, scheduler) {
  this.f = f;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;

  var self = this;
  function err (e) {
    self.sink.error(self.scheduler.now(), e);
  }

  function start (unfold) {
    return stepUnfold(unfold, x)
  }

  Promise.resolve(this).then(start).catch(err);
}

Unfold.prototype.dispose = function () {
  this.active = false;
};

function stepUnfold (unfold, x) {
  var f = unfold.f;
  return Promise.resolve(f(x)).then(function (tuple) {
    return continueUnfold(unfold, tuple)
  })
}

function continueUnfold (unfold, tuple) {
  if (tuple.done) {
    unfold.sink.end(unfold.scheduler.now(), tuple.value);
    return tuple.value
  }

  unfold.sink.event(unfold.scheduler.now(), tuple.value);

  if (!unfold.active) {
    return tuple.value
  }
  return stepUnfold(unfold, tuple.seed)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by iteratively calling f to produce values
 * Event times may be controlled by returning a Promise from f
 * @param {function(x:*):*|Promise<*>} f
 * @param {*} x initial value
 * @returns {Stream}
 */
function iterate$1 (f, x) {
  return new Stream(new IterateSource(f, x))
}

function IterateSource (f, x) {
  this.f = f;
  this.value = x;
}

IterateSource.prototype.run = function (sink, scheduler) {
  return new Iterate(this.f, this.value, sink, scheduler)
};

function Iterate (f, initial, sink, scheduler) {
  this.f = f;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;

  var x = initial;

  var self = this;
  function err (e) {
    self.sink.error(self.scheduler.now(), e);
  }

  function start (iterate) {
    return stepIterate(iterate, x)
  }

  Promise.resolve(this).then(start).catch(err);
}

Iterate.prototype.dispose = function () {
  this.active = false;
};

function stepIterate (iterate, x) {
  iterate.sink.event(iterate.scheduler.now(), x);

  if (!iterate.active) {
    return x
  }

  var f = iterate.f;
  return Promise.resolve(f(x)).then(function (y) {
    return continueIterate(iterate, y)
  })
}

function continueIterate (iterate, x) {
  return !iterate.active ? iterate.value : stepIterate(iterate, x)
}

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream using an *async* generator, which yields promises
 * to control event times.
 * @param f
 * @returns {Stream}
 */
function generate (f /*, ...args */) {
  return new Stream(new GenerateSource(f, tail(arguments)))
}

function GenerateSource (f, args) {
  this.f = f;
  this.args = args;
}

GenerateSource.prototype.run = function (sink, scheduler) {
  return new Generate(this.f.apply(void 0, this.args), sink, scheduler)
};

function Generate (iterator, sink, scheduler) {
  this.iterator = iterator;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;

  var self = this;
  function err (e) {
    self.sink.error(self.scheduler.now(), e);
  }

  Promise.resolve(this).then(next).catch(err);
}

function next (generate, x) {
  return generate.active ? handle(generate, generate.iterator.next(x)) : x
}

function handle (generate, result) {
  if (result.done) {
    return generate.sink.end(generate.scheduler.now(), result.value)
  }

  return Promise.resolve(result.value).then(function (x) {
    return emit$1(generate, x)
  }, function (e) {
    return error$1(generate, e)
  })
}

function emit$1 (generate, x) {
  generate.sink.event(generate.scheduler.now(), x);
  return next(generate, x)
}

function error$1 (generate, e) {
  return handle(generate, generate.iterator.throw(e))
}

Generate.prototype.dispose = function () {
  this.active = false;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function continueWith$1 (f, stream) {
  return new Stream(new ContinueWith(f, stream.source))
}

function ContinueWith (f, source) {
  this.f = f;
  this.source = source;
}

ContinueWith.prototype.run = function (sink, scheduler) {
  return new ContinueWithSink(this.f, this.source, sink, scheduler)
};

function ContinueWithSink (f, source, sink, scheduler) {
  this.f = f;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;
  this.disposable = once(source.run(this, scheduler));
}

ContinueWithSink.prototype.error = Pipe.prototype.error;

ContinueWithSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x);
};

ContinueWithSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  tryDispose(t, this.disposable, this.sink);
  this._startNext(t, x, this.sink);
};

ContinueWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink);
  } catch (e) {
    sink.error(t, e);
  }
};

ContinueWithSink.prototype._continue = function (f, x, sink) {
  return f(x).source.run(sink, this.scheduler)
};

ContinueWithSink.prototype.dispose = function () {
  this.active = false;
  return this.disposable.dispose()
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {*} x value to prepend
 * @param {Stream} stream
 * @returns {Stream} new stream with x prepended
 */
function cons$1 (x, stream) {
  return concat$1(of(x), stream)
}

/**
* @param {Stream} left
* @param {Stream} right
* @returns {Stream} new stream containing all events in left followed by all
*  events in right.  This *timeshifts* right to the end of left.
*/
function concat$1 (left, right) {
  return continueWith$1(function () {
    return right
  }, left)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function IndexSink (i, sink) {
  this.sink = sink;
  this.index = i;
  this.active = true;
  this.value = void 0;
}

IndexSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.value = x;
  this.sink.event(t, this);
};

IndexSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false;
  this.sink.end(t, { index: this.index, value: x });
};

IndexSink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function invoke (f, args) {
	/*eslint complexity: [2,7]*/
  switch (args.length) {
    case 0: return f()
    case 1: return f(args[0])
    case 2: return f(args[0], args[1])
    case 3: return f(args[0], args[1], args[2])
    case 4: return f(args[0], args[1], args[2], args[3])
    case 5: return f(args[0], args[1], args[2], args[3], args[4])
    default:
      return f.apply(void 0, args)
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var map$4 = map$1;
var tail$1 = tail;

/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
function combine (f /*, ...streams */) {
  return combineArray$1(f, tail$1(arguments))
}

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
function combineArray$1 (f, streams) {
  var l = streams.length;
  return l === 0 ? empty$$1()
  : l === 1 ? map$3(f, streams[0])
  : new Stream(combineSources(f, streams))
}

function combineSources (f, streams) {
  return new Combine(f, map$4(getSource, streams))
}

function getSource (stream) {
  return stream.source
}

function Combine (f, sources) {
  this.f = f;
  this.sources = sources;
}

Combine.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);

  var mergeSink = new CombineSink(disposables, sinks, sink, this.f);

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new IndexSink(i, mergeSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables)
};

function CombineSink (disposables, sinks, sink, f) {
  var this$1 = this;

  this.sink = sink;
  this.disposables = disposables;
  this.sinks = sinks;
  this.f = f;

  var l = sinks.length;
  this.awaiting = l;
  this.values = new Array(l);
  this.hasValue = new Array(l);
  for (var i = 0; i < l; ++i) {
    this$1.hasValue[i] = false;
  }

  this.activeCount = sinks.length;
}

CombineSink.prototype.error = Pipe.prototype.error;

CombineSink.prototype.event = function (t, indexedValue) {
  var i = indexedValue.index;
  var awaiting = this._updateReady(i);

  this.values[i] = indexedValue.value;
  if (awaiting === 0) {
    this.sink.event(t, invoke(this.f, this.values));
  }
};

CombineSink.prototype._updateReady = function (index) {
  if (this.awaiting > 0) {
    if (!this.hasValue[index]) {
      this.hasValue[index] = true;
      this.awaiting -= 1;
    }
  }
  return this.awaiting
};

CombineSink.prototype.end = function (t, indexedValue) {
  tryDispose(t, this.disposables[indexedValue.index], this.sink);
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value);
  }
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Assume fs is a stream containing functions, and apply the latest function
 * in fs to the latest value in xs.
 * fs:         --f---------g--------h------>
 * xs:         -a-------b-------c-------d-->
 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
 * @param {Stream} fs stream of functions to apply to the latest x
 * @param {Stream} xs stream of values to which to apply all the latest f
 * @returns {Stream} stream containing all the applications of fs to xs
 */
function ap$1 (fs, xs) {
  return combine(apply, fs, xs)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Doubly linked list
 * @constructor
 */
function LinkedList () {
  this.head = null;
  this.length = 0;
}

/**
 * Add a node to the end of the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
 */
LinkedList.prototype.add = function (x) {
  if (this.head !== null) {
    this.head.prev = x;
    x.next = this.head;
  }
  this.head = x;
  ++this.length;
};

/**
 * Remove the provided node from the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
 */
LinkedList.prototype.remove = function (x) { // eslint-disable-line  complexity
  --this.length;
  if (x === this.head) {
    this.head = this.head.next;
  }
  if (x.next !== null) {
    x.next.prev = x.prev;
    x.next = null;
  }
  if (x.prev !== null) {
    x.prev.next = x.next;
    x.prev = null;
  }
};

/**
 * @returns {boolean} true iff there are no nodes in the list
 */
LinkedList.prototype.isEmpty = function () {
  return this.length === 0
};

/**
 * Dispose all nodes
 * @returns {Promise} promise that fulfills when all nodes have been disposed,
 *  or rejects if an error occurs while disposing
 */
LinkedList.prototype.dispose = function () {
  if (this.isEmpty()) {
    return Promise.resolve()
  }

  var promises = [];
  var x = this.head;
  this.head = null;
  this.length = 0;

  while (x !== null) {
    promises.push(x.dispose());
    x = x.next;
  }

  return Promise.all(promises)
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function mergeConcurrently$1 (concurrency, stream) {
  return mergeMapConcurrently$1(id, concurrency, stream)
}

function mergeMapConcurrently$1 (f, concurrency, stream) {
  return new Stream(new MergeConcurrently(f, concurrency, stream.source))
}

function MergeConcurrently (f, concurrency, source) {
  this.f = f;
  this.concurrency = concurrency;
  this.source = source;
}

MergeConcurrently.prototype.run = function (sink, scheduler) {
  return new Outer(this.f, this.concurrency, this.source, sink, scheduler)
};

function Outer (f, concurrency, source, sink, scheduler) {
  this.f = f;
  this.concurrency = concurrency;
  this.sink = sink;
  this.scheduler = scheduler;
  this.pending = [];
  this.current = new LinkedList();
  this.disposable = once(source.run(this, scheduler));
  this.active = true;
}

Outer.prototype.event = function (t, x) {
  this._addInner(t, x);
};

Outer.prototype._addInner = function (t, x) {
  if (this.current.length < this.concurrency) {
    this._startInner(t, x);
  } else {
    this.pending.push(x);
  }
};

Outer.prototype._startInner = function (t, x) {
  try {
    this._initInner(t, x);
  } catch (e) {
    this.error(t, e);
  }
};

Outer.prototype._initInner = function (t, x) {
  var innerSink = new Inner(t, this, this.sink);
  innerSink.disposable = mapAndRun(this.f, x, innerSink, this.scheduler);
  this.current.add(innerSink);
};

function mapAndRun (f, x, sink, scheduler) {
  return f(x).source.run(sink, scheduler)
}

Outer.prototype.end = function (t, x) {
  this.active = false;
  tryDispose(t, this.disposable, this.sink);
  this._checkEnd(t, x);
};

Outer.prototype.error = function (t, e) {
  this.active = false;
  this.sink.error(t, e);
};

Outer.prototype.dispose = function () {
  this.active = false;
  this.pending.length = 0;
  return Promise.all([this.disposable.dispose(), this.current.dispose()])
};

Outer.prototype._endInner = function (t, x, inner) {
  this.current.remove(inner);
  tryDispose(t, inner, this);

  if (this.pending.length === 0) {
    this._checkEnd(t, x);
  } else {
    this._startInner(t, this.pending.shift());
  }
};

Outer.prototype._checkEnd = function (t, x) {
  if (!this.active && this.current.isEmpty()) {
    this.sink.end(t, x);
  }
};

function Inner (time, outer, sink) {
  this.prev = this.next = null;
  this.time = time;
  this.outer = outer;
  this.sink = sink;
  this.disposable = void 0;
}

Inner.prototype.event = function (t, x) {
  this.sink.event(Math.max(t, this.time), x);
};

Inner.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.time), x, this);
};

Inner.prototype.error = function (t, e) {
  this.outer.error(Math.max(t, this.time), e);
};

Inner.prototype.dispose = function () {
  return this.disposable.dispose()
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function flatMap (f, stream) {
  return mergeMapConcurrently$1(f, Infinity, stream)
}

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param {Stream<Stream<X>>} stream stream of streams
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
function join (stream) {
  return mergeConcurrently$1(Infinity, stream)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param {function(x:*):Stream} f function to map each value to a stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function concatMap$1 (f, stream) {
  return mergeMapConcurrently$1(f, 1, stream)
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var copy$1 = copy;
var reduce$3 = reduce$1;

/**
 * @returns {Stream} stream containing events from all streams in the argument
 * list in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function merge (/* ...streams*/) {
  return mergeArray(copy$1(arguments))
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function mergeArray (streams) {
  var l = streams.length;
  return l === 0 ? empty$$1()
    : l === 1 ? streams[0]
    : new Stream(mergeSources(streams))
}

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
function mergeSources (streams) {
  return new Merge(reduce$3(appendSources, [], streams))
}

function appendSources (sources, stream) {
  var source = stream.source;
  return source instanceof Merge
    ? sources.concat(source.sources)
    : sources.concat(source)
}

function Merge (sources) {
  this.sources = sources;
}

Merge.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);

  var mergeSink = new MergeSink(disposables, sinks, sink);

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new IndexSink(i, mergeSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables)
};

function MergeSink (disposables, sinks, sink) {
  this.sink = sink;
  this.disposables = disposables;
  this.activeCount = sinks.length;
}

MergeSink.prototype.error = Pipe.prototype.error;

MergeSink.prototype.event = function (t, indexValue) {
  this.sink.event(t, indexValue.value);
};

MergeSink.prototype.end = function (t, indexedValue) {
  tryDispose(t, this.disposables[indexedValue.index], this.sink);
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value);
  }
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * When an event arrives on sampler, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @param {Stream} sampler streams will be sampled whenever an event arrives
 *  on sampler
 * @returns {Stream} stream of sampled and transformed values
 */
function sample (f, sampler /*, ...streams */) {
  return sampleArray$1(f, sampler, drop(2, arguments))
}

/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  stream's latest value will be propagated
 * @param {Stream} stream stream of values
 * @returns {Stream} sampled stream of values
 */
function sampleWith$1 (sampler, stream) {
  return new Stream(new Sampler(id, sampler.source, [stream.source]))
}

function sampleArray$1 (f, sampler, streams) {
  return new Stream(new Sampler(f, sampler.source, map$1(getSource$1, streams)))
}

function getSource$1 (stream) {
  return stream.source
}

function Sampler (f, sampler, sources) {
  this.f = f;
  this.sampler = sampler;
  this.sources = sources;
}

Sampler.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l + 1);
  var sinks = new Array(l);

  var sampleSink = new SampleSink(this.f, sinks, sink);

  for (var hold, i = 0; i < l; ++i) {
    hold = sinks[i] = new Hold(sampleSink);
    disposables[i] = this$1.sources[i].run(hold, scheduler);
  }

  disposables[i] = this.sampler.run(sampleSink, scheduler);

  return all(disposables)
};

function Hold (sink) {
  this.sink = sink;
  this.hasValue = false;
}

Hold.prototype.event = function (t, x) {
  this.value = x;
  this.hasValue = true;
  this.sink._notify(this);
};

Hold.prototype.end = function () {};
Hold.prototype.error = Pipe.prototype.error;

function SampleSink (f, sinks, sink) {
  this.f = f;
  this.sinks = sinks;
  this.sink = sink;
  this.active = false;
}

SampleSink.prototype._notify = function () {
  if (!this.active) {
    this.active = this.sinks.every(hasValue);
  }
};

SampleSink.prototype.event = function (t) {
  if (this.active) {
    this.sink.event(t, invoke(this.f, map$1(getValue, this.sinks)));
  }
};

SampleSink.prototype.end = Pipe.prototype.end;
SampleSink.prototype.error = Pipe.prototype.error;

function hasValue (hold) {
  return hold.hasValue
}

function getValue (hold) {
  return hold.value
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

// Based on https://github.com/petkaantonov/deque

function Queue (capPow2) {
  this._capacity = capPow2 || 32;
  this._length = 0;
  this._head = 0;
}

Queue.prototype.push = function (x) {
  var len = this._length;
  this._checkCapacity(len + 1);

  var i = (this._head + len) & (this._capacity - 1);
  this[i] = x;
  this._length = len + 1;
};

Queue.prototype.shift = function () {
  var head = this._head;
  var x = this[head];

  this[head] = void 0;
  this._head = (head + 1) & (this._capacity - 1);
  this._length--;
  return x
};

Queue.prototype.isEmpty = function () {
  return this._length === 0
};

Queue.prototype.length = function () {
  return this._length
};

Queue.prototype._checkCapacity = function (size) {
  if (this._capacity < size) {
    this._ensureCapacity(this._capacity << 1);
  }
};

Queue.prototype._ensureCapacity = function (capacity) {
  var oldCapacity = this._capacity;
  this._capacity = capacity;

  var last = this._head + this._length;

  if (last > oldCapacity) {
    copy$2(this, 0, this, oldCapacity, last & (oldCapacity - 1));
  }
};

function copy$2 (src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex];
    src[j + srcIndex] = void 0;
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var map$5 = map$1;
var tail$2 = tail;

/**
 * Combine streams pairwise (or tuple-wise) by index by applying f to values
 * at corresponding indices.  The returned stream ends when any of the input
 * streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
function zip (f /*, ...streams */) {
  return zipArray$1(f, tail$2(arguments))
}

/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
function zipArray$1 (f, streams) {
  return streams.length === 0 ? empty$$1()
: streams.length === 1 ? map$3(f, streams[0])
: new Stream(new Zip(f, map$5(getSource$2, streams)))
}

function getSource$2 (stream) {
  return stream.source
}

function Zip (f, sources) {
  this.f = f;
  this.sources = sources;
}

Zip.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);
  var buffers = new Array(l);

  var zipSink = new ZipSink(this.f, buffers, sinks, sink);

  for (var indexSink, i = 0; i < l; ++i) {
    buffers[i] = new Queue();
    indexSink = sinks[i] = new IndexSink(i, zipSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables)
};

function ZipSink (f, buffers, sinks, sink) {
  this.f = f;
  this.sinks = sinks;
  this.sink = sink;
  this.buffers = buffers;
}

ZipSink.prototype.event = function (t, indexedValue) { // eslint-disable-line complexity
  var buffers = this.buffers;
  var buffer = buffers[indexedValue.index];

  buffer.push(indexedValue.value);

  if (buffer.length() === 1) {
    if (!ready(this.buffers)) {
      return
    }

    emitZipped(this.f, t, buffers, this.sink);

    if (ended(this.buffers, this.sinks)) {
      this.sink.end(t, void 0);
    }
  }
};

ZipSink.prototype.end = function (t, indexedValue) {
  var buffer = this.buffers[indexedValue.index];
  if (buffer.isEmpty()) {
    this.sink.end(t, indexedValue.value);
  }
};

ZipSink.prototype.error = Pipe.prototype.error;

function emitZipped (f, t, buffers, sink) {
  sink.event(t, invoke(f, map$5(head, buffers)));
}

function head (buffer) {
  return buffer.shift()
}

function ended (buffers, sinks) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true
    }
  }
  return false
}

function ready (buffers) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false
    }
  }
  return true
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
function switchLatest (stream) {
  return new Stream(new Switch(stream.source))
}

function Switch (source) {
  this.source = source;
}

Switch.prototype.run = function (sink, scheduler) {
  var switchSink = new SwitchSink(sink, scheduler);
  return all([switchSink, this.source.run(switchSink, scheduler)])
};

function SwitchSink (sink, scheduler) {
  this.sink = sink;
  this.scheduler = scheduler;
  this.current = null;
  this.ended = false;
}

SwitchSink.prototype.event = function (t, stream) {
  this._disposeCurrent(t); // TODO: capture the result of this dispose
  this.current = new Segment(t, Infinity, this, this.sink);
  this.current.disposable = stream.source.run(this.current, this.scheduler);
};

SwitchSink.prototype.end = function (t, x) {
  this.ended = true;
  this._checkEnd(t, x);
};

SwitchSink.prototype.error = function (t, e) {
  this.ended = true;
  this.sink.error(t, e);
};

SwitchSink.prototype.dispose = function () {
  return this._disposeCurrent(this.scheduler.now())
};

SwitchSink.prototype._disposeCurrent = function (t) {
  if (this.current !== null) {
    return this.current._dispose(t)
  }
};

SwitchSink.prototype._disposeInner = function (t, inner) {
  inner._dispose(t); // TODO: capture the result of this dispose
  if (inner === this.current) {
    this.current = null;
  }
};

SwitchSink.prototype._checkEnd = function (t, x) {
  if (this.ended && this.current === null) {
    this.sink.end(t, x);
  }
};

SwitchSink.prototype._endInner = function (t, x, inner) {
  this._disposeInner(t, inner);
  this._checkEnd(t, x);
};

SwitchSink.prototype._errorInner = function (t, e, inner) {
  this._disposeInner(t, inner);
  this.sink.error(t, e);
};

function Segment (min, max, outer, sink) {
  this.min = min;
  this.max = max;
  this.outer = outer;
  this.sink = sink;
  this.disposable = empty$1();
}

Segment.prototype.event = function (t, x) {
  if (t < this.max) {
    this.sink.event(Math.max(t, this.min), x);
  }
};

Segment.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.min), x, this);
};

Segment.prototype.error = function (t, e) {
  this.outer._errorInner(Math.max(t, this.min), e, this);
};

Segment.prototype._dispose = function (t) {
  this.max = t;
  tryDispose(t, this.disposable, this.sink);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
function filter$1 (p, stream) {
  return new Stream(Filter.create(p, stream.source))
}

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeats (stream) {
  return skipRepeatsWith$1(same, stream)
}

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeatsWith$1 (equals, stream) {
  return new Stream(new SkipRepeats(equals, stream.source))
}

function SkipRepeats (equals, source) {
  this.equals = equals;
  this.source = source;
}

SkipRepeats.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler)
};

function SkipRepeatsSink (equals, sink) {
  this.equals = equals;
  this.sink = sink;
  this.value = void 0;
  this.init = true;
}

SkipRepeatsSink.prototype.end = Pipe.prototype.end;
SkipRepeatsSink.prototype.error = Pipe.prototype.error;

SkipRepeatsSink.prototype.event = function (t, x) {
  if (this.init) {
    this.init = false;
    this.value = x;
    this.sink.event(t, x);
  } else if (!this.equals(this.value, x)) {
    this.value = x;
    this.sink.event(t, x);
  }
};

function same (a, b) {
  return a === b
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
function take$1 (n, stream) {
  return slice$1(0, n, stream)
}

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
function skip$1 (n, stream) {
  return slice$1(n, Infinity, stream)
}

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
function slice$1 (start, end, stream) {
  return end <= start ? empty$$1()
    : new Stream(sliceSource(start, end, stream.source))
}

function sliceSource (start, end, source) {
  return source instanceof Map ? commuteMapSlice(start, end, source)
    : source instanceof Slice ? fuseSlice(start, end, source)
    : new Slice(start, end, source)
}

function commuteMapSlice (start, end, source) {
  return Map.create(source.f, sliceSource(start, end, source.source))
}

function fuseSlice (start, end, source) {
  start += source.min;
  end = Math.min(end + source.min, source.max);
  return new Slice(start, end, source.source)
}

function Slice (min, max, source) {
  this.source = source;
  this.min = min;
  this.max = max;
}

Slice.prototype.run = function (sink, scheduler) {
  return new SliceSink(this.min, this.max - this.min, this.source, sink, scheduler)
};

function SliceSink (skip, take, source, sink, scheduler) {
  this.sink = sink;
  this.skip = skip;
  this.take = take;
  this.disposable = once(source.run(this, scheduler));
}

SliceSink.prototype.end = Pipe.prototype.end;
SliceSink.prototype.error = Pipe.prototype.error;

SliceSink.prototype.event = function (t, x) { // eslint-disable-line complexity
  if (this.skip > 0) {
    this.skip -= 1;
    return
  }

  if (this.take === 0) {
    return
  }

  this.take -= 1;
  this.sink.event(t, x);
  if (this.take === 0) {
    this.dispose();
    this.sink.end(t, x);
  }
};

SliceSink.prototype.dispose = function () {
  return this.disposable.dispose()
};

function takeWhile$1 (p, stream) {
  return new Stream(new TakeWhile(p, stream.source))
}

function TakeWhile (p, source) {
  this.p = p;
  this.source = source;
}

TakeWhile.prototype.run = function (sink, scheduler) {
  return new TakeWhileSink(this.p, this.source, sink, scheduler)
};

function TakeWhileSink (p, source, sink, scheduler) {
  this.p = p;
  this.sink = sink;
  this.active = true;
  this.disposable = once(source.run(this, scheduler));
}

TakeWhileSink.prototype.end = Pipe.prototype.end;
TakeWhileSink.prototype.error = Pipe.prototype.error;

TakeWhileSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  var p = this.p;
  this.active = p(x);
  if (this.active) {
    this.sink.event(t, x);
  } else {
    this.dispose();
    this.sink.end(t, x);
  }
};

TakeWhileSink.prototype.dispose = function () {
  return this.disposable.dispose()
};

function skipWhile$1 (p, stream) {
  return new Stream(new SkipWhile(p, stream.source))
}

function SkipWhile (p, source) {
  this.p = p;
  this.source = source;
}

SkipWhile.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipWhileSink(this.p, sink), scheduler)
};

function SkipWhileSink (p, sink) {
  this.p = p;
  this.sink = sink;
  this.skipping = true;
}

SkipWhileSink.prototype.end = Pipe.prototype.end;
SkipWhileSink.prototype.error = Pipe.prototype.error;

SkipWhileSink.prototype.event = function (t, x) {
  if (this.skipping) {
    var p = this.p;
    this.skipping = p(x);
    if (this.skipping) {
      return
    }
  }

  this.sink.event(t, x);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function takeUntil (signal, stream) {
  return new Stream(new Until(signal.source, stream.source))
}

function skipUntil (signal, stream) {
  return new Stream(new Since(signal.source, stream.source))
}

function during$1 (timeWindow, stream) {
  return takeUntil(join(timeWindow), skipUntil(timeWindow, stream))
}

function Until (maxSignal, source) {
  this.maxSignal = maxSignal;
  this.source = source;
}

Until.prototype.run = function (sink, scheduler) {
  var min = new Bound(-Infinity, sink);
  var max = new UpperBound(this.maxSignal, sink, scheduler);
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

  return all([min, max, disposable])
};

function Since (minSignal, source) {
  this.minSignal = minSignal;
  this.source = source;
}

Since.prototype.run = function (sink, scheduler) {
  var min = new LowerBound(this.minSignal, sink, scheduler);
  var max = new Bound(Infinity, sink);
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

  return all([min, max, disposable])
};

function Bound (value, sink) {
  this.value = value;
  this.sink = sink;
}

Bound.prototype.error = Pipe.prototype.error;
Bound.prototype.event = noop;
Bound.prototype.end = noop;
Bound.prototype.dispose = noop;

function TimeWindowSink (min, max, sink) {
  this.min = min;
  this.max = max;
  this.sink = sink;
}

TimeWindowSink.prototype.event = function (t, x) {
  if (t >= this.min.value && t < this.max.value) {
    this.sink.event(t, x);
  }
};

TimeWindowSink.prototype.error = Pipe.prototype.error;
TimeWindowSink.prototype.end = Pipe.prototype.end;

function LowerBound (signal, sink, scheduler) {
  this.value = Infinity;
  this.sink = sink;
  this.disposable = signal.run(this, scheduler);
}

LowerBound.prototype.event = function (t /*, x */) {
  if (t < this.value) {
    this.value = t;
  }
};

LowerBound.prototype.end = noop;
LowerBound.prototype.error = Pipe.prototype.error;

LowerBound.prototype.dispose = function () {
  return this.disposable.dispose()
};

function UpperBound (signal, sink, scheduler) {
  this.value = Infinity;
  this.sink = sink;
  this.disposable = signal.run(this, scheduler);
}

UpperBound.prototype.event = function (t, x) {
  if (t < this.value) {
    this.value = t;
    this.sink.end(t, x);
  }
};

UpperBound.prototype.end = noop;
UpperBound.prototype.error = Pipe.prototype.error;

UpperBound.prototype.dispose = function () {
  return this.disposable.dispose()
};

function noop () {}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
function delay$1 (delayTime, stream) {
  return delayTime <= 0 ? stream
    : new Stream(new Delay(delayTime, stream.source))
}

function Delay (dt, source) {
  this.dt = dt;
  this.source = source;
}

Delay.prototype.run = function (sink, scheduler) {
  var delaySink = new DelaySink(this.dt, sink, scheduler);
  return all([delaySink, this.source.run(delaySink, scheduler)])
};

function DelaySink (dt, sink, scheduler) {
  this.dt = dt;
  this.sink = sink;
  this.scheduler = scheduler;
}

DelaySink.prototype.dispose = function () {
  var self = this;
  this.scheduler.cancelAll(function (task) {
    return task.sink === self.sink
  });
};

DelaySink.prototype.event = function (t, x) {
  this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
};

DelaySink.prototype.end = function (t, x) {
  this.scheduler.delay(this.dt, PropagateTask.end(x, this.sink));
};

DelaySink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function timestamp (stream) {
  return new Stream(new Timestamp(stream.source))
}

function Timestamp (source) {
  this.source = source;
}

Timestamp.prototype.run = function (sink, scheduler) {
  return this.source.run(new TimestampSink(sink), scheduler)
};

function TimestampSink (sink) {
  this.sink = sink;
}

TimestampSink.prototype.end = Pipe.prototype.end;
TimestampSink.prototype.error = Pipe.prototype.error;

TimestampSink.prototype.event = function (t, x) {
  this.sink.event(t, { time: t, value: x });
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
function throttle$1 (period, stream) {
  return new Stream(throttleSource(period, stream.source))
}

function throttleSource (period, source) {
  return source instanceof Map ? commuteMapThrottle(period, source)
    : source instanceof Throttle ? fuseThrottle(period, source)
    : new Throttle(period, source)
}

function commuteMapThrottle (period, source) {
  return Map.create(source.f, throttleSource(period, source.source))
}

function fuseThrottle (period, source) {
  return new Throttle(Math.max(period, source.period), source.source)
}

function Throttle (period, source) {
  this.period = period;
  this.source = source;
}

Throttle.prototype.run = function (sink, scheduler) {
  return this.source.run(new ThrottleSink(this.period, sink), scheduler)
};

function ThrottleSink (period, sink) {
  this.time = 0;
  this.period = period;
  this.sink = sink;
}

ThrottleSink.prototype.event = function (t, x) {
  if (t >= this.time) {
    this.time = t + this.period;
    this.sink.event(t, x);
  }
};

ThrottleSink.prototype.end = Pipe.prototype.end;

ThrottleSink.prototype.error = Pipe.prototype.error;

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */
function debounce$1 (period, stream) {
  return new Stream(new Debounce(period, stream.source))
}

function Debounce (dt, source) {
  this.dt = dt;
  this.source = source;
}

Debounce.prototype.run = function (sink, scheduler) {
  return new DebounceSink(this.dt, this.source, sink, scheduler)
};

function DebounceSink (dt, source, sink, scheduler) {
  this.dt = dt;
  this.sink = sink;
  this.scheduler = scheduler;
  this.value = void 0;
  this.timer = null;

  var sourceDisposable = source.run(this, scheduler);
  this.disposable = all([this, sourceDisposable]);
}

DebounceSink.prototype.event = function (t, x) {
  this._clearTimer();
  this.value = x;
  this.timer = this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
};

DebounceSink.prototype.end = function (t, x) {
  if (this._clearTimer()) {
    this.sink.event(t, this.value);
    this.value = void 0;
  }
  this.sink.end(t, x);
};

DebounceSink.prototype.error = function (t, x) {
  this._clearTimer();
  this.sink.error(t, x);
};

DebounceSink.prototype.dispose = function () {
  this._clearTimer();
};

DebounceSink.prototype._clearTimer = function () {
  if (this.timer === null) {
    return false
  }
  this.timer.dispose();
  this.timer = null;
  return true
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
function fromPromise (p) {
  return awaitPromises(of(p))
}

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved.
 * @param {Stream<Promise<T>>} stream
 * @return {Stream<T>} stream of fulfillment values.  The stream will
 * error if any promise rejects.
 */
function awaitPromises (stream) {
  return new Stream(new Await(stream.source))
}

function Await (source) {
  this.source = source;
}

Await.prototype.run = function (sink, scheduler) {
  return this.source.run(new AwaitSink(sink, scheduler), scheduler)
};

function AwaitSink (sink, scheduler) {
  this.sink = sink;
  this.scheduler = scheduler;
  this.queue = Promise.resolve();
  var self = this;

	// Pre-create closures, to avoid creating them per event
  this._eventBound = function (x) {
    self.sink.event(self.scheduler.now(), x);
  };

  this._endBound = function (x) {
    self.sink.end(self.scheduler.now(), x);
  };

  this._errorBound = function (e) {
    self.sink.error(self.scheduler.now(), e);
  };
}

AwaitSink.prototype.event = function (t, promise) {
  var self = this;
  this.queue = this.queue.then(function () {
    return self._event(promise)
  }).catch(this._errorBound);
};

AwaitSink.prototype.end = function (t, x) {
  var self = this;
  this.queue = this.queue.then(function () {
    return self._end(x)
  }).catch(this._errorBound);
};

AwaitSink.prototype.error = function (t, e) {
  var self = this;
  // Don't resolve error values, propagate directly
  this.queue = this.queue.then(function () {
    return self._errorBound(e)
  }).catch(fatalError);
};

AwaitSink.prototype._event = function (promise) {
  return promise.then(this._eventBound)
};

AwaitSink.prototype._end = function (x) {
  return Promise.resolve(x).then(this._endBound)
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SafeSink (sink) {
  this.sink = sink;
  this.active = true;
}

SafeSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x);
};

SafeSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.disable();
  this.sink.end(t, x);
};

SafeSink.prototype.error = function (t, e) {
  this.disable();
  this.sink.error(t, e);
};

SafeSink.prototype.disable = function () {
  this.active = false;
  return this.sink
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
function recoverWith$1 (f, stream) {
  return new Stream(new RecoverWith(f, stream.source))
}



/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
function throwError (e) {
  return new Stream(new ErrorSource(e))
}

function ErrorSource (e) {
  this.value = e;
}

ErrorSource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runError, this.value, sink))
};

function runError (t, e, sink) {
  sink.error(t, e);
}

function RecoverWith (f, source) {
  this.f = f;
  this.source = source;
}

RecoverWith.prototype.run = function (sink, scheduler) {
  return new RecoverWithSink(this.f, this.source, sink, scheduler)
};

function RecoverWithSink (f, source, sink, scheduler) {
  this.f = f;
  this.sink = new SafeSink(sink);
  this.scheduler = scheduler;
  this.disposable = source.run(this, scheduler);
}

RecoverWithSink.prototype.event = function (t, x) {
  tryEvent(t, x, this.sink);
};

RecoverWithSink.prototype.end = function (t, x) {
  tryEnd(t, x, this.sink);
};

RecoverWithSink.prototype.error = function (t, e) {
  var nextSink = this.sink.disable();

  tryDispose(t, this.disposable, this.sink);
  this._startNext(t, e, nextSink);
};

RecoverWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink);
  } catch (e) {
    sink.error(t, e);
  }
};

RecoverWithSink.prototype._continue = function (f, x, sink) {
  var stream = f(x);
  return stream.source.run(sink, this.scheduler)
};

RecoverWithSink.prototype.dispose = function () {
  return this.disposable.dispose()
};

/** @license MIT License (c) copyright 2016 original author or authors */
// -----------------------------------------------------------------------
// Adapting other sources

var fromEvent$$1 = curry2(fromEvent$1);

// -----------------------------------------------------------------------
// Observing

var observe$$1 = curry2(observe$1);

// -------------------------------------------------------

var loop$$1 = curry3(loop$1);

// -------------------------------------------------------

var scan$$1 = curry3(scan$1);
var reduce$$1 = curry3(reduce$2);

// -----------------------------------------------------------------------
// Building and extending

var unfold$$1 = curry2(unfold$1);

var iterate$$1 = curry2(iterate$1);

var concat$$1 = curry2(concat$1);
var startWith = curry2(cons$1);

// -----------------------------------------------------------------------
// Transforming

var map$$1 = curry2(map$3);
var constant$$1 = curry2(constant$1);
var tap$$1 = curry2(tap$1);
var ap$$1 = curry2(ap$1);

// -----------------------------------------------------------------------
// FlatMapping

var chain = curry2(flatMap);
var continueWith$$1 = curry2(continueWith$1);

var concatMap$$1 = curry2(concatMap$1);

// -----------------------------------------------------------------------
// Concurrent merging

var mergeConcurrently$$1 = curry2(mergeConcurrently$1);
var mergeMapConcurrently$$1 = curry3(mergeMapConcurrently$1);

// -----------------------------------------------------------------------
// Combining

var combineArray$$1 = curry2(combineArray$1);

// -----------------------------------------------------------------------
// Sampling

var sampleWith$$1 = curry2(sampleWith$1);
var sampleArray$$1 = curry3(sampleArray$1);

// -----------------------------------------------------------------------
// Zipping

var zipArray$$1 = curry2(zipArray$1);

// -----------------------------------------------------------------------
// Filtering

var filter$$1 = curry2(filter$1);
var skipRepeatsWith$$1 = curry2(skipRepeatsWith$1);

// -----------------------------------------------------------------------
// Slicing

var take$$1 = curry2(take$1);
var skip$$1 = curry2(skip$1);
var slice$$1 = curry3(slice$1);
var takeWhile$$1 = curry2(takeWhile$1);
var skipWhile$$1 = curry2(skipWhile$1);

// -----------------------------------------------------------------------
// Time slicing

var until = curry2(takeUntil);
var since = curry2(skipUntil);
var during$$1 = curry2(during$1);

// -----------------------------------------------------------------------
// Delaying

var delay$$1 = curry2(delay$1);

// -----------------------------------------------------------------------
// Rate limiting

var throttle$$1 = curry2(throttle$1);
var debounce$$1 = curry2(debounce$1);

// -----------------------------------------------------------------------
// Error handling

var recoverWith$$1 = curry2(recoverWith$1);

exports.fromEvent = fromEvent$$1;
exports.drain = drain;
exports.observe = observe$$1;
exports.loop = loop$$1;
exports.scan = scan$$1;
exports.reduce = reduce$$1;
exports.unfold = unfold$$1;
exports.iterate = iterate$$1;
exports.concat = concat$$1;
exports.startWith = startWith;
exports.map = map$$1;
exports.constant = constant$$1;
exports.tap = tap$$1;
exports.ap = ap$$1;
exports.chain = chain;
exports.join = join;
exports.continueWith = continueWith$$1;
exports.concatMap = concatMap$$1;
exports.mergeConcurrently = mergeConcurrently$$1;
exports.mergeMapConcurrently = mergeMapConcurrently$$1;
exports.combine = combine;
exports.combineArray = combineArray$$1;
exports.sample = sample;
exports.sampleWith = sampleWith$$1;
exports.sampleArray = sampleArray$$1;
exports.zip = zip;
exports.zipArray = zipArray$$1;
exports.filter = filter$$1;
exports.skipRepeats = skipRepeats;
exports.skipRepeatsWith = skipRepeatsWith$$1;
exports.take = take$$1;
exports.skip = skip$$1;
exports.slice = slice$$1;
exports.takeWhile = takeWhile$$1;
exports.skipWhile = skipWhile$$1;
exports.until = until;
exports.since = since;
exports.during = during$$1;
exports.delay = delay$$1;
exports.throttle = throttle$$1;
exports.debounce = debounce$$1;
exports.recoverWith = recoverWith$$1;
exports.throwError = throwError;
exports.Stream = Stream;
exports.just = of;
exports.empty = empty$$1;
exports.never = never;
exports.from = coerce;
exports.periodic = periodic;
exports.generate = generate;
exports.merge = merge;
exports.mergeArray = mergeArray;
exports.switchLatest = switchLatest;
exports.timestamp = timestamp;
exports.fromPromise = fromPromise;
exports.awaitPromises = awaitPromises;
exports.defaultScheduler = defaultScheduler;
exports.PropagateTask = PropagateTask;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mostCore.js.map
