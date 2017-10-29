@most/core
==========

``@most/core`` is a toolkit for reactive event programming.  It helps you write highly interactive apps by composing :ref:`event streams <concepts>`, and without many of the hazards of side effects and mutable shared state.

It features an ultra-high performance, low overhead architecture, and a small but powerful set of operations for merging, filtering, and transforming event streams.

When should you use it?
^^^^^^^^^^^^^^^^^^^^^^^

Use ``@most/core`` to build programs that transform, filter, coordinate, and *react to* :ref:`events` *as they happen*.  For example, it can be a good choice for building interactive user interfaces.

When *shouldn't* you use it?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``@most/core`` is not a good choice for use cases that aren't characterized by reacting to events as they happen.  For example, it isn't intended for Array data processing, time series data analysis and processing, or for streaming chunked data with flow control (also known as "back pressure").

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   faq
   notation
   concepts
   api
   writing-docs

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
