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

A: No. ``@most/core`` and Node streams are fairly different things, each of which happened to choose the name "stream" for one of its core concepts. They have a different primary goals, and thus different architectures and APIs.

``@most/core`` :ref:`Event Streams`:

* Deal with discrete events as as they happen, such as mouse clicks, where reactivity (timeliness) is a major factor
* Provide an API of functions for filtering, transforming, merging, etc. discrete event streams
* Add new functionality by writing new event sources and functions

In contrast, Node streams:

* Deal primarily with chunked data IO (even though they have "object mode"), where flow control (aka "back pressure") is a major factor
* Provide an API based around piping one stream through another
* Add new functionality by writing new Readable, Writable, and Transform streams
