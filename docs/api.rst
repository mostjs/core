API
===

.. _@most/types:

@most/types
-----------

.. _Time:

Time
^^^^

.. code-block:: haskell

  type Time = number

Time is a monotonic number. It represents the current time according to a Scheduler.  The default Scheduler uses ``performance.now`` in browsers, and ``process.hrtime`` (transformed to a `number`) in Node.

.. code-block:: haskell

  type Delay = number
  type Period = number
  type Offset = number

Delay, Period, and Offset are semantic time-related types.  They're all numbers, but are intended to provide helpful semantics for working with :ref:`Task` and :ref:`Scheduler` methods.

.. _Stream:

Stream
^^^^^^

.. code-block:: haskell

  type Stream a = {
    run :: Sink a -> Scheduler -> Disposable
  }

A Stream represents a view of events over time. It's ``run`` method arranges to propagate events to the provided Sink. Each stream has a local clock, defined by the provided :ref:`Scheduler`, which has methods for knowing the current time, and scheduling future tasks.

Some Streams, like :ref:`now` are simple, while others, like :ref:`combine`, do sophisticated things such as combining multiple streams, or dealing with higher order streams.

Some Streams act as event producers, such as from DOM events. A producer Stream must never produce an event in the same call stack as its run method is called. It must begin producing items asynchronously. In some cases, this comes for free, such as DOM events. In other cases, it must be done explicitly using the provided Scheduler to schedule asynchronous tasks.

.. _Sink:

Sink
^^^^

.. code-block:: haskell

  type Sink a = {
    event :: Time -> a -> void
    error :: Time -> Error -> void
    end :: Time -> void
  }

A sink receives events, typically does something with them, such as transforming or filtering them, and then propagates them to another sink.

Typically, a combinator will be implemented as a Stream and a Sink. The :ref:`Stream` is usually stateless/immutable, and creates a new Sink for each new observer. In most cases, the relationship of a Stream to Sink is 1-many.

.. _Disposable:

Disposable
^^^^^^^^^^

.. code-block:: haskell

  type Disposable = {
    dispose:: () -> void
  }

A Disposable represents a resource that must be disposed (or released), such as a DOM event listener.

.. _Scheduler:

Scheduler
^^^^^^^^^

.. code-block:: haskell

  type Scheduler = {
    currentTime :: () -> Time
    scheduleTask :: Offset -> Delay -> Period -> Task -> ScheduledTask
    relative :: Offset -> Scheduler
    cancel :: ScheduledTask -> void
    cancelAll :: (ScheduledTask -> boolean) -> void
  }

A Scheduler provides the central notion of time for the :ref:`Stream`s in an application.

An application will typically create a single "root" Scheduler so that all Streams share the same underlying time.

.. _Clock:

Clock
^^^^^

.. code-block:: haskell

  type Clock = {
    now :: () -> Time
  }

A Clock represents a source of the current time

.. _Timer:

Timer
^^^^^

.. code-block:: haskell

  type Handle = any -- intentionally opaque handle

  type Timer = {
    now :: () -> Time,
    setTimer :: (() -> any) -> Delay -> Handle,
    clearTimer :: Handle -> void
  }

A Timer abstracts platform time, typically relying on a :ref:`Clock`, and timer scheduling, typically using ``setTimeout``.

.. _Timeline:

Timeline
^^^^^^^^

.. code-block:: haskell

  type TaskRunner = (ScheduledTask) -> any

  type Timeline = {
    add :: ScheduledTask -> void,
    remove :: ScheduledTask -> boolean,
    removeAll :: (ScheduledTask) -> boolean) -> void,
    isEmpty :: () -> boolean,
    nextArrival :: () -> Time,
    runTasks :: Time -> TaskRunner -> void
  }

A Timeline represents a set of :ref:`ScheduledTask`s to be executed at particular times

.. _Task:

Task
^^^^

.. code-block:: haskell

  type Task = Disposable & {
    run :: Time -> void,
    error:: Time -> Error -> void
  }

A Task is any unit of work that can be scheduled for execution on a Scheduler.

ScheduledTask
^^^^^^^^^^^^^

.. code-block:: haskell

  type ScheduledTask = Disposable & {
    task :: Task,
    run :: () -> void,
    error :: Error -> void
  }

