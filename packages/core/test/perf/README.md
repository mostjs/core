Latest performance tests of basic most.js operations.

* [Setup](#setup)
* [Node](#node)

## Setup

```
❯ uname -a
Darwin brian-mbp.home 18.5.0 Darwin Kernel Version 18.5.0: Mon Mar 11 20:40:32 PDT 2019; root:xnu-4903.251.3~3/RELEASE_X86_64 x86_64

❯ npm ls rxjs xstream kefir baconjs highland benchmark
most-perf@0.10.0 /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
├── baconjs@3.0.3
├── benchmark@2.1.4
├── highland@2.13.4
├── kefir@3.8.6
├── rxjs@6.5.2
└── xstream@11.11.0
```

## Node

```
❯ node --version
v12.1.0

❯ npm start

> most-perf@0.10.0 start /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> npm run filter-map-reduce && npm run chain && npm run concatMap && npm run merge && npm run merge-nested && npm run zip && npm run scan && npm run slice && npm run skipRepeats && npm run switch


> most-perf@0.10.0 filter-map-reduce /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./filter-map-reduce

filter -> map -> reduce 1000000 integers
-------------------------------------------------------
most                570.23 op/s ±  1.46%   (80 samples)
rx 6                 39.10 op/s ±  2.97%   (63 samples)
xstream              20.04 op/s ±  2.29%   (50 samples)
kefir                15.18 op/s ±  1.58%   (70 samples)
bacon                 2.71 op/s ±  2.24%   (18 samples)
highland              4.16 op/s ±  2.60%   (25 samples)
-------------------------------------------------------

> most-perf@0.10.0 chain /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./chain.js

chain 1000 x 1000 streams
-------------------------------------------------------
most                149.64 op/s ±  1.19%   (82 samples)
rx 6                 84.77 op/s ± 10.56%   (79 samples)
xstream              15.49 op/s ±  1.39%   (71 samples)
kefir                13.72 op/s ±  1.82%   (65 samples)
bacon                 1.94 op/s ±  1.81%   (14 samples)
highland              0.32 op/s ±  2.96%    (6 samples)
-------------------------------------------------------

> most-perf@0.10.0 concatMap /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./concatMap.js

concatMap 1000 x 1000 streams
-------------------------------------------------------
most                127.66 op/s ±  1.10%   (72 samples)
rx 6                 85.24 op/s ± 11.93%   (80 samples)
xstream              16.35 op/s ±  1.55%   (74 samples)
kefir                13.66 op/s ±  1.63%   (64 samples)
bacon                 1.93 op/s ±  2.62%   (14 samples)
-------------------------------------------------------

> most-perf@0.10.0 merge /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./merge.js

merge 100000 x 10 streams
-------------------------------------------------------
most                205.24 op/s ±  1.65%   (80 samples)
rx 6                 89.17 op/s ±  9.99%   (80 samples)
xstream              28.31 op/s ±  2.95%   (67 samples)
kefir                13.97 op/s ±  2.10%   (66 samples)
bacon                 2.54 op/s ±  1.42%   (17 samples)
-------------------------------------------------------

> most-perf@0.10.0 merge-nested /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./merge-nested.js

merge nested streams w/depth 2, 5, 10, 100 (10000 items in each stream)
-------------------------------------------------------
most (depth 2)     6809.98 op/s ±  1.51%   (78 samples)
most (depth 5)     3481.37 op/s ±  1.43%   (81 samples)
most (depth 10)    1895.50 op/s ±  1.49%   (81 samples)
most (depth 100)    201.21 op/s ±  2.22%   (81 samples)
rx 6 (depth 2)     1757.87 op/s ±  2.66%   (77 samples)
rx 6 (depth 5)      637.94 op/s ±  2.02%   (80 samples)
rx 6 (depth 10)     244.55 op/s ±  1.73%   (78 samples)
rx 6 (depth 100)      2.95 op/s ±  2.95%   (19 samples)
xstream (depth 2)   900.90 op/s ±  2.21%   (80 samples)
xstream (depth 5)   324.19 op/s ±  1.01%   (84 samples)
xstream (depth 10)  120.61 op/s ±  1.06%   (77 samples)
xstream (depth 100)    1.70 op/s ±  2.52%   (13 samples)
kefir (depth 2)     398.11 op/s ±  2.60%   (80 samples)
kefir (depth 5)     134.14 op/s ±  1.72%   (79 samples)
kefir (depth 10)     49.13 op/s ±  1.66%   (75 samples)
kefir (depth 100)     0.57 op/s ±  5.17%    (7 samples)
bacon (depth 2)      60.73 op/s ± 12.26%   (75 samples)
bacon (depth 5)      27.29 op/s ±  1.44%   (64 samples)
bacon (depth 10)     11.22 op/s ±  1.38%   (55 samples)
bacon (depth 100)     0.16 op/s ± 19.71%    (5 samples)
highland (depth 2)    3.30 op/s ±  8.28%   (21 samples)
highland (depth 5)    3.39 op/s ±  4.85%   (21 samples)
highland (depth 10)    0.38 op/s ±  2.03%    (6 samples)
-------------------------------------------------------

> most-perf@0.10.0 zip /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./zip.js

zip 2 x 100000 integers
-------------------------------------------------------
most                113.84 op/s ± 14.50%   (77 samples)
rx 6                  0.88 op/s ±  3.00%    (9 samples)
kefir                 0.87 op/s ±  1.74%    (9 samples)
bacon                 0.09 op/s ± 10.27%    (5 samples)
highland              0.07 op/s ±  2.22%    (5 samples)
-------------------------------------------------------

> most-perf@0.10.0 scan /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./scan.js

scan -> reduce 1000000 integers
-------------------------------------------------------
most                330.25 op/s ±  1.09%   (80 samples)
rx 6                 26.11 op/s ±  4.33%   (63 samples)
xstream              15.08 op/s ±  1.85%   (69 samples)
kefir                17.35 op/s ±  1.70%   (44 samples)
bacon                 1.99 op/s ±  1.65%   (14 samples)
highland              4.64 op/s ±  1.98%   (27 samples)
-------------------------------------------------------

> most-perf@0.10.0 slice /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./slice.js

skip(n/4) -> take(n/2) 1000000 integers
-------------------------------------------------------
most                237.70 op/s ±  1.25%   (79 samples)
rx 6                148.89 op/s ±  1.06%   (81 samples)
xstream              21.92 op/s ±  1.86%   (52 samples)
kefir                15.49 op/s ±  8.02%   (73 samples)
bacon                 3.27 op/s ±  2.80%   (20 samples)
highland              5.16 op/s ±  1.56%   (28 samples)
-------------------------------------------------------

> most-perf@0.10.0 skipRepeats /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./skipRepeats.js

skipRepeats -> reduce 2 x 1000000 integers
-------------------------------------------------------
most                350.57 op/s ±  1.13%   (80 samples)
rx 6                119.72 op/s ±  0.80%   (75 samples)
xstream              31.36 op/s ±  3.70%   (71 samples)
kefir                17.36 op/s ± 18.44%   (50 samples)
bacon                 2.88 op/s ±  1.85%   (19 samples)
-------------------------------------------------------

> most-perf@0.10.0 switch /Users/brian/Projects/cujojs/@most/core/packages/core/test/perf
> babel-node --presets env ./switch.js

switch 10000 x 1000 streams
-------------------------------------------------------
most               1160.19 op/s ±  2.87%   (77 samples)
rx 6                  9.66 op/s ±  4.92%   (49 samples)
xstream               1.36 op/s ±  1.41%   (11 samples)
kefir                 1.41 op/s ±  2.54%   (11 samples)
bacon                 0.06 op/s ±  0.97%    (5 samples)
-------------------------------------------------------
```
