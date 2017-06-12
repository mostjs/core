API
===

Transform
---------

map
^^^

``map :: (a → b) → Stream a → Stream b``

Create a new stream by applying a function to each event of the input stream.::

   stream:        -a-b-c-d->
   stream.map(f): -f(a)-f(b)-f(c)-f(d)->

.. code-block:: javascript

  map(x => x + 1, stream)
