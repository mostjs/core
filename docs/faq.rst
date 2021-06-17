FAQ
===

**Q: What's the relationship between most 1.x and @most/core?**

A: ``@most/core`` is a new implementation of most's architecture, based on lessons learned from building and maintaining most. It has a leaner API that is more tailored to a functional style of programming.

Most 2.0 will be implemented on top of @most/core.

If you're starting a new project and @most/core's leaner API and programming style fit your goals, we recommend starting with it rather than most.

**Q: How do I upgrade from most 1.x to @most/core?**

See the :doc:`upgrading-guide`.

**Q: I want to process Arrays / time series data. Should I use ``@most/core`` for that?**

A: No. ``@most/core`` is focused on reactive event programming rather than Array or time series processing. :ref:`Read more here <when should you use it>`.

**Q: I want to stream chunked data with flow control (also known as "back pressure"). Should I use ``@most/core`` for that?**

A: No. ``@most/core`` is focused on reactive event programming rather than chunked/block data streaming :ref:`Read more here <when should you use it>`.

**Q: Are ``@most/core`` event streams the same as Node streams?**

A: No. ``@most/core`` and Node streams are both based on the general concept of `stream processing <https://en.wikipedia.org/wiki/Stream_processing>`_.  However, they differ in their specific goals, architectures, and APIs.

``@most/core`` :ref:`Event Streams`

* deal with discrete events as they happen, such as mouse clicks, where reactivity (timeliness) is a significant factor;
* provide an API of functions for filtering, transforming, merging, etc. discrete event streams; and
* add new functionality by writing new event sources and functions.

In contrast, Node streams

* deal primarily with chunked data IO (even though they have "object mode"), where flow control (a.k.a. `back pressure <https://nodejs.org/en/docs/guides/backpressuring-in-streams/#too-much-data-too-quickly>`_) is a significant factor;
* provide an API based around piping one stream through another; and
* add new functionality by writing new Readable, Writable, and Transform streams.
