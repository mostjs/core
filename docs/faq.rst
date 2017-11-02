FAQ
===

**Q: What's the relationship between most 1.0 and @most/core?**

A: ``@most/core`` is a new implementation of most's architecture, based on lessons learned from building and maintaining most. It has a leaner API that is more tailored to a functional style of programming.

Most 2.0 will be implemented on top of @most/core.

If you're starting a new project and @most/core's leaner API and programming style fit your goals, we recommend starting with it rather than most.

**Q: I want to process Arrays / time series data. Should I use ``@most/core`` for that?**

A: No. ``@most/core`` is focused on reactive event programming rather than data processing. :ref:`Read more here <when should you use it>`.

**Q: I want to stream chunked data with flow control (also known as "back pressure"). Should I use ``@most/core`` for that?**

A: No. ``@most/core`` is focused on reactive event programming rather than chunked/block data streaming :ref:`Read more here <when should you use it>`.
