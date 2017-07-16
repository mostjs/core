API
===

Types
-----

Stream
^^^^^^

.. code-block:: haskell

  type Stream = {
    run :: Sink a -> Scheduler -> Disposable
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

tap :: (a -> *) -> Stream a -> Stream a

ap :: Stream (a -> b) -> Stream a -> Stream b

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

zipArrayValues :: ((a, b) -> c) -> [a] -> Stream b -> Stream c

withArrayValues :: [a] -> Stream b -> Stream a

chain :: (a -> Stream b) -> Stream a -> Stream b

join :: Stream (Stream a) -> Stream a

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

.. _combineArray:

combineArray
^^^^^^^^^^^^

.. code-block:: haskell

  combineArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

.. _zip:

zip
^^^

.. code-block:: haskell

  zip :: (a -> b -> c) -> Stream a -> Stream b -> Stream c

.. _zipArray:

zipArray
^^^^^^^^

.. code-block:: haskell

  zipArray :: ((a, b, ...) -> z) -> [ Stream a, Stream b, ... ] -> Stream z

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

.. _take:

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

fromPromise :: Promise a -> Stream a

awaitPromises :: Stream (Promise a) -> Stream a

continueWith :: (() -> Stream a) -> Stream a -> Stream a

recoverWith :: (Error -> Stream a) -> Stream a -> Stream a

throwError :: Error -> Stream void

propagateTask :: (int -> a -> Sink a -> *) ->  a -> Sink a -> Task

propagateEventTask :: a -> Sink a -> Task

propagateEndTask :: Sink * -> Task

propagateErrorTask :: Error -> Sink * -> Task