A Scheduled Task represents a :ref:`Task` which has been scheduled on a particular :ref:`Scheduler`.  A ``ScheduledTask``'s ``dispose`` method will cancel the Task on the Scheduler on which it was scheduled.

.. _@most/core:

@most/core
----------

.. _Running:

Running
^^^^^^^

.. _runEffects:

runEffects
``````````

.. code-block:: haskell

  runEffects :: Stream a -> Scheduler -> Promise void

Activate an event stream, and consume all its events.

Construction
^^^^^^^^^^^^

.. _empty:

empty
`````

.. code-block:: haskell

  empty :: () -> Stream *

Create a stream containing no events, which ends immediately.::

  empty(): |

.. _never:

never
`````

.. code-block:: haskell

  never :: () -> Stream *

Create a stream containing no events, which never ends.::

  never(): ---->

.. _now:

now
```

.. code-block:: haskell

  now :: a -> Stream a

Create a stream containing a single event at time 0.::

  now(x): x|

.. _at:

at
``

.. code-block:: haskell

  at :: Time -> a -> Stream a

Create a stream containing a single event at a specific time.::

  at(3, x): --x|

.. _throwError:

throwError
``````````

.. code-block:: haskell

  throwError :: Error -> Stream void

Create a stream that fails at time 0 with the provided Error.

This can be useful for functions that need to return a stream and also need to propagate an error.::

  throwError(X): X

Extending
^^^^^^^^^

.. _startWith:

startWith
`````````

.. code-block:: haskell

  startWith :: a -> Stream a -> Stream a

Prepend an event at time 0.::

  stream:               --a-b-c-d->
  startWith(x, stream): x-a-b-c-d->

Note that ``startWith`` *does not* delay other events.  If ``stream`` already contains an event at time 0, then ``startWith`` simply adds another event at time 0--the two will be simultanous, but ordered.  For example::

  stream:                a-b-c-d->
  startWith(x, stream): xa-b-c-d->

Both ``x`` and ``a`` occur at time 0, but ``x`` will be observed before ``a``.

.. _continueWith:

continueWith
````````````

.. code-block:: haskell

  continueWith :: (() -> Stream a) -> Stream a -> Stream a

Replace the end of a stream with another stream.::

  s:                  -a-b-c-d|
  f(): 		                    -1-2-3-4-5->
  continueWith(f, s): -a-b-c-d-1-2-3-4-5->

When ``s`` ends, ``f`` will be called, and must return stream.

Transformation
^^^^^^^^^^^^^^
map
```

.. code-block:: haskell

  map :: (a -> b) -> Stream a -> Stream b

Apply a function to each event value.::

  stream:        -a-b-c-d->
  stream.map(f): -f(a)-f(b)-f(c)-f(d)->

.. code-block:: javascript

  map(x => x + 1, stream)

.. _constant:

constant
````````

.. code-block:: haskell

  constant :: a -> Stream * -> Stream a

Replace each event value with x.::

  stream:              -a-b-c-d->
  constant(x, stream): -x-x-x-x->

.. code-block:: javascript

  constant('tick', periodic(1000))

.. _tap:

tap
```

.. code-block:: haskell

  tap :: (a -> *) -> Stream a -> Stream a

Perform a side-effect for each event in stream.

.. code-block:: javascript

  stream:         -a-b-c-d->
  tap(f, stream): -a-b-c-d->

For each event in stream, f is called, but the value of its result is ignored.
If f fails (ie throws), then the returned stream will also fail. The stream
returned by tap will contain the same events as the original stream.

.. _ap:

