API
===

.. _types:

Types
-----

.. code-block:: haskell

  type Time = number

  type Stream a = {
    run :: Sink a -> Scheduler -> Disposable
  }

  type Sink a = {
    event :: Time -> a -> void
    error :: Time -> Error -> void
    end :: Time -> void
  }

  type Disposable = {
    dispose:: () -> void
  }

  type Task = Disposable & {
    run :: Time -> void
    error:: Time -> Error -> void
  }

Running
-------

.. _runEffects:

runEffects
^^^^^^^^^^

.. code-block:: haskell

  runEffects :: Stream a -> Scheduler -> Promise void

Activate an event stream, and consume all its events.

Construction
------------

.. _empty:

empty
^^^^^

.. code-block:: haskell

  empty :: () -> Stream *

Create a stream containing no events, which ends immediately.::

  empty(): |

.. _never:

never
^^^^^

.. code-block:: haskell

  never :: () -> Stream *

Create a stream containing no events, which never ends.::

  never(): ---->

.. _now:

now
^^^

.. code-block:: haskell

  now :: a -> Stream a

Create a stream containing a single event at time 0.::

  now(x): x|

.. _at:

at
^^

.. code-block:: haskell

  at :: Time -> a -> Stream a

Create a stream containing a single event at a specific time.::

  at(3, x): --x|

.. _throwError:

throwError
^^^^^^^^^^

.. code-block:: haskell

Create a stream that fails at time 0 with the provided Error. ::

  throwError :: Error -> Stream void

This can be useful for functions that need to return a stream and also need to propagate an error.::

  throwError(X): X

.. _startWith:

startWith
^^^^^^^^^

.. code-block:: haskell

  startWith :: a -> Stream a -> Stream a

Prepend an event at time 0.::

  stream:               --a-b-c-d->
  startWith(x, stream): x-a-b-c-d->

Note that ``startWith`` *does not* delay other events.  If ``stream`` already contains an event at time 0, then ``startWith`` simply adds another event at time 0--the two will be simultanous, but ordered.  For example::

  stream:                a-b-c-d->
  startWith(x, stream): xa-b-c-d->

Both ``x`` and ``a`` occur at time 0, but ``x`` will be observed before ``a``.

Transformation
--------------

map
^^^

.. code-block:: haskell

  map :: (a -> b) -> Stream a -> Stream b

Apply a function to each event value.::

  stream:        -a-b-c-d->
  stream.map(f): -f(a)-f(b)-f(c)-f(d)->

.. code-block:: javascript

  map(x => x + 1, stream)

.. _constant:

constant
^^^^^^^^

.. code-block:: haskell

  constant :: a -> Stream * -> Stream a

Replace each event value with x.::

  stream:              -a-b-c-d->
  constant(x, stream): -x-x-x-x->

.. code-block:: javascript

  constant('tick', periodic(1000))

.. _tap:

tap
^^^

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
^^^

.. code-block:: haskell

  ap :: Stream (a -> b) -> Stream a -> Stream b

Apply the latest function in a stream of functions to the latest value in stream.

.. code-block:: javascript

  streamOfFunctions:              --f---------g--------h------>
  stream:                         -a-------b-------c-------d-->
  ap(stream, streamOfFunctions.): --fa-----fb-gb---gc--hc--hd->

In effect, ap applies a time-varying function to a time-varying value.

.. _scan:

scan
^^^^

.. code-block:: haskell

  scan :: (b -> a -> b) -> b -> Stream a -> Stream b

Incrementally accumulate results, starting with the provided initial value.::

  stream:                           -1-2-3->
  scan((x, y) => x + y, 0, stream): 01-3-6->

.. _loop:

loop
^^^^

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
^^^^^^^^^^^^^^

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
^^^^^^^^^^^^^^^

.. code-block:: haskell

  withArrayValues :: [a] -> Stream b -> Stream a

Replace each event value with the array value at the respective index.::

  array:                          [ 1, 2, 3 ]
  stream:                         --x--x--x--x--x-->
  withArrayValues(array, stream): --1--2--3|

The resulting stream will contain the same number of events as the input stream,
or array.length events, whichever is less.

.. _chain:

chain
^^^^^

.. code-block:: haskell

  chain :: (a -> Stream b) -> Stream a -> Stream b

Transform each event in ``stream`` into a stream, and then merge it into the resulting stream. Note that ``f`` must return a stream.::

  stream:            -a----b----c|
  f(a):               1--2--3|
  f(b):                    1----2----3|
  f(c):                           1-2-3|
  chain(f, stream):  -1--2-13---2-1-233|

