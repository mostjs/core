.. _Concepts:

Concepts
========

.. _Events:

Events
------

An *event* is a value that *occurs* at a particular instant in time.  For example, a mouse click is an event.

Conceptually, you can think of an event as a (time, value) pair, where the event's time is just as important as its value. You can't know the value of a mouse click until the mouse button actually is clicked.

.. _Event Streams:

Event Streams
-------------

An *event stream* is a time-ordered sequence of events.  For example, all the mouse clicks in a document can be represented as an event stream.

Conceptually, you can think of an event stream as an array of (time, value) pairs.  However, whereas an array is ordered by index, an event stream is ordered by its events' occurrence times.  You can't observe the second mouse click until after you've observed the first one.

Event streams may be *infinite*, *finite*, or may *fail*.

Infinite Event Streams
^^^^^^^^^^^^^^^^^^^^^^

An event stream may be infinite.  For example, :ref:`periodic` creates an infinite stream of events that occur at a regular period.  Limiting operations, such as :ref:`take` or :ref:`until`, are helpful in turning an infinite event stream into a finite one.

Finite Event Streams
^^^^^^^^^^^^^^^^^^^^

An event stream may be finite.  A finite event stream will produce an *end signal* to indicate that it will never produce another event.  When an event stream ends, it will free underlying resources.

.. _Failed Event Streams:

Failed Event Streams
^^^^^^^^^^^^^^^^^^^^

An event stream may fail.  For example, when an event stream represents a resource, such as a WebSocket, and the resource fails or closes unexpectedly, the event stream *cannot* produce more events.  When an event stream fails, it will produce an *error signal* to indicate that it cannot produce more events.  The error signal includes a *reason* (an ``Error`` object) describing the failure.

A failed event stream will attempt to free any underlying resources.

The :ref:`recoverWith` operation allows you to handle an event stream failure.

.. _Application Errors:

Stream Failure vs. Application Errors
`````````````````````````````````````

Stream failures are different from *application errors*.  A stream failure indicates that an event stream *cannot* produce more events.  An application error may or may not indicate an event stream failure.

For example, an event stream of messages from a WebSocket *fails* if the WebSocket is disconnected unexpectedly because of a dropped network connection.

In contrast, an application error may occur in the application logic when it receives a WebSocket message that it can't process because the application state has changed.  The application must deal with this particular state conflict in an application-specific way, but the WebSocket event stream has *not* failed.

Application error handling is outside the scope of these docs, as it is application-specific.  However, there are some general strategies for dealing with application errors with event streams:

* Use try/catch or `Promise catch() <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch>`_ to handle the application error and transform it into:

  * a useful event value
  * a sentinel event value that can be :ref:`filtered <filter>`
  * an `Either <https://github.com/sanctuary-js/sanctuary#either-type>`_ value, or other equivalent structure for representing a value or an error as an event value

* Use :ref:`throwError` to transform the application error into a stream failure

Streams and Sinks
-----------------

Applying an operation to a stream derives a *new stream* with *new events*. There is *no alteration* to the original stream (*the origin*). Multiple operations compose a *chain of streams*. When a stream is observed, a :ref:`run <Stream>` message is sent “backwards” through the chain to the origin.

As the message travels, it composes a :ref:`Sink` chain analogous to the stream chain. Finally, the origin begins to produce its events when the message reaches it. With the exception of a few combinators (such as :ref:`delay`), events propagate *synchronously* “forward” through the sink chain.

**Note**: a stream must not *begin* producing events synchronously. It must schedule the *start* of its production by using the :ref:`Scheduler` passed to its :ref:`run <Stream>` method. Once it has started, it may then produce events synchronously.

Event propagation
-----------------

Each event propagation is synchronous by default.  One sink calls the :ref:`event <Sink>` method of the next, forming a synchronous call stack.

Some combinators, like :ref:`delay`, introduce asynchrony into the sink chain.

Error propagation
-----------------

.. attention:: Uncaught exceptions in a sink chain are considered to be :ref:`failures <Failed Event Streams>`, and not *application errors*.  See :ref:`Stream Failure vs. Application Errors <Application Errors>` for more information.

If an exception is thrown during event propagation, it will stop the propagation and travel "backwards" through the sink chain, by unwinding the call stack.  If that exception is not caught, it will reach the producer, and finally, the scheduler.  The scheduler will catch it and send the error "forward" again synchronously, using the `error` channel of the sink chain.