ap
```

.. code-block:: haskell

  ap :: Stream (a -> b) -> Stream a -> Stream b

Apply the latest function in a stream of functions to the latest value of another stream.

.. code-block:: javascript

  streamOfFunctions:              --f-----------g---------h--------->
  stream:                         -a-------b---------c---------d---->
  ap(stream, streamOfFunctions.): --f(a)---f(b)-g(b)-g(c)-h(c)-h(d)->

In effect, ap applies a time-varying function to a time-varying value.

.. _scan:

scan
````

.. code-block:: haskell

  scan :: (b -> a -> b) -> b -> Stream a -> Stream b

Incrementally accumulate results, starting with the provided initial value.::

  stream:                           -1-2-3->
  scan((x, y) => x + y, 0, stream): 01-3-6->

.. _loop:

loop
````
.. code-block:: haskell

  loop :: (b -> a -> { seed :: b, value :: c }) -> b -> Stream a -> Stream c

Accumulate results using a feedback loop that emits one value and feeds back another to be used in the next iteration.

It allows you to maintain and update a "state" (aka feedback, aka seed for the next iteration) while emitting a different value. In contrast, scan feeds back and produces the same value.

.. code-block:: javascript

  // Average an array of values
  const average = values =>
  	values.reduce((sum, x) => sum + x, 0) / values.length

  const stream = // ...

  // Emit the simple (ie windowed) moving average of the 10 most recent values
  loop((values, x) => {
  	values.push(x)
  	values = values.slice(-10) // Keep up to 10 most recent
  	const avg = average(values)

  	// Return { seed, value } pair.
  	// seed will feed back into next iteration
  	// value will be propagated
  	return { seed: values, value: avg }
  }, [], stream)

.. _zipArrayValues:

zipArrayValues
``````````````

.. code-block:: haskell

  zipArrayValues :: ((a, b) -> c) -> [a] -> Stream b -> Stream c

Apply a function to the latest event and the array value at the respective index.::

  stream:                             --10---10---10---10---10--->
  array:                              [ 1, 2, 3 ]
  zipArrayValues(add, array, stream): --11---12---13|

The resulting stream will contain the same number of events as the input stream,
or array.length events, whichever is less.

.. _withArrayValues:

withArrayValues
```````````````

.. code-block:: haskell

  withArrayValues :: [a] -> Stream b -> Stream a

Replace each event value with the array value at the respective index.::

  array:                          [ 1, 2, 3 ]
  stream:                         --x--x--x--x--x-->
  withArrayValues(array, stream): --1--2--3|

The resulting stream will contain the same number of events as the input stream,
or array.length events, whichever is less.

Flattening
^^^^^^^^^^

.. _switchLatest:

switchLatest
````````````

.. code-block:: haskell

  switchLatest :: Stream (Stream a) -> Stream a

Given a higher-order stream, return a new stream that adopts the behavior of
(ie emits the events of) the most recent inner stream.::

  s:                    -a-b-c-d-e-f->
  t:                    -1-2-3-4-5-6->
  stream:               -s-----t----->
  switchLatest(stream): -a-b-c-4-5-6->

.. _join:

join
````

.. code-block:: haskell

  join :: Stream (Stream a) -> Stream a

Given a higher-order stream, return a new stream that merges all the inner streams as they arrive.::

  s:             ---a---b---c---d-->
  t:             -1--2--3--4--5--6->
  stream:        -s------t--------->
  join(stream):  ---a---b--4c-5-d6->

.. _chain:

chain
`````

.. code-block:: haskell

  chain :: (a -> Stream b) -> Stream a -> Stream b

Transform each event in ``stream`` into a stream, and then merge it into the resulting stream. Note that ``f`` must return a stream.::

  stream:            -a----b----c|
  f(a):               1--2--3|
  f(b):                    1----2----3|
  f(c):                           1-2-3|
  chain(f, stream):  -1--2-13---2-1-233|

.. _concatMap:

concatMap
`````````

.. code-block:: haskell

  concatMap :: (a -> Stream b) -> Stream a -> Stream b

Transform each event in stream into a stream, and then concatenate it onto the
end of the resulting stream. Note that f must return a stream.

The mapping function f is applied lazily. That is, f is called only once it is
time to concatenate a new stream.::

  stream:                -a----b----c|
  f(a):                   1--2--3|
  f(b):                        1----2----3|
  f(c):                               1-2-3|
  concatMap(f, stream):  -1--2--31----2----31-2-3|
  f called lazily:        ^      ^          ^

Note the difference between concatMap and ref:`chain`: concatMap concatenates, while
chain merges.

.. _mergeConcurrently:

mergeConcurrently
`````````````````

.. code-block:: haskell

  mergeConcurrently :: int -> Stream (Stream a) -> Stream a

Given a higher-order stream, return a new stream that merges inner streams as
they arrive up to the specified concurrency. Once concurrency number of streams
are being merged, newly arriving streams will be merged after an existing one
ends.::

  s:                            --a--b--c--d--e-->
  t:                            --x------y|
  u:                            -1--2--3--4--5--6>
  stream:                       -s--t--u--------->
  mergeConcurrently(2, stream): --a--b--cy4d-5e-6>

Note that u is only merged after t ends, due to the concurrency level of 2.

Note also that ``mergeConcurrently(Infinity, stream)`` is equivalent to ``join(stream)``.

To control concurrency, mergeConcurrently must maintain an internal queue of
newly arrived streams. If new streams arrive faster than the concurrency level
allows them to be merged, the internal queue will grow infinitely.

.. _mergeMapConcurrently:

mergeMapConcurently
```````````````````