.. _join:

join
^^^^

.. code-block:: haskell

  join :: Stream (Stream a) -> Stream a

Given a higher-order stream, return a new stream that merges all the inner streams as they arrive.::

  s:             ---a---b---c---d-->
  t:             -1--2--3--4--5--6->
  stream:        -s------t--------->
  join(stream):  ---a---b--4c-5-d6->

concatMap :: (a -> Stream b) -> Stream a -> Stream b

mergeConcurrently :: int -> Stream (Stream a) -> Stream a

mergeMapConcurently :: (a -> Stream b) -> int -> Stream a -> Stream b

.. _merge:

merge
^^^^^

.. code-block:: haskell

  merge :: Stream a -> Stream a -> Stream a

Create a new stream containing events from two streams.::

  s1:            -a--b----c--->
  s2:            --w---x-y--z->
  merge(s1, s2): -aw-b-x-yc-z->

Merging creates a new stream containing all events from the two original streams without affecting the time of the events. You can think of the events from the input streams simply being interleaved into the new, merged stream. A merged stream ends when all of its input streams have ended.

.. _mergeArray:

mergeArray
^^^^^^^^^^

.. code-block:: haskell

  mergeArray :: [ (Stream a) ] -> Stream a

Array form of :ref:`merge`. Create a new Stream containing all events from all streams in the array.

  s1:                       -a--b----c---->
  s2:                       --w---x-y--z-->
  s3:                       ---1---2----3->
  mergeArray([s1, s2, s3]): -aw1b-x2yc-z3->

.. _combine:

combine
^^^^^^^

.. code-block:: haskell

  combine :: (a -> b -> c) -> Stream a -> Stream b -> Stream c

Apply a function to the most recent event from each stream when a new event arrives on any stream.::

  s1:                   -0--1----2--->
  s2:                   --3---4-5--6->
  combine(add, s1, s2): --3-4-5-67-8->

Note that ``combine`` waits for at least one event to arrive on all input streams before it produces any events.

.. _combineArray:

combineArray
^^^^^^^^^^^^

.. code-block:: haskell

  combineArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

Array form of :ref:`combine`. Apply a function to the most recent event from all streams when a new event arrives on any stream.::

  s1:                               -0--1----2->
  s2:                               --3---4-5-->
  s3:                               ---2---1--->
  combineArray(add3, [s1, s2, s3]): ---56-7678->

.. _zip:

zip
^^^

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
^^^^^^^^

.. code-block:: haskell

  zipArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

Array form of :ref:`zip`.  Apply a function to corresponding events from all the inputs streams.::

  s1:                           -1-2-3---->
  s2:                           -1--2--3-->
  s2:                           --1--2--3->
  zipArray(add3, [s1, s2, s3]): --3--6--9->

sample :: ((a, b) -> c) -> Stream a -> Stream b -> Stream c

switchLatest :: Stream (Stream a) -> Stream a

Filtering
---------

.. _filter:

filter
^^^^^^

.. code-block:: haskell

  filter :: (a -> bool) -> Stream a -> Stream a

Retain only events for which a predicate is truthy.

  stream:               -1-2-3-4->
  filter(even, stream): ---2---4->

.. _skipRepeats:

skipRepeats
^^^^^^^^^^^

.. code-block:: haskell

  skipRepeats :: Stream a -> Stream a

Remove adjacent repeated events.::

  stream:              -1-2-2-3-4-4-5->
  skipRepeats(stream): -1-2---3-4---5->

Note that ``===`` is used to identify repeated items.  To use a different comparison, use :ref:`skipRepeatsWith`

.. _skipRepeatsWith:

skipRepeatsWith
^^^^^^^^^^^^^^^

.. code-block:: haskell

  skipRepeatsWith :: ((a, a) -> bool) -> Stream a -> Stream a

Remove adjacent repeated events, using the provided equality function to compare adjacent events.::

  stream:                                    -a-b-B-c-D-d-e->
  skipRepeatsWith(equalsIgnoreCase, stream): -a-b---c-D---e->

The equals function should return truthy if the two value are equal, or falsy if they are not equal.

.. _slice:

slice
^^^^^

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
^^^^

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
^^^^

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
^^^^^^^^^

.. code-block:: haskell

  takeWhile :: (a -> bool) -> Stream a -> Stream a

Keep all events until predicate returns false, and discard the rest.::

  stream:                  -2-4-5-6-8->
  takeWhile(even, stream): -2-4-|

.. _skipWhile:

skipWhile
^^^^^^^^^

