Notation
========

You'll see diagrams like the following:

```
stream1: -a-b-c-d->

stream2: -a--b---c|

stream3: -abc-def-X
```

These are timeline diagrams that try to give a simple, representative notion of how a stream behaves over time.  Time proceeds from left to right, using letters and symbols to indicate certain things:

* letters (a,b,c,d,etc) - an event that occurs at a particular time
* `-` - a time when no event occurs
* `|` - event stream ended
* `X` - an error occurred
* `>` - stream continues infinitely
	* Typically, `>` means you can assume that events will continue to repeat some common pattern infinitely

### Examples

`stream: a|`

`a` occurs at time 0 and then the event stream ends immediately.

`stream: a-b---|`

`a` occurs at time 0, `b` at time 2, and the event stream ends at time 6.

`stream: a-b-X`

`a` occurs at time 0, `b` at time 2, and the event stream fails at time 4.

`stream: abc-def->`

A stream where:

  1. `a` occurs at time 0
  2. `b` occurs at time 1
  3. `c` occurs at time 2
  4. no events occur at time 3
  5. `d` occurs at time 4
  6. `e` occurs at time 5
  7. `f` occurs at time 6
  8. no events occur at time 7
  9. the pattern continues indefinitely