.. code-block:: haskell

  mergeMapConcurently :: (a -> Stream b) -> int -> Stream a -> Stream b

Lazily applies a function ``f`` to each event on a stream, merging them into the
resulting stream at the specified concurrency. Once concurrency number of streams
are being merged, newly arriving streams will be merged after an existing one
ends.::

  stream:                             --ab--c----d----->
  f(a):                               -1-2-3|
  f(b):                               -4-5-6----------->
  f(c):                               -7--------------->
  f(d):                               -1-2-3-4-5-6-7-8->
  mergeMapConcurently(f, 2, stream) : ---142536-7------>

Note that ``f(c)`` is only merged after ``f(a)`` ends.

Also note that ``f`` will not get called with ``d`` until either ``f(b)`` or
``f(c)`` ends.

To control concurrency, mergeMapConcurrently must maintain an internal queue of
newly arrived streams. If new streams arrive faster than the concurrency level
allows them to be merged, the internal queue will grow infinitely.

Merging
^^^^^^^

.. _merge:

merge
`````

.. code-block:: haskell

  merge :: Stream a -> Stream a -> Stream a

Create a new stream containing events from two streams.::

  s1:            -a--b----c--->
  s2:            --w---x-y--z->
  merge(s1, s2): -aw-b-x-yc-z->

Merging creates a new stream containing all events from the two original streams without affecting the time of the events. You can think of the events from the input streams simply being interleaved into the new, merged stream. A merged stream ends when all of its input streams have ended.

.. _mergeArray:

mergeArray
``````````

.. code-block:: haskell

  mergeArray :: [ (Stream a) ] -> Stream a

Array form of :ref:`merge`. Create a new Stream containing all events from all streams in the array.::

  s1:                       -a--b----c---->
  s2:                       --w---x-y--z-->
  s3:                       ---1---2----3->
  mergeArray([s1, s2, s3]): -aw1b-x2yc-z3->

.. _combine:

combine
```````

.. code-block:: haskell

  combine :: (a -> b -> c) -> Stream a -> Stream b -> Stream c

Apply a function to the most recent event from each stream when a new event arrives on any stream.::

  s1:                   -0--1----2--->
  s2:                   --3---4-5--6->
  combine(add, s1, s2): --3-4-5-67-8->

Note that ``combine`` waits for at least one event to arrive on all input streams before it produces any events.

.. _combineArray:

combineArray
````````````

.. code-block:: haskell

  combineArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

Array form of :ref:`combine`. Apply a function to the most recent event from all streams when a new event arrives on any stream.::

  s1:                               -0--1----2->
  s2:                               --3---4-5-->
  s3:                               ---2---1--->
  combineArray(add3, [s1, s2, s3]): ---56-7678->

.. _zip:

zip
```

.. code-block:: haskell

  zip :: (a -> b -> c) -> Stream a -> Stream b -> Stream c

Apply a function to corresponding pairs of events from the inputs streams.::

  s1:               -1--2--3--4->
  s2:               -1---2---3---4->
  zip(add, s1, s2): -2---4---6---8->

Zipping correlates by *index* corresponding events from two input streams. Note that zipping a "fast" stream and a "slow" stream will cause buffering. Events from the fast stream must be buffered in memory until an event at the corresponding index arrives on the slow stream.

A zipped stream ends when any one of its input streams ends.

.. _zipArray:

zipArray
````````

.. code-block:: haskell

  zipArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

Array form of :ref:`zip`.  Apply a function to corresponding events from all the inputs streams.::

  s1:                           -1-2-3---->
  s2:                           -1--2--3-->
  s2:                           --1--2--3->
  zipArray(add3, [s1, s2, s3]): --3--6--9->

sample
``````

.. code-block:: haskell

  sample :: ((a, b) -> c) -> Stream a -> Stream b -> Stream c

For each event in a sampler stream, apply a function to combine it with the most recent event in another stream. The resulting stream will contain the same number of events as the sampler stream.::

  s1:                       -1--2--3--4--5->
  sampler:                  -1-----2-----3->
  sample(sum, sampler, s1): -2-----5-----8->

  s1:                       -1-----2-----3->
  sampler:                  -1--2--3--4--5->
  sample(sum, sampler, s1): -2--3--5--6--8->

Note ``sample`` produces a value only when an event arrives on the sampler

Filtering
^^^^^^^^^

.. _filter:

filter
``````

.. code-block:: haskell

  filter :: (a -> bool) -> Stream a -> Stream a

Retain only events for which a predicate is truthy.::

  stream:               -1-2-3-4->
  filter(even, stream): ---2---4->

.. _skipRepeats:

skipRepeats
```````````