.. code-block:: haskell

  skipWhile :: (a -> bool) -> Stream a -> Stream a

Discard all events until predicate returns false, and keep the rest.::

  stream:                  -2-4-5-6-8->
  skipWhile(even, stream): -----5-6-8->

.. _skipAfter:

skipAfter
^^^^^^^^^

.. code-block:: haskell

  skipAfter :: (a -> bool) -> Stream a -> Stream a

Discard all events after the first event for which predicate returns true.::

  stream:                  -1-2-3-4-5-6-8->
  skipAfter(even, stream): -1-2|

.. _until:

until
^^^^^

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
^^^^^

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
^^^^^^

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
^^^^^

.. code-block:: haskell

  delay :: int -> Stream a -> Stream a

Timeshift a stream by a number of milliseconds.::

  stream:           -a-b-c-d->
  delay(1, stream): --a-b-c-d->
  delay(5, stream): ------a-b-c-d->

Delaying a stream timeshifts all the events by the same amount. It doesn't change the time *between* events.

.. _throttle:

throttle
^^^^^^^^

  throttle :: int -> Stream a -> Stream a

Limit the rate of events to at most one per a number of milliseconds.::

  stream:               abcd----abcd---->
  throttle(2, stream):  a-c-----a-c----->

In contrast to debounce, throttle simply drops events that occur "too often", whereas debounce waits for a "quiet period".

.. _debounce:

debounce
^^^^^^^^

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

.. _fromPromise:

fromPromise
^^^^^^^^^^^

.. code-block:: haskell

  fromPromise :: Promise a -> Stream a

Create a stream containing a promise's value.::

  promise:              ----a
  fromPromise(promise): ----a|

If the promise rejects, the stream will be in an error state with the promise's rejection reason as its error. See :ref:`recoverWith` for error recovery.

.. _awaitPromises:

awaitPromises
^^^^^^^^^^^^^

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

.. _continueWith:

continueWith
^^^^^^^^^^^^

.. code-block:: haskell

  continueWith :: (() -> Stream a) -> Stream a -> Stream a

Replace the end of a stream with another stream.::

  s:                  -a-b-c-d|
  f(): 		                    -1-2-3-4-5->
  continueWith(f, s): -a-b-c-d-1-2-3-4-5->

When ``s`` ends, ``f`` will be called, and must return stream.

.. _recoverWith:

recoverWith
^^^^^^^^^^^

.. code-block:: haskell

  recoverWith :: (Error -> Stream a) -> Stream a -> Stream a

Recover from a stream failure by calling a function to create a new stream.::

  s:                 -a-b-c-X
  f(X):                     d-e-f->
  recoverWith(f, s): -a-b-c-d-e-f->

When ``s`` fails with an error, ``f`` will be called with the error. f must return a new stream to replace the error.

Scheduling
----------

.. _propagateTask:

propagateTask
^^^^^^^^^^^^^

.. code-block:: haskell

  propagateTask :: (Time -> a -> Sink a -> *) -> a -> Sink a -> Task

Create a Task to propagate a value to a Sink.  When the task executes, the provided function will receive the current time (from the scheduler on which it was scheduled), and the provided value and Sink.  The Task can use the :ref:`Sink API <types>` to propagate the value in whatever way it chooses, for example, as an event or an error, or could choose not to propagate the event based on some condition, etc.

.. _propagateEventTask:

propagateEventTask
^^^^^^^^^^^^^^^^^^

.. code-block:: haskell

  propagateEventTask :: a -> Sink a -> Task

Create a :ref:`Task <types>` that can be scheduled to propagate an event value to a :ref:`Sink <types>`.  When the task executes, it will call the Sink's ``event`` method with the current time (from the scheduler on which it was scheduled) and the value.

.. _propagateEndTask:

propagateEndTask
^^^^^^^^^^^^^^^^

.. code-block:: haskell

  propagateEndTask :: Sink * -> Task

Create a :ref:`Task <types>` that can be scheduled to propagate end to a :ref:`Sink <types>`.  When the task executes, it will call the Sink's ``end`` method with the current time (from the scheduler on which it was scheduled).

.. _propagateErrorTask:

propagateErrorTask
^^^^^^^^^^^^^^^^^^

.. code-block:: haskell

  propagateErrorTask :: Error -> Sink * -> Task

Create a :ref:`Task <types>` that can be scheduled to propagate an error to a :ref:`Sink <types>`.  When the task executes, it will call the Sink's ``error`` method with the current time (from the scheduler on which it was scheduled) and the error.
