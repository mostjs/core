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

Apply a function to each event of the input stream.::

  stream:        -a-b-c-d->
  stream.map(f): -f(a)-f(b)-f(c)-f(d)->

.. code-block:: javascript

  map(x => x + 1, stream)

.. _constant:

constant
^^^^^^^^

.. code-block:: haskell

  constant :: a -> Stream * -> Stream a

Replace each event of the input stream with x.::

  stream:              -a-b-c-d->
  constant(x, stream): -x-x-x-x->

.. code-block:: javascript

  constant('tick', periodic(1000))

tap :: (a -> *) -> Stream a -> Stream a

ap :: Stream (a -> b) -> Stream a -> Stream b

scan :: (b -> a -> b) -> b -> Stream a -> Stream b

loop :: (b -> a -> { seed :: b, value :: c }) -> b -> Stream a -> Stream c

zipArrayValues :: ((a, b) -> c) -> [a] -> Stream b -> Stream c

withArrayValues :: [a] -> Stream b -> Stream a

chain :: (a -> Stream b) -> Stream a -> Stream b

join :: Stream (Stream a) -> Stream a

concatMap :: (a -> Stream b) -> Stream a -> Stream b

mergeConcurrently :: int -> Stream (Stream a) -> Stream a

mergeMapConcurently :: (a -> Stream b) -> int -> Stream a -> Stream b

merge :: ...Stream a -> Stream a

mergeArray :: [ (Stream a) ] -> Stream a

combine :: ((...*) -> a) -> (...Stream *) -> Stream a

combineArray :: ((...*) -> a) -> [ Stream * ] -> Stream a

sample :: ((a, b) -> c) -> Stream a -> Stream b -> Stream c

zip :: ((...*) -> a) -> (...Stream *) -> Stream a

zipArray :: ((...*) -> a) -> [ Stream * ] -> Stream a

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

Create a new stream containing only events where start <= index < end, where index is the ordinal index of an event in stream.::

  stream:              -a-b-c-d-e-f->
  slice(1, 4, stream): ---b-c-d|

  stream:              -a-b-c|
  slice(1, 4, stream): ---b-c|

If stream contains fewer than start events, the returned stream will be empty.

take
^^^^

.. code-block:: haskell

  take :: int -> Stream a -> Stream a

Create a new stream containing at most n events from stream.::

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

Create a new stream that omits the first n events from stream.::

  stream:          -a-b-c-d-e-f->
  skip(3, stream): -------d-e-f->

  stream:          -a-b-c-d-e|
  skip(3, stream): -------d-e|

  stream:          -a-b-c|
  skip(3, stream): ------|

If stream contains fewer than n events, the returned stream will be empty.

takeWhile :: (a -> bool) -> Stream a -> Stream a

skipWhile :: (a -> bool) -> Stream a -> Stream a

until :: Stream * -> Stream a -> Stream a

since :: Stream * -> Stream a -> Stream a

during :: Stream (Stream *) -> Stream a -> Stream a

delay :: int -> Stream a -> Stream a

throttle :: int -> Stream a -> Stream a

debounce :: int -> Stream a -> Stream a

fromPromise :: Promise a -> Stream a

awaitPromises :: Stream (Promise a) -> Stream a

continueWith :: (() -> Stream a) -> Stream a -> Stream a

recoverWith :: (Error -> Stream a) -> Stream a -> Stream a

throwError :: Error -> Stream void

propagateTask :: (int -> a -> Sink a -> *) ->  a -> Sink a -> Task

propagateEventTask :: a -> Sink a -> Task

propagateEndTask :: Sink * -> Task

propagateErrorTask :: Error -> Sink * -> Task