.. code-block:: haskell

  skipRepeats :: Stream a -> Stream a

Remove adjacent repeated events.::

  stream:              -1-2-2-3-4-4-5->
  skipRepeats(stream): -1-2---3-4---5->

Note that ``===`` is used to identify repeated items.  To use a different comparison, use :ref:`skipRepeatsWith`

.. _skipRepeatsWith:

skipRepeatsWith
```````````````

.. code-block:: haskell

  skipRepeatsWith :: ((a, a) -> bool) -> Stream a -> Stream a

Remove adjacent repeated events, using the provided equality function to compare adjacent events.::

  stream:                                    -a-b-B-c-D-d-e->
  skipRepeatsWith(equalsIgnoreCase, stream): -a-b---c-D---e->

The equals function should return truthy if the two value are equal, or falsy if they are not equal.

.. _slice:

Slicing
^^^^^^^

slice
`````

.. code-block:: haskell

  slice :: int -> int -> Stream a -> Stream a

Keep only events in a range, where start <= index < end, and index is the ordinal index of an event in stream.::

  stream:              -a-b-c-d-e-f->
  slice(1, 4, stream): ---b-c-d|

  stream:              -a-b-c|
  slice(1, 4, stream): ---b-c|

If stream contains fewer than start events, the returned stream will be empty.

.. _take:

take
````

.. code-block:: haskell

  take :: int -> Stream a -> Stream a

Keep at most the first n events from stream.::

  stream:          -a-b-c-d-e-f->
  take(3, stream): -a-b-c|

  stream:          -a-b|
  take(3, stream): -a-b|

If stream contains fewer than n events, the returned stream will be effectively equivalent to stream.

.. _skip:

skip
````

.. code-block:: haskell

  skip :: int -> Stream a -> Stream a

Discard the first n events from stream.::

  stream:          -a-b-c-d-e-f->
  skip(3, stream): -------d-e-f->

  stream:          -a-b-c-d-e|
  skip(3, stream): -------d-e|

  stream:          -a-b-c|
  skip(3, stream): ------|

If stream contains fewer than n events, the returned stream will be empty.

.. _takeWhile:

takeWhile
`````````

.. code-block:: haskell

  takeWhile :: (a -> bool) -> Stream a -> Stream a

Keep all events until predicate returns false, and discard the rest.::

  stream:                  -2-4-5-6-8->
  takeWhile(even, stream): -2-4-|

.. _skipWhile:

skipWhile
`````````

.. code-block:: haskell

  skipWhile :: (a -> bool) -> Stream a -> Stream a

Discard all events until predicate returns false, and keep the rest.::

  stream:                  -2-4-5-6-8->
  skipWhile(even, stream): -----5-6-8->

.. _skipAfter:

skipAfter
`````````

.. code-block:: haskell

  skipAfter :: (a -> bool) -> Stream a -> Stream a

Discard all events after the first event for which predicate returns true.::

  stream:                  -1-2-3-4-5-6-8->
  skipAfter(even, stream): -1-2|

.. _until:

until
`````

.. code-block:: haskell

  until :: Stream * -> Stream a -> Stream a

Keep all events in one stream until the first event occurs in another.::

  stream:                   -a-b-c-d-e-f->
  endSignal:                ------z->
  until(endSignal, stream): -a-b-c|

Note that if endSignal has no events, then the returned stream will be effectively equivalent to the original.

.. code-block:: javascript

  // Keep only 3 seconds of events, discard the rest
  until(at(3000, null), stream)

.. _since:

