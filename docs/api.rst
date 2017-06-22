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

runEffects :: Stream a -> Scheduler -> Promise void

Construction
------------

empty :: () -> Stream *

never :: () -> Stream *

now :: a -> Stream a

at :: Time -> a -> Stream a

startWith :: a -> Stream a -> Stream a

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

constant
^^^^^^^^

.. code-block:: haskell

  constant :: a -> Stream * -> Stream a

Replace each event of the input stream with x.

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

filter
^^^^^^

.. code-block:: haskell

  filter :: (a -> bool) -> Stream a -> Stream a

Retain only events for which a predicate is truthy.

  stream:               -1-2-3-4->
  filter(even, stream): ---2---4->

skipRepeats
^^^^^^^^^^^

.. code-block:: haskell

  skipRepeats :: Stream a -> Stream a

Remove adjacent repeated events

Note that `===` is used to identify repeated items.  To use a different comparison, use :ref:`skipRepeatsWith`

.. js:function:: skipRepeatsWith

.. code-block:: haskell

  skipRepeatsWith :: ((a, a) -> bool) -> Stream a -> Stream a

Remove adjacent repeated events, using the provided equality function to compare adjacent events.

take :: int -> Stream a -> Stream a

skip :: int -> Stream a -> Stream a

slice :: int -> int -> Stream a -> Stream a

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
