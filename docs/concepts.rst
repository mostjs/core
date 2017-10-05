Concepts
========

Events
------

An *event* is a value that *occurs* at a particular instant in time.  For example, a mouse click is an event.

Conceptually, you can think of an event as a (time, value) pair, where the event's time is just as important as its value. You can't know the value of a mouse click until the mouse button actually is clicked.

Event Streams
-------------

An *event stream* is a time-ordered series of events.  For example, all the mouse clicks in a document can be represented as an event stream.

Conceptually, you can think of an event stream as an array of (time, value) pairs.  However, whereas an array is ordered by index, an event stream is ordered by its events' occurrence times.  You can't observe the second mouse click until after you've observed the first one.

Event streams may be *infinite*, *finite*, or may *fail*.

Infinite Event Streams
``````````````````````

An event stream may be infinite.  For example, :ref:`periodic` creates an infinite stream of events that occur at a regular period.  Limiting operations, such as :ref:`take` or :ref:`until`, are helpful in turning an infinite event stream into a finite one.

Finite Event Streams
````````````````````

An event stream may be finite.  A finite event stream will produce an *end signal* to indicate that it will never produce another event.

Failed Event Streams
````````````````````

An event stream may fail.  For example, when an event stream represents a resource, such as a websocket, and the resource fails or closes unexpectedly, the event stream *cannot* produce more events.  When an event stream fails, it will produce a *error signal* to indicate that it cannot produce more events.  The error signal includes a *reason* (an ``Error`` object) describing the failure.

The :ref:`recoverWith` operation allows you to handle an event stream failure.

Source and sink chains
----------------------

Applying combinators to a stream composes a *source chain* that defines the behavior of the stream.  When an observer begins observing a stream, a :ref:`run <Stream>` message is sent "backwards" through the chain, to the ultimate producer--the one that will produce events in the first place.

As it travels, that message composes a :ref:`Sink` chain analogous to the source chain.  When the messages reaches the producer, it begins producing events.  With the exception of a few combinators (such as :ref:`delay`), events propagate *synchronously* "forward" through the sink chain.

**Note**: a producer must not *begin* producing events synchronously.  It must schedule the *start* of its production, using the :ref:`Scheduler` passed to its :ref:`run <Stream>` method.  However, once it does begin, it may then produce events synchronously.

Event propagation
-----------------

Each event propagation is synchronous by default.  One sink calls the :ref:`event <Sink>` method of the next, forming a synchronous call stack.

Some combinators, like :ref:`delay`, introduce asynchrony into the sink chain.

Error propagation
-----------------

If an exception is thrown during event propagation, it will stop the propagation and travel "backwards" through the sink chain, by unwinding the call stack.  If that exception is not caught, it will reach the producer, and finally, the scheduler.  The scheduler will catch it and send the error "forward" again synchronously, using the `error` channel of the sink chain.
