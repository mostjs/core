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

    function cons(x, array) {
        var l = array.length;
        var a = new Array(l + 1);
        a[0] = x;
        for (var i = 0; i < l; ++i) {
            a[i + 1] = array[i];
        }
        return a;
    }

    function append(x, a) {
        var l = a.length;
        var b = new Array(l + 1);
        for (var i = 0; i < l; ++i) {
            b[i] = a[i];
        }

        b[l] = x;
        return b;
    }

    function drop(n, array) {
        var l = array.length;
        if (n >= l) {
            return [];
        }

        l -= n;
        var a = new Array(l);
        for (var i = 0; i < l; ++i) {
            a[i] = array[n + i];
        }
        return a;
    }

    function tail(array) {
        return drop(1, array);
    }

    function copy(array) {
        var l = array.length;
        var a = new Array(l);
        for (var i = 0; i < l; ++i) {
            a[i] = array[i];
        }
        return a;
    }

    function map(f, array) {
        var l = array.length;
        var a = new Array(l);
        for (var i = 0; i < l; ++i) {
            a[i] = f(array[i]);
        }
        return a;
    }

    function reduce(f, z, array) {
        var r = z;
        for (var i = 0, l = array.length; i < l; ++i) {
            r = f(r, array[i], i);
        }
        return r;
    }

    function replace(x, i, array) {
        var l = array.length;
        var a = new Array(l);
        for (var _j = 0; _j < l; ++_j) {
            a[_j] = i === _j ? x : array[_j];
        }
        return a;
    }

    function unsafeRemove(index, a, l) {
        var b = new Array(l);
        var i = undefined;
        for (i = 0; i < index; ++i) {
            b[i] = a[i];
        }
        for (i = index; i < l; ++i) {
            b[i] = a[i + 1];
        }

        return b;
    }

    function removeAll(f, a) {
        var l = a.length;
        var b = new Array(l);
        for (var x, i = 0, _j2 = 0; i < l; ++i) {
            x = a[i];
            if (!f(x)) {
                b[_j2] = x;
                ++_j2;
            }
        }

        b.length = j;
        return b;
    }

    function findIndex(x, a) {
        for (var i = 0, l = a.length; i < l; ++i) {
            if (x === a[i]) {
                return i;
            }
        }
        return -1;
    }

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
    exports.unsafeRemove = unsafeRemove;
    exports.removeAll = removeAll;
    exports.findIndex = findIndex;
    exports.isArrayLike = isArrayLike;
    exports.id = id;
    exports.compose = compose;
    exports.apply = apply;
});
