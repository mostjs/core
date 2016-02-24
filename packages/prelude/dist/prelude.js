(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('@most/prelude', ['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.mostPrelude = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /** @license MIT License (c) copyright 2010-2016 original author or authors */

    // Non-mutating array operations

    // cons :: a -> [a] -> [a]
    // a with x prepended
    function cons(x, a) {
        var l = a.length;
        var b = new Array(l + 1);
        b[0] = x;
        for (var i = 0; i < l; ++i) {
            b[i + 1] = a[i];
        }
        return b;
    }

    // append :: a -> [a] -> [a]
    // a with x appended
    function append(x, a) {
        var l = a.length;
        var b = new Array(l + 1);
        for (var i = 0; i < l; ++i) {
            b[i] = a[i];
        }

        b[l] = x;
        return b;
    }

    // drop :: Int -> [a] -> [a]
    // drop first n elements
    function drop(n, a) {
        if (n < 0) {
            throw new TypeError('n must be >= 0');
        }

        var l = a.length;
        if (n === 0 || l === 0) {
            return a;
        }

        if (n >= l) {
            return [];
        }

        return unsafeDrop(n, a, l - n);
    }

    // unsafeDrop :: Int -> [a] -> Int -> [a]
    // Internal helper for drop
    function unsafeDrop(n, a, l) {
        var b = new Array(l);
        for (var i = 0; i < l; ++i) {
            b[i] = a[n + i];
        }
        return b;
    }

    // tail :: [a] -> [a]
    // drop head element
    function tail(a) {
        return drop(1, a);
    }

    // copy :: [a] -> [a]
    // duplicate a (shallow duplication)
    function copy(a) {
        var l = a.length;
        var b = new Array(l);
        for (var i = 0; i < l; ++i) {
            b[i] = a[i];
        }
        return b;
    }

    // map :: (a -> b) -> [a] -> [b]
    // transform each element with f
    function map(f, a) {
        var l = a.length;
        var b = new Array(l);
        for (var i = 0; i < l; ++i) {
            b[i] = f(a[i]);
        }
        return b;
    }

    // reduce :: (a -> b -> a) -> a -> [b] -> a
    // accumulate via left-fold
    function reduce(f, z, a) {
        var r = z;
        for (var i = 0, l = a.length; i < l; ++i) {
            r = f(r, a[i], i);
        }
        return r;
    }

    // replace :: a -> Int -> [a]
    // replace element at index
    function replace(x, i, a) {
        if (i < 0) {
            throw new TypeError('i must be >= 0');
        }

        var l = a.length;
        var b = new Array(l);
        for (var j = 0; j < l; ++j) {
            b[j] = i === j ? x : a[j];
        }
        return b;
    }

    // remove :: Int -> [a] -> [a]
    // remove element at index
    function remove(i, a) {
        if (i < 0) {
            throw new TypeError('i must be >= 0');
        }

        var l = a.length;
        if (l === 0 || i >= l) {
            // exit early if index beyond end of array
            return a;
        }

        if (l === 1) {
            // exit early if index in bounds and length === 1
            return [];
        }

        return unsafeRemove(i, a, l - 1);
    }

    // unsafeRemove :: Int -> [a] -> Int -> [a]
    // Internal helper to remove element at index
    function unsafeRemove(i, a, l) {
        var b = new Array(l);
        var j = undefined;
        for (j = 0; j < i; ++j) {
            b[j] = a[j];
        }
        for (j = i; j < l; ++j) {
            b[j] = a[j + 1];
        }

        return b;
    }

    // removeAll :: (a -> boolean) -> [a] -> [a]
    // remove all elements matching a predicate
    function removeAll(f, a) {
        var l = a.length;
        var b = new Array(l);
        var j = 0;
        for (var x, i = 0; i < l; ++i) {
            x = a[i];
            if (!f(x)) {
                b[j] = x;
                ++j;
            }
        }

        b.length = j;
        return b;
    }

    // findIndex :: a -> [a] -> Int
    // find index of x in a, from the left
    function findIndex(x, a) {
        for (var i = 0, l = a.length; i < l; ++i) {
            if (x === a[i]) {
                return i;
            }
        }
        return -1;
    }

    // isArrayLike :: * -> boolean
    // Return true iff x is array-like
    function isArrayLike(x) {
        return x != null && typeof x.length === 'number' && typeof x !== 'function';
    }

    /** @license MIT License (c) copyright 2010-2016 original author or authors */

    // id :: a -> a
    var id = function id(x) {
        return x;
    };

    // compose :: (b -> c) -> (a -> b) -> (a -> c)
    var compose = function compose(f, g) {
        return function (x) {
            return f(g(x));
        };
    };

    // apply :: (a -> b) -> a -> b
    var apply = function apply(f, x) {
        return f(x);
    };

    exports.cons = cons;
    exports.append = append;
    exports.drop = drop;
    exports.tail = tail;
    exports.copy = copy;
    exports.map = map;
    exports.reduce = reduce;
    exports.replace = replace;
    exports.remove = remove;
    exports.removeAll = removeAll;
    exports.findIndex = findIndex;
    exports.isArrayLike = isArrayLike;
    exports.id = id;
    exports.compose = compose;
    exports.apply = apply;
});
