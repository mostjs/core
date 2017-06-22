Concepts
========

Events
------

An *event* is a value that *occurs* at a particular instant in time.  For example, a mouse click is an event.

Conceptually, you can think of an event as a (time, value) pair, and the event's time is just as important as its value. You can't know the value of a mouse click until the mouse button actually is clicked.

Event Streams
-------------

An *event stream* is a sequence of discrete events of the same type.  For example, all the mouse clicks in a document can be represented as an event stream.

Whereas an Array is ordered spatially, i.e. by index, an event stream is ordered temporally, i.e. by its events' occurrence times.  You can't observe the second mouse click until after you've observed the first one.
