Notation
========

Timeline notation
-----------------

You'll see diagrams like this::

  stream1: -a-b-c-d->

  stream2: -a--b---c|

  stream3: -abc-def-X

These are timeline diagrams that try to give a simple, representative notion of how a stream behaves over time.  Time proceeds from left to right, using letters and symbols to indicate certain things:

- letters (a,b,c,d,etc) - an event that occurs at a particular time
- ``-`` - a time when no event occurs
- ``|``` - event stream ended
- ``X`` - an error occurred
- ``>`` - stream continues infinitely
  - Typically, ``>`` means you can assume that events will continue to repeat some common pattern infinitely

Examples
^^^^^^^^

::

  stream: a|

`a` occurs at time 0 and then the event stream ends immediately.

::

  stream: a-b---|

`a` occurs at time 0, `b` at time 2, and the event stream ends at time 6.

::

  stream: a-b-X

`a` occurs at time 0, `b` at time 2, and the event stream fails at time 4.

::

  stream: abc-def->

An event stream where:

- `a` occurs at time 0, `b` at time 1, and `c` at time 2
- no events occur at time 3
- `d` occurs at time 4, `e` at time 5, and `f` at time 6
- no events occur at time 7
- the pattern continues infinitely, repeating a similar pattern

Functions and Types
-------------------

You'll see function signatures like this:

.. code-block:: haskell

  numberToString :: Number -> String

This is Haskell-like notation for a function which:

- is named `numberToString`
- takes a `Number`
- returns a `String`

Example
^^^^^^^

Here's a more realistic example:

.. code-block:: haskell

  map :: (a -> b) -> Stream a -> Stream b

This is a function which:

- is named `map`
- has 2 *type parameters* ``a`` and ``b``
- takes 2 arguments
  - another function with signature ``(a -> b)```
  - an event stream with events of type ``a``
- returns an event stream with events of type ``b``