since
`````

.. code-block:: haskell

  since :: Stream * -> Stream a -> Stream a

Discard all events in one stream until the first event occurs in another.::

  stream:                     -a-b-c-d-e-f->
  startSignal:                ------z->
  since(startSignal, stream): -------d-e-f->

Note that if startSignal is has no events, then the returned stream will be effectively equivalent to :ref:`never`.

.. code-block:: javascript

  // Discard events for 3 seconds, keep the rest
  since(at(3000, null), stream)

.. _during:

during
``````

.. code-block:: haskell

  during :: Stream (Stream *) -> Stream a -> Stream a

Keep events that occur during a time window defined by a higher-order stream.::

  stream:                     -a-b-c-d-e-f-g->
  timeWindow:                 -----s
  s:                                -----x
  during(timeWindow, stream): -----c-d-e-|

This is similar to :ref:`slice`, but uses time rather than indices to "slice" the stream.

.. code-block:: javascript

  // A time window that:
  // 1. starts at time = 1 second
  // 2. ends at time = 6 seconds (1 second + 5 seconds)
  const timeWindow = at(1000, at(5000, null))

  // 1. discard events for 1 second, then
  // 2. keep events for 5 more seconds, then
  // 3. discard all subsequent events
  during(timeWindow, stream)

.. _delay:

delay
`````

.. code-block:: haskell

  delay :: int -> Stream a -> Stream a

Timeshift a stream by a number of milliseconds.::

  stream:           -a-b-c-d->
  delay(1, stream): --a-b-c-d->
  delay(5, stream): ------a-b-c-d->

Delaying a stream timeshifts all the events by the same amount. It doesn't change the time *between* events.

.. _throttle:

throttle
````````

.. code-block:: haskell

  throttle :: int -> Stream a -> Stream a

Limit the rate of events to at most one per a number of milliseconds.::

  stream:               abcd----abcd---->
  throttle(2, stream):  a-c-----a-c----->

In contrast to debounce, throttle simply drops events that occur "too often", whereas debounce waits for a "quiet period".

.. _debounce:

debounce
````````

.. code-block:: haskell

  debounce :: int -> Stream a -> Stream a

Wait for a burst of events to subside and keep only the last event in the burst.::

  stream:              abcd----abcd---->
  debounce(2, stream): -----d-------d-->

If the stream ends while there is a pending debounced event (e.g. via until), the pending event will occur just before the stream ends.  For example::

  s1:                         abcd----abcd---->
  s2:                         ------------|
  debounce(2, until(s2, s1)): -----d------d|

Debouncing can be extremely useful when dealing with bursts of similar events, for example, debouncing keypress events before initiating a remote search query in a browser application.

.. code-block:: javascript

  const searchInput = document.querySelector('[name="search-text"]');
  const searchText = most.fromEvent('input', searchInput);

  // The current value of the searchInput, but only
  // after the user stops typing for 500 millis
  map(e => e.target.value, debounce(500, searchText))

Dealing with Promises
^^^^^^^^^^^^^^^^^^^^^

.. _fromPromise:

fromPromise
```````````

.. code-block:: haskell

  fromPromise :: Promise a -> Stream a

Create a stream containing a promise's value.::

  promise:              ----a
  fromPromise(promise): ----a|

If the promise rejects, the stream will be in an error state with the promise's rejection reason as its error. See :ref:`recoverWith` for error recovery.

.. _awaitPromises:

awaitPromises
`````````````

.. code-block:: haskell

  awaitPromises :: Stream (Promise a) -> Stream a

Turn a stream of promises into a stream containing the promises' values.::

  promise p:             ---1
  promise q:             ------2
  promise r:             -3
  stream:                -p---q---r->
  awaitPromises(stream): ---1--2--3->

Note that order is always preserved, regardless of promise fulfillment order.

To create a stream that merges promises in fulfillment order, use ``chain(fromPromise, stream)``. Note the difference::

  promise p:                    --1
  promise q:                    --------2
  promise r:                    ------3
  stream:                       -p-q-r----->
  chain(fromPromise, stream):   --1---3-2-->
  awaitPromises(stream):        --1-----23->

If a promise rejects, the stream will be in an error state with the rejected promise's reason as its error. See recoverWith for error recovery. For example::

  promise p:             ---1
  promise q:             ------X
  promise r:             -3
  stream:                -p---q---r->
  awaitPromises(stream): ---1--X

Handling Errors
^^^^^^^^^^^^^^^

.. _recoverWith:

