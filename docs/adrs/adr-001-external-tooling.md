# ADR 1: External Tooling

Brian Cavalier,
David Chase,
Tylor Steinberger <tlsteinberger167@gmail.com>,
Frederik Krautwald <fkrautwald@gmail.com>,

## Status

**Proposed** | ~~Accepted~~ | ~~Deprecated~~ | ~~Superceded~~

## Context

While streams solve many issues, working with streams have a particular 
pain-point when it comes to debugging them. Aforementioned is especially true 
when the complexity of an application increases.

Presently, we must resort to using `observe`, often with a console log, to 
inspect the values of a stream. We end up with these `observe`s cluttered all 
over the place in our effort to track down a possible bug or issue, which we 
then have to remove again once resolved. Debugging with `observe` also doesn't 
provide any particularly useful feedback on dataflow nor combinators used.

To alleviate this, it is essential that external tools can gain access to 
expecting the details of streams. Currently, there is no hook to accomplishing 
this, wherefore this document will attempt to uncover a reasonable way of 
doing so.

How such a hook should be implemented came down to the following choices:

1. **Add a third hook parameter to `Stream.run`.**
   A third parameter may be okay if we provide a sensible default value because 
   it won't break clients' existing runtime code. Thus, we can be backward 
   compatible. It may not be okay because we are reaching the limit of 
   parameters for what is acceptable for a function. Three parameters introduce 
   a mental overhead for developers because they have to remember the order of 
   the parameters. It may also not be okay because the new type this change 
   would introduce could break the static type-checking of existing code.

2. **Add a new run-like method `Stream` with a third hook parameter.**
   A new run-like method with a third hook parameter may be okay because it 
   leaves the existing `Stream.run()` method intact and could perhaps be 
   implemented in a non-breaking fashion. It may not be okay because it will 
   require clients to call a different `run()` method to use the hook.

3. **Add a new run-like method to `Stream` with a row-like "resources" parameter.**
   A new run-like method with a row-like "resources" parameter may be okay 
   because it makes it easy to add new rows in the future. It may not be okay 
   because ...

## Decision

## Consequences
