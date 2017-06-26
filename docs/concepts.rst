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
