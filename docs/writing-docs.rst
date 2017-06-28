Writing Docs
============

Tips and templates for writing ``@most/core`` docs.

Combinator template
-------------------

.. note::
  Template for writing docs for an API function.

  #. Copy and paste into appropriate enclosing doc (probably api.rst)
  #. Complete each todo
  #. Make sure all todos have been removed before pushing

.. todo:: Anchor link: function name with leading underscore
.. _name:

.. todo:: Function name heading

name
^^^^

.. todo:: Type signature
.. code-block:: haskell

  name :: (a -> b) -> Stream a -> Stream b

.. todo:: Short description

Short description of what it does. Usually just 1-3 sentences, but may be multiple paragraphs if needed.::

.. todo:: Ascii diagram. For example:
  stream:         -a-b-c-d->
  map(f, stream): -f(a)-f(b)-f(c)-f(d)->

.. todo:: *Optionally* add a longer explanation, or delete if not necessary.

Add more explanation *only if necessary*. Otherwise, just delete this.

.. todo:: Simple Javascript usage example
.. code-block:: javascript

  map(x => x + 1, stream)
