# ADR X: Add Static Types

Brian Cavalier (@briancavalier),
David Chase (@davidchase),
Tylor Steinberger (@TylorS)
Frederik Krautwald (@Frikki),

## Status

**Proposed** | ~~Accepted~~ | ~~Deprecated~~ | ~~Superceded~~

## Context

We're already using Flow static types in some scheduler unit tests.  Adding static types to the source will increase the understandability, reduce mistakes, and enable encoding more structures explicitly (rather than keeping them in our heads or prose).

Alternatives are:

1. Flow. We're already using it in some unit tests.  It provides soundness, and has good tooling via VSCode and Atom.
2. TypeScript. It provides slightly better tooling via VSCode, and has a larger community.  However, it is unsound.

## Decision

## Consequences
