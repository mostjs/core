Concepts
========

Events
------

An *event* is a value that *occurs* at a particular instant in time.  For example, a mouse click is an event.

The time an event occurs is just as important its value, and the value can't be observed until the time at which the event occurs.  The value of a DOM mouse click event can't be observed until the user actually clicks the mouse button.

Event Streams
-------------

An *event stream* is a sequence of discrete events of the same type.  For example, all the mouse clicks in a document can be represented as an event stream.

Whereas an Array is ordered spatially, i.e. by index, an event stream is ordered temporally, i.e. by its events' occurrence times.  The second mouse click can't be observed until after the first has been observed.