recoverWith
```````````

.. code-block:: haskell

  recoverWith :: (Error -> Stream a) -> Stream a -> Stream a

Recover from a stream failure by calling a function to create a new stream.::

  s:                 -a-b-c-X
  f(X):                     d-e-f->
  recoverWith(f, s): -a-b-c-d-e-f->

When ``s`` fails with an error, ``f`` will be called with the error. f must return a new stream to replace the error.

Tasks
^^^^^

Helper functions for creating :ref:`Task` s to propagate events.

.. _propagateTask:

propagateTask
`````````````

.. code-block:: haskell

  propagateTask :: (Time -> a -> Sink a -> *) -> a -> Sink a -> Task

Create a Task to propagate a value to a Sink.  When the task executes, the provided function will receive the current time (from the scheduler on which it was scheduled), and the provided value and Sink.  The Task can use the :ref:`Sink` to propagate the value in whatever way it chooses, for example, as an event or an error, or could choose not to propagate the event based on some condition, etc.

.. _propagateEventTask:

propagateEventTask
``````````````````

.. code-block:: haskell

  propagateEventTask :: a -> Sink a -> Task

Create a :ref:`Task` that can be scheduled to propagate an event value to a :ref:`Sink`.  When the task executes, it will call the Sink's ``event`` method with the current time (from the scheduler on which it was scheduled) and the value.

.. _propagateEndTask:

propagateEndTask
````````````````

.. code-block:: haskell

  propagateEndTask :: Sink * -> Task

Create a :ref:`Task` that can be scheduled to propagate end to a :ref:`Sink`.  When the task executes, it will call the Sink's ``end`` method with the current time (from the scheduler on which it was scheduled).

.. _propagateErrorTask:

propagateErrorTask
``````````````````

.. code-block:: haskell

  propagateErrorTask :: Error -> Sink * -> Task

Create a :ref:`Task` that can be scheduled to propagate an error to a :ref:`Sink`.  When the task executes, it will call the Sink's ``error`` method with the current time (from the scheduler on which it was scheduled) and the error.

.. _@most/scheduler:

@most/scheduler
---------------

.. _Reading Current Time:

Reading Current Time
^^^^^^^^^^^^^^^^^^^^

.. _currentTime:

currentTime
```````````

.. code-block:: haskell

  currentTime :: Scheduler -> Time

Read the current :ref:`Time` from a :ref:`Scheduler`

.. _Scheduling Tasks:

Scheduling Tasks
^^^^^^^^^^^^^^^^

.. _Scheduler-asap:

asap
````

.. code-block:: haskell

  asap :: Task -> Scheduler -> ScheduledTask

Schedule a Task to execute as soon as possible, but still asynchronously.

.. _Scheduler-delay:

delay
`````

.. code-block:: haskell

  delay :: Delay -> Task -> Scheduler -> ScheduledTask

Schedule a Task to execute after a specified millisecond Delay.

.. _Scheduler-periodic:

periodic
````````

.. code-block:: haskell

  periodic :: Period -> Task -> Scheduler -> ScheduledTask

Schedule a Task to execute periodically with the specified Period.

.. _Canceling Tasks:

Canceling Tasks
^^^^^^^^^^^^^^^

.. _Scheduler-cancelTask:

cancelTask
``````````

.. code-block:: haskell

  cancelTask :: ScheduledTask -> void

Cancel all future scheduled executions of a ScheduledTask.

.. _Scheduler-cancelAllTasks:

cancelAllTasks
``````````````

.. code-block:: haskell

  cancelAllTasks :: (ScheduledTask -> boolean) -> Scheduler -> void

Cancel all future scheduled executions of all ScheduledTasks for which the provided predicate is true.

Creating a Scheduler
^^^^^^^^^^^^^^^^^^^^

.. _newScheduler:

newScheduler
````````````

.. code-block:: haskell

  newScheduler :: Timer -> Timeline -> Scheduler

Create a new scheduler that uses the provided :ref:`Timer` and :ref:`Timeline` for scheduling tasks.

.. _newDefaultScheduler:

newDefaultScheduler
```````````````````

.. code-block:: haskell

  newDefaultScheduler :: () -> Scheduler

Create a new Scheduler that uses a default platform-specific :ref:`Timer` and new, empty :ref:`Timeline`.


.. _Scheduler-relative:

schedulerRelativeTo
```````````````````

.. code-block:: haskell

  schedulerRelativeTo :: Offset -> Scheduler -> Scheduler

