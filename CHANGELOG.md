# Change Log

## [@most/disposable@1.0.0-beta.0](https://github.com/mostjs/core/tree/@most/disposable@1.0.0-beta.0) (2017-10-25)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@1.0.0-beta.0...@most/disposable@1.0.0-beta.0)

## [@most/core@1.0.0-beta.0](https://github.com/mostjs/core/tree/@most/core@1.0.0-beta.0) (2017-10-25)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@1.0.0-beta.0...@most/core@1.0.0-beta.0)

## [@most/scheduler@1.0.0-beta.0](https://github.com/mostjs/core/tree/@most/scheduler@1.0.0-beta.0) (2017-10-25)
[Full Changelog](https://github.com/mostjs/core/compare/@most/types@1.0.0-beta.0...@most/scheduler@1.0.0-beta.0)

## [@most/types@1.0.0-beta.0](https://github.com/mostjs/core/tree/@most/types@1.0.0-beta.0) (2017-10-25)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.15.0...@most/types@1.0.0-beta.0)

**Closed issues:**

- Remove "source" as a first class concept in the docs. [\#160](https://github.com/mostjs/core/issues/160)
- Start a FAQ [\#155](https://github.com/mostjs/core/issues/155)

**Merged pull requests:**

- docs\(index\): Remove Note, add examples link [\#162](https://github.com/mostjs/core/pull/162) ([briancavalier](https://github.com/briancavalier))
- Reword Source and sink chains [\#161](https://github.com/mostjs/core/pull/161) ([Frikki](https://github.com/Frikki))
- docs\(FAQ\): start FAQ [\#157](https://github.com/mostjs/core/pull/157) ([briancavalier](https://github.com/briancavalier))

## [@most/core@0.15.0](https://github.com/mostjs/core/tree/@most/core@0.15.0) (2017-10-23)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.13.1...@most/core@0.15.0)

**Fixed bugs:**

- Bug: \(with/zip\)ArrayValues does not stop emitting when expected [\#147](https://github.com/mostjs/core/issues/147)

**Merged pull requests:**

- fix\(types\): Fix zipItems/withItems types [\#154](https://github.com/mostjs/core/pull/154) ([briancavalier](https://github.com/briancavalier))
- docs\(concepts\): Fix grammar in application errors section [\#153](https://github.com/mostjs/core/pull/153) ([briancavalier](https://github.com/briancavalier))
- feat\(slice\): improve empty slice detection [\#151](https://github.com/mostjs/core/pull/151) ([briancavalier](https://github.com/briancavalier))
- fix: simplify ZipArrayValuesSink logic [\#149](https://github.com/mostjs/core/pull/149) ([TylorS](https://github.com/TylorS))
- feat\(snapshot\): Rename sample -\> snapshot, add new sample [\#148](https://github.com/mostjs/core/pull/148) ([briancavalier](https://github.com/briancavalier))
- chore\(examples\): update example deps [\#146](https://github.com/mostjs/core/pull/146) ([briancavalier](https://github.com/briancavalier))
- docs\(concepts\): Add finite, infinite, failed stream info, periodic docs [\#144](https://github.com/mostjs/core/pull/144) ([briancavalier](https://github.com/briancavalier))

## [@most/scheduler@0.13.1](https://github.com/mostjs/core/tree/@most/scheduler@0.13.1) (2017-10-07)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.14.0...@most/scheduler@0.13.1)

## [@most/core@0.14.0](https://github.com/mostjs/core/tree/@most/core@0.14.0) (2017-10-07)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.13.1...@most/core@0.14.0)

## [@most/disposable@0.13.1](https://github.com/mostjs/core/tree/@most/disposable@0.13.1) (2017-10-07)
[Full Changelog](https://github.com/mostjs/core/compare/@most/prelude@1.6.4...@most/disposable@0.13.1)

**Closed issues:**

- Deprecate `@most/multicast` and direct people to `@most/core`'s multicast\(\) [\#136](https://github.com/mostjs/core/issues/136)
- Suggestion: rearrange the order of arguments in sample\(\) [\#135](https://github.com/mostjs/core/issues/135)
- Deprecate @most/sample and direct people to @most/core's sample\(\) [\#134](https://github.com/mostjs/core/issues/134)
- Update @most/hold [\#132](https://github.com/mostjs/core/issues/132)
- Update @most/dom-event [\#131](https://github.com/mostjs/core/issues/131)

**Merged pull requests:**

- chore\(build\): stop bundling deps into builds [\#141](https://github.com/mostjs/core/pull/141) ([briancavalier](https://github.com/briancavalier))
- feat\(examples\): Add simple example counter [\#139](https://github.com/mostjs/core/pull/139) ([briancavalier](https://github.com/briancavalier))
- chore\(DOCS\): add multicast [\#137](https://github.com/mostjs/core/pull/137) ([davidchase](https://github.com/davidchase))
- chore\(core\): remove defaultScheduler [\#130](https://github.com/mostjs/core/pull/130) ([davidchase](https://github.com/davidchase))
- chore\(core\): update some files to es6 classes [\#129](https://github.com/mostjs/core/pull/129) ([davidchase](https://github.com/davidchase))
- Correct grammar, typos, spelling, and formatting [\#128](https://github.com/mostjs/core/pull/128) ([Frikki](https://github.com/Frikki))
- docs\(README\): Remove example [\#127](https://github.com/mostjs/core/pull/127) ([briancavalier](https://github.com/briancavalier))
- docs\(README\): Add links [\#126](https://github.com/mostjs/core/pull/126) ([briancavalier](https://github.com/briancavalier))
- Add minimal README to docs directory [\#125](https://github.com/mostjs/core/pull/125) ([axefrog](https://github.com/axefrog))
- feat\(core\): Add runStream as function from of stream.run [\#120](https://github.com/mostjs/core/pull/120) ([briancavalier](https://github.com/briancavalier))

## [@most/prelude@1.6.4](https://github.com/mostjs/core/tree/@most/prelude@1.6.4) (2017-09-05)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.13.0...@most/prelude@1.6.4)

## [@most/core@0.13.0](https://github.com/mostjs/core/tree/@most/core@0.13.0) (2017-09-05)
[Full Changelog](https://github.com/mostjs/core/compare/@most/types@0.11.1...@most/core@0.13.0)

## [@most/types@0.11.1](https://github.com/mostjs/core/tree/@most/types@0.11.1) (2017-09-05)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.13.0...@most/types@0.11.1)

## [@most/disposable@0.13.0](https://github.com/mostjs/core/tree/@most/disposable@0.13.0) (2017-09-05)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.13.0...@most/disposable@0.13.0)

## [@most/scheduler@0.13.0](https://github.com/mostjs/core/tree/@most/scheduler@0.13.0) (2017-09-05)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.12.1...@most/scheduler@0.13.0)

**Merged pull requests:**

- fix\(types\): propagateTask; decouple value type from sink type [\#123](https://github.com/mostjs/core/pull/123) ([axefrog](https://github.com/axefrog))
- chore\(linting\): only add standard for now [\#122](https://github.com/mostjs/core/pull/122) ([davidchase](https://github.com/davidchase))
- chore\(lerna\): update lerna to latest [\#119](https://github.com/mostjs/core/pull/119) ([briancavalier](https://github.com/briancavalier))
- feat\(disposable\): Add dispose function [\#118](https://github.com/mostjs/core/pull/118) ([briancavalier](https://github.com/briancavalier))
- feat\(scheduler\): Add currentTime free function for reading scheduler time [\#117](https://github.com/mostjs/core/pull/117) ([briancavalier](https://github.com/briancavalier))

## [@most/core@0.12.1](https://github.com/mostjs/core/tree/@most/core@0.12.1) (2017-08-28)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.12.0...@most/core@0.12.1)

**Merged pull requests:**

- fix\(types\): fix continueWith flow types [\#115](https://github.com/mostjs/core/pull/115) ([briancavalier](https://github.com/briancavalier))
- Tweak tap heading [\#114](https://github.com/mostjs/core/pull/114) ([TrySound](https://github.com/TrySound))
- Remove dead type annotation [\#113](https://github.com/mostjs/core/pull/113) ([TrySound](https://github.com/TrySound))

## [@most/scheduler@0.12.0](https://github.com/mostjs/core/tree/@most/scheduler@0.12.0) (2017-08-24)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.12.0...@most/scheduler@0.12.0)

## [@most/core@0.12.0](https://github.com/mostjs/core/tree/@most/core@0.12.0) (2017-08-24)
[Full Changelog](https://github.com/mostjs/core/compare/@most/types@0.11.0...@most/core@0.12.0)

## [@most/types@0.11.0](https://github.com/mostjs/core/tree/@most/types@0.11.0) (2017-08-24)
[Full Changelog](https://github.com/mostjs/core/compare/@most/prelude@1.6.3...@most/types@0.11.0)

## [@most/prelude@1.6.3](https://github.com/mostjs/core/tree/@most/prelude@1.6.3) (2017-08-24)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.12.0...@most/prelude@1.6.3)

## [@most/disposable@0.12.0](https://github.com/mostjs/core/tree/@most/disposable@0.12.0) (2017-08-24)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.11.4...@most/disposable@0.12.0)

**Merged pull requests:**

- chore\(ci\): stop testing on node 4, to avoid npm 2 [\#112](https://github.com/mostjs/core/pull/112) ([briancavalier](https://github.com/briancavalier))
- feat\(disposable\): curry API [\#110](https://github.com/mostjs/core/pull/110) ([briancavalier](https://github.com/briancavalier))
- chore\(lerna\): update lerna to 2.0.0. Ignore problematic files [\#109](https://github.com/mostjs/core/pull/109) ([briancavalier](https://github.com/briancavalier))
- feat\(scheduler\): Add scheduler functions [\#108](https://github.com/mostjs/core/pull/108) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): Expand API docs [\#106](https://github.com/mostjs/core/pull/106) ([briancavalier](https://github.com/briancavalier))

## [@most/core@0.11.4](https://github.com/mostjs/core/tree/@most/core@0.11.4) (2017-08-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.11.3...@most/core@0.11.4)

**Merged pull requests:**

- fix\(debounce\): ensure debounce disposes source [\#107](https://github.com/mostjs/core/pull/107) ([briancavalier](https://github.com/briancavalier))

## [@most/core@0.11.3](https://github.com/mostjs/core/tree/@most/core@0.11.3) (2017-08-02)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.11.2...@most/core@0.11.3)

**Merged pull requests:**

- fix\(slice\): Port fix from cujojs/most\#468, simplify SettableDisposable [\#105](https://github.com/mostjs/core/pull/105) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): add sample docs [\#104](https://github.com/mostjs/core/pull/104) ([davidchase](https://github.com/davidchase))
- docs\(api\): minor fixes [\#103](https://github.com/mostjs/core/pull/103) ([davidchase](https://github.com/davidchase))
- docs\(api\): add missing documentation [\#102](https://github.com/mostjs/core/pull/102) ([TylorS](https://github.com/TylorS))
- docs\(api\): add documentation for tap and ap [\#101](https://github.com/mostjs/core/pull/101) ([TylorS](https://github.com/TylorS))
- docs\(api\): Add propagatetask docs [\#100](https://github.com/mostjs/core/pull/100) ([briancavalier](https://github.com/briancavalier))
- refactor\(PropagateTask\): remove now-unused  arg from PropagateTaskRun [\#99](https://github.com/mostjs/core/pull/99) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): add continueWith, recoverWith, throwError docs [\#98](https://github.com/mostjs/core/pull/98) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): zipArrayValues, withArrayValues, chain, and join [\#97](https://github.com/mostjs/core/pull/97) ([TylorS](https://github.com/TylorS))

## [@most/core@0.11.2](https://github.com/mostjs/core/tree/@most/core@0.11.2) (2017-07-17)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.11.1...@most/core@0.11.2)

**Closed issues:**

- Will this work with Cycle.js? [\#89](https://github.com/mostjs/core/issues/89)

**Merged pull requests:**

- docs\(api\): Add fromPromise, awaitPromises docs [\#96](https://github.com/mostjs/core/pull/96) ([briancavalier](https://github.com/briancavalier))
- test\(ci\): add travis node 8, remove node 7 [\#95](https://github.com/mostjs/core/pull/95) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): Add merge, combine, zip docs [\#94](https://github.com/mostjs/core/pull/94) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): Add delay, throttle, debounce docs [\#93](https://github.com/mostjs/core/pull/93) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): Add takeWhile, skipWhile, skipAfter docs [\#92](https://github.com/mostjs/core/pull/92) ([briancavalier](https://github.com/briancavalier))
- adds MulticastSource typings [\#91](https://github.com/mostjs/core/pull/91) ([TylorS](https://github.com/TylorS))
- fix\(skipAfter\): export skipAfter [\#90](https://github.com/mostjs/core/pull/90) ([briancavalier](https://github.com/briancavalier))

## [@most/core@0.11.1](https://github.com/mostjs/core/tree/@most/core@0.11.1) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.11.0...@most/core@0.11.1)

**Merged pull requests:**

- fix\(at\): export at [\#88](https://github.com/mostjs/core/pull/88) ([briancavalier](https://github.com/briancavalier))

## [@most/scheduler@0.11.0](https://github.com/mostjs/core/tree/@most/scheduler@0.11.0) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.11.0...@most/scheduler@0.11.0)

## [@most/disposable@0.11.0](https://github.com/mostjs/core/tree/@most/disposable@0.11.0) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/types@0.10.0...@most/disposable@0.11.0)

## [@most/types@0.10.0](https://github.com/mostjs/core/tree/@most/types@0.10.0) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.11.0...@most/types@0.10.0)

## [@most/core@0.11.0](https://github.com/mostjs/core/tree/@most/core@0.11.0) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/prelude@1.6.2...@most/core@0.11.0)

## [@most/prelude@1.6.2](https://github.com/mostjs/core/tree/@most/prelude@1.6.2) (2017-07-12)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.10.0...@most/prelude@1.6.2)

**Merged pull requests:**

- feat\(types\): Add explicit covariance to allow custom types [\#87](https://github.com/mostjs/core/pull/87) ([briancavalier](https://github.com/briancavalier))
- docs\(api\): Add docs for a few sources [\#86](https://github.com/mostjs/core/pull/86) ([briancavalier](https://github.com/briancavalier))
- feat\(runWithLocalTime\): avoid nesting RelativeSinks [\#85](https://github.com/mostjs/core/pull/85) ([briancavalier](https://github.com/briancavalier))
- docs\(combinator-template\): Add combinator doc template [\#84](https://github.com/mostjs/core/pull/84) ([briancavalier](https://github.com/briancavalier))
- chore\(coverage\): Enable nyc coverage in all packages [\#81](https://github.com/mostjs/core/pull/81) ([briancavalier](https://github.com/briancavalier))

## [@most/disposable@0.10.0](https://github.com/mostjs/core/tree/@most/disposable@0.10.0) (2017-06-28)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.10.0...@most/disposable@0.10.0)

## [@most/scheduler@0.10.0](https://github.com/mostjs/core/tree/@most/scheduler@0.10.0) (2017-06-28)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.10.0...@most/scheduler@0.10.0)

## [@most/core@0.10.0](https://github.com/mostjs/core/tree/@most/core@0.10.0) (2017-06-28)
[Full Changelog](https://github.com/mostjs/core/compare/@most/prelude@1.6.1...@most/core@0.10.0)

## [@most/prelude@1.6.1](https://github.com/mostjs/core/tree/@most/prelude@1.6.1) (2017-06-28)
[Full Changelog](https://github.com/mostjs/core/compare/@most/scheduler@0.9.1...@most/prelude@1.6.1)

**Closed issues:**

- multicast [\#83](https://github.com/mostjs/core/issues/83)
- API docs [\#22](https://github.com/mostjs/core/issues/22)

**Merged pull requests:**

- fix\(package.json\): make package.json version match npm [\#82](https://github.com/mostjs/core/pull/82) ([briancavalier](https://github.com/briancavalier))
- chore\(docs\): Add readthedocs documentation scaffold [\#78](https://github.com/mostjs/core/pull/78) ([briancavalier](https://github.com/briancavalier))
- feat\(multicast\): adds multicast back to the core [\#77](https://github.com/mostjs/core/pull/77) ([davidchase](https://github.com/davidchase))

## [@most/scheduler@0.9.1](https://github.com/mostjs/core/tree/@most/scheduler@0.9.1) (2017-06-21)
[Full Changelog](https://github.com/mostjs/core/compare/@most/types@0.9.1...@most/scheduler@0.9.1)

## [@most/types@0.9.1](https://github.com/mostjs/core/tree/@most/types@0.9.1) (2017-06-21)
[Full Changelog](https://github.com/mostjs/core/compare/@most/disposable@0.9.1...@most/types@0.9.1)

## [@most/disposable@0.9.1](https://github.com/mostjs/core/tree/@most/disposable@0.9.1) (2017-06-21)
[Full Changelog](https://github.com/mostjs/core/compare/@most/core@0.9.1...@most/disposable@0.9.1)

## [@most/core@0.9.1](https://github.com/mostjs/core/tree/@most/core@0.9.1) (2017-06-21)
[Full Changelog](https://github.com/mostjs/core/compare/v0.8.0...@most/core@0.9.1)

**Merged pull requests:**

- chore\(concat\): Remove concat [\#80](https://github.com/mostjs/core/pull/80) ([briancavalier](https://github.com/briancavalier))
- feat\(at\): Add at and now. Move empty, never to own modules [\#79](https://github.com/mostjs/core/pull/79) ([briancavalier](https://github.com/briancavalier))
- fix\(newStream\): export newStream from index.js [\#76](https://github.com/mostjs/core/pull/76) ([axefrog](https://github.com/axefrog))
- chore\(unfold\): Remove unfold, iterate, generate [\#75](https://github.com/mostjs/core/pull/75) ([briancavalier](https://github.com/briancavalier))
- feat\(prelude\): imports prelude into monorepo [\#65](https://github.com/mostjs/core/pull/65) ([TylorS](https://github.com/TylorS))

## [v0.8.0](https://github.com/mostjs/core/tree/v0.8.0) (2017-06-12)
[Full Changelog](https://github.com/mostjs/core/compare/v0.7.1...v0.8.0)

**Closed issues:**

- Add curryable zip2/zip3/etc, combine2/combine3/etc? [\#10](https://github.com/mostjs/core/issues/10)

**Merged pull requests:**

- chore\(switchLatest\): avoid mutating Segment [\#74](https://github.com/mostjs/core/pull/74) ([nissoh](https://github.com/nissoh))
- Rewrite combine, merge, & zip to be curryable [\#68](https://github.com/mostjs/core/pull/68) ([joshburgess](https://github.com/joshburgess))
- feat\(core\): Add stream local time [\#67](https://github.com/mostjs/core/pull/67) ([briancavalier](https://github.com/briancavalier))

## [v0.7.1](https://github.com/mostjs/core/tree/v0.7.1) (2017-06-05)
[Full Changelog](https://github.com/mostjs/core/compare/v0.7.0...v0.7.1)

**Closed issues:**

- TypeError calling performance.now [\#69](https://github.com/mostjs/core/issues/69)

**Merged pull requests:**

- fix\(clock\): Call performance.now as a method. Add new RelativeClock [\#72](https://github.com/mostjs/core/pull/72) ([briancavalier](https://github.com/briancavalier))
- Update example in readme to the newer scheduler API [\#70](https://github.com/mostjs/core/pull/70) ([frangio](https://github.com/frangio))

## [v0.7.0](https://github.com/mostjs/core/tree/v0.7.0) (2017-06-04)
[Full Changelog](https://github.com/mostjs/core/compare/v0.6.1...v0.7.0)

**Closed issues:**

- Use monotonic relative time [\#62](https://github.com/mostjs/core/issues/62)

**Merged pull requests:**

- feat\(clock\): Add relative monotonic clocks, platform detection [\#63](https://github.com/mostjs/core/pull/63) ([briancavalier](https://github.com/briancavalier))

## [v0.6.1](https://github.com/mostjs/core/tree/v0.6.1) (2017-05-15)
[Full Changelog](https://github.com/mostjs/core/compare/v0.6.0...v0.6.1)

**Merged pull requests:**

- fix\(types\): missing withArrayValues [\#60](https://github.com/mostjs/core/pull/60) ([nissoh](https://github.com/nissoh))

## [v0.6.0](https://github.com/mostjs/core/tree/v0.6.0) (2017-05-10)
[Full Changelog](https://github.com/mostjs/core/compare/v0.5.0...v0.6.0)

**Merged pull requests:**

- chore\(fromArray\): remove fromArray and fromIterable [\#58](https://github.com/mostjs/core/pull/58) ([briancavalier](https://github.com/briancavalier))
- feat\(withArrayValues\): Add withArrayValues and zipArrayValues [\#57](https://github.com/mostjs/core/pull/57) ([briancavalier](https://github.com/briancavalier))

## [v0.5.0](https://github.com/mostjs/core/tree/v0.5.0) (2017-05-04)
[Full Changelog](https://github.com/mostjs/core/compare/v0.4.1...v0.5.0)

**Merged pull requests:**

- Fix 2 errors in typescript definitions [\#56](https://github.com/mostjs/core/pull/56) ([TylorS](https://github.com/TylorS))
- feat\(skipAfter\): port skipAfter from cujojs/most [\#55](https://github.com/mostjs/core/pull/55) ([briancavalier](https://github.com/briancavalier))
- feat\(stream\): remove end value [\#54](https://github.com/mostjs/core/pull/54) ([briancavalier](https://github.com/briancavalier))

## [v0.4.1](https://github.com/mostjs/core/tree/v0.4.1) (2017-04-20)
[Full Changelog](https://github.com/mostjs/core/compare/v0.4.0...v0.4.1)

**Merged pull requests:**

- fix\(take\): Prevent take and takeWhile from disposing twice [\#53](https://github.com/mostjs/core/pull/53) ([briancavalier](https://github.com/briancavalier))
- chore\(deps\): update flow-bin dep [\#52](https://github.com/mostjs/core/pull/52) ([briancavalier](https://github.com/briancavalier))
- chore\(deps\): update @most/prelude dep [\#51](https://github.com/mostjs/core/pull/51) ([briancavalier](https://github.com/briancavalier))

## [v0.4.0](https://github.com/mostjs/core/tree/v0.4.0) (2017-04-09)
[Full Changelog](https://github.com/mostjs/core/compare/0.4.0...v0.4.0)

## [0.4.0](https://github.com/mostjs/core/tree/0.4.0) (2017-04-09)
[Full Changelog](https://github.com/mostjs/core/compare/v0.3.1...0.4.0)

**Merged pull requests:**

- feat\(disposable\): Extract and simplify disposables [\#50](https://github.com/mostjs/core/pull/50) ([briancavalier](https://github.com/briancavalier))
- chore\(type-definitions\): until [\#49](https://github.com/mostjs/core/pull/49) ([nissoh](https://github.com/nissoh))
- feat\(META\): Extract scheduler and types packages [\#48](https://github.com/mostjs/core/pull/48) ([briancavalier](https://github.com/briancavalier))
- chore\(package\): Remove buster dep [\#47](https://github.com/mostjs/core/pull/47) ([briancavalier](https://github.com/briancavalier))
- Add newStream [\#46](https://github.com/mostjs/core/pull/46) ([briancavalier](https://github.com/briancavalier))
- feat\(stream\): Remove Stream constructor [\#45](https://github.com/mostjs/core/pull/45) ([briancavalier](https://github.com/briancavalier))
- docs\(README\): fix example [\#44](https://github.com/mostjs/core/pull/44) ([briancavalier](https://github.com/briancavalier))

## [v0.3.1](https://github.com/mostjs/core/tree/v0.3.1) (2017-02-21)
[Full Changelog](https://github.com/mostjs/core/compare/v0.3.0...v0.3.1)

**Closed issues:**

- Convert top-level tests [\#41](https://github.com/mostjs/core/issues/41)
- Convert combinator/ tests [\#37](https://github.com/mostjs/core/issues/37)
- Convert source/ tests [\#34](https://github.com/mostjs/core/issues/34)

**Merged pull requests:**

- Port top level tests [\#43](https://github.com/mostjs/core/pull/43) ([briancavalier](https://github.com/briancavalier))
- test\(combinator\) convert combinator tests [\#42](https://github.com/mostjs/core/pull/42) ([davidchase](https://github.com/davidchase))
- chore\(type-definitions\): fix compiler errors [\#40](https://github.com/mostjs/core/pull/40) ([TylorS](https://github.com/TylorS))
- chore\(META\): Refactor to lerna monorepo [\#39](https://github.com/mostjs/core/pull/39) ([briancavalier](https://github.com/briancavalier))
- test\(disposable\): convert sink & disposable tests [\#36](https://github.com/mostjs/core/pull/36) ([TylorS](https://github.com/TylorS))
- chore\(test\): Convert source/ tests to mocha + @briancavalier/assert [\#35](https://github.com/mostjs/core/pull/35) ([briancavalier](https://github.com/briancavalier))
- chore\(test\): Switch 1 existing mocha test to use @briancavalier/assert [\#33](https://github.com/mostjs/core/pull/33) ([briancavalier](https://github.com/briancavalier))

## [v0.3.0](https://github.com/mostjs/core/tree/v0.3.0) (2017-01-25)
[Full Changelog](https://github.com/mostjs/core/compare/v0.2.1...v0.3.0)

**Closed issues:**

- Remove the need to call PropagateTask's run function with `this` [\#19](https://github.com/mostjs/core/issues/19)

**Merged pull requests:**

- fix\(flow\): Add missing generate\(\) type [\#32](https://github.com/mostjs/core/pull/32) ([briancavalier](https://github.com/briancavalier))
- Converts all tests to ES2015 import/export and setup mocha [\#31](https://github.com/mostjs/core/pull/31) ([TylorS](https://github.com/TylorS))
- feat\(core\): Add task arg to PropagateTask run function [\#30](https://github.com/mostjs/core/pull/30) ([briancavalier](https://github.com/briancavalier))
- Update type-definitions [\#27](https://github.com/mostjs/core/pull/27) ([TylorS](https://github.com/TylorS))

## [v0.2.1](https://github.com/mostjs/core/tree/v0.2.1) (2017-01-17)
[Full Changelog](https://github.com/mostjs/core/compare/v0.2.0...v0.2.1)

**Merged pull requests:**

- fix\(core\): Fix newDefaultScheduler argument order [\#29](https://github.com/mostjs/core/pull/29) ([briancavalier](https://github.com/briancavalier))

## [v0.2.0](https://github.com/mostjs/core/tree/v0.2.0) (2017-01-17)
[Full Changelog](https://github.com/mostjs/core/compare/0.1.0...v0.2.0)

**Merged pull requests:**

- chore\(dist\): Remove dist/ from repo, add prepublish [\#28](https://github.com/mostjs/core/pull/28) ([briancavalier](https://github.com/briancavalier))
- chore\(META\): add basic configurations for northbrook [\#26](https://github.com/mostjs/core/pull/26) ([TylorS](https://github.com/TylorS))
- feat\(core\): Add flow types, flow build step, type tests [\#21](https://github.com/mostjs/core/pull/21) ([briancavalier](https://github.com/briancavalier))

## [0.1.0](https://github.com/mostjs/core/tree/0.1.0) (2017-01-13)
**Closed issues:**

- Remove timestamp\(\)? [\#16](https://github.com/mostjs/core/issues/16)
- What to do with sample, sampleWith? [\#9](https://github.com/mostjs/core/issues/9)
- Remove defaultScheduler, observe, drain, reduce [\#5](https://github.com/mostjs/core/issues/5)

**Merged pull requests:**

- Update buba to get transitive buble fix for name collisions [\#25](https://github.com/mostjs/core/pull/25) ([briancavalier](https://github.com/briancavalier))
- Avoid buble name collision bug [\#24](https://github.com/mostjs/core/pull/24) ([briancavalier](https://github.com/briancavalier))
- Add a simple README. Update package.json description and keywords [\#23](https://github.com/mostjs/core/pull/23) ([briancavalier](https://github.com/briancavalier))
- chore\(core\) update dist [\#20](https://github.com/mostjs/core/pull/20) ([davidchase](https://github.com/davidchase))
- Remove timestamp [\#18](https://github.com/mostjs/core/pull/18) ([briancavalier](https://github.com/briancavalier))
- Simplify fromIterable, remove tick insertion [\#17](https://github.com/mostjs/core/pull/17) ([briancavalier](https://github.com/briancavalier))
- Update and simplify disposables [\#15](https://github.com/mostjs/core/pull/15) ([briancavalier](https://github.com/briancavalier))
- Split scan & reduce [\#14](https://github.com/mostjs/core/pull/14) ([briancavalier](https://github.com/briancavalier))
- Update perf tests to use fromArray [\#13](https://github.com/mostjs/core/pull/13) ([briancavalier](https://github.com/briancavalier))
- Update switch to es6, remove alias [\#12](https://github.com/mostjs/core/pull/12) ([briancavalier](https://github.com/briancavalier))
- Port sample from @most/sample [\#11](https://github.com/mostjs/core/pull/11) ([briancavalier](https://github.com/briancavalier))
- WIP: Add runEffects\(\), remove defaultScheduler [\#8](https://github.com/mostjs/core/pull/8) ([briancavalier](https://github.com/briancavalier))
- Rename flatMap -\> chain [\#7](https://github.com/mostjs/core/pull/7) ([briancavalier](https://github.com/briancavalier))
- Remove fromEvent, from. Export fromArray, fromIterable [\#6](https://github.com/mostjs/core/pull/6) ([briancavalier](https://github.com/briancavalier))
- Add switch perf results [\#4](https://github.com/mostjs/core/pull/4) ([briancavalier](https://github.com/briancavalier))
- Fix package.json main, module, and jsnext:main [\#3](https://github.com/mostjs/core/pull/3) ([briancavalier](https://github.com/briancavalier))
- update perf tests to use curried functions [\#2](https://github.com/mostjs/core/pull/2) ([davidchase](https://github.com/davidchase))
- Functions only, remove extras, update build [\#1](https://github.com/mostjs/core/pull/1) ([briancavalier](https://github.com/briancavalier))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*