Create a new Scheduler with origin (i.e. zero time) at the specified :ref:`Offset <Time>` of the provided Scheduler.

When implementing higher-order stream combinators, this function can be used to create a Scheduler with local time for each "inner" stream.

.. code-block:: javascript

  currentTime(scheduler) //> 1637
  const relativeScheduler = schedulerRelativeTo(1234, scheduler)
  currentTime(relativeScheduler) //> 0

  // ... later ...

  currentTime(scheduler) //> 3929
  currentTime(relativeScheduler) //> 2292

Timer, Timeline, and Clock
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. _newClockTimer:

newClockTimer
`````````````

.. code-block:: haskell

  newClockTimer :: Clock -> Timer

Create a new :ref:`Timer` that uses the provided :ref:`Clock` as a source of the current :ref:`Time`.

.. _newTimeline:

newTimeline
```````````

.. code-block:: haskell

  newTimeline :: () -> Timeline

Create an empty :ref:`Timeline`

.. _newPlatformClock:

newPlatformClock
````````````````

.. code-block:: haskell

  newPlatformClock :: () -> Clock

Create a new :ref:`Clock` by autodetecting the best platform-specific source of :ref:`Time`.  On modern browsers, uses `performance.now`, and on Node, `process.hrtime`.  If neither is available, falls back to `Date.now`.

.. _newPerformanceClock:

newPerformanceClock
```````````````````

.. code-block:: haskell

  newPerformanceClock :: () -> Clock

Create a new :ref:`Clock` using`performance.now`.

.. _newHRTimeClock:

newHRTimeClock
``````````````

.. code-block:: haskell

  newHRTimeClock :: () -> Clock

Create a new :ref:`Clock` using`process.hrtime`.

.. _newDateClock:

newDateClock
````````````

.. code-block:: haskell

  newDateClock :: () -> Clock

Create a new :ref:`Clock` using`Date.now`. Note that a Clock using `Date.now` is not guaranteed to be monotonic, and is subject to system clock changes, e.g. NTP can change your system clock!

.. _clockRelativeTo:

clockRelativeTo
```````````````

.. code-block:: haskell

  clockRelativeTo :: Clock -> Clock

Create a new :ref:`Clock` whose origin is at the *current time* (at the instant of calling ``clockRelativeTime``) of the provided Clock.

.. _@most/disposable:

@most/disposable
----------------

.. _Creating Disposables:

Creating Disposables
^^^^^^^^^^^^^^^^^^^^

.. _disposeNone:

disposeNone
```````````

.. code-block:: haskell

  disposeNone :: () -> Disposable

Create a no-op :ref:`Disposable`.

.. _ disposeWith:

disposeWith
```````````

.. code-block:: haskell

  disposeWith :: (a -> void) -> a -> Disposable

Create a :ref:`Disposable` which, when disposed will call the provided function, passing the provided value.

.. _disposeOnce:

disposeOnce
```````````

.. code-block:: haskell

  disposeOnce :: Disposable -> Disposable

Wrap a :ref:`Disposable` so the underlying Disposable will only be disposed once, even if the returned Disposable is disposed multiple times.

.. _disposeBoth:

disposeBoth
```````````

.. code-block:: haskell

  disposeBoth :: Disposable -> Disposable -> Disposable

Combine two :ref:`Disposable`s into a single Disposable which will dispose both.

.. _disposeAll:

disposeAll
``````````

.. code-block:: haskell

  disposeAll :: [Disposable] -> Disposable

Combine an array of :ref:`Disposable`s into a single Disposable which will dispose all the Disposables in the array.

.. _Disposing Disposables:

Disposing Disposables
^^^^^^^^^^^^^^^^^^^^^

.. _dispose:

dispose
```````

.. code-block:: haskell

  dispose :: Disposable -> void

Dispose the provided :ref:`Disposable`.  Note that ``dispose`` does not catch exceptions.  If the Disposable throws, the exception will propagate out of ``dispose``.

.. _tryDispose:

tryDispose
``````````

.. code-block:: haskell

  tryDispose :: Time -> Disposable -> Sink * -> void

Attempt to dispose the provided :ref:`Disposable`.  If the Disposable throws an exception, catch and propagate it to the provided :ref:`Sink` with the provided :ref:`Time`.

Note: Only an exception thrown by the Disposable will be caught.  If the act of propagating an error to the Sink throws, that exception *will not* be caught.
