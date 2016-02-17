/** @license MIT License (c) copyright 2010-2016 original author or authors */

export function cons(x, array) {
    const l = array.length;
    const a = new Array(l + 1);
    a[0] = x;
    for (let i = 0; i < l; ++i) {
        a[i + 1] = array[i];
    }
    return a;
}

export function append(x, a) {
    const l = a.length;
    const b = new Array(l + 1);
    for (let i = 0; i < l; ++i) {
        b[i] = a[i];
    }

    b[l] = x;
    return b;
}

export function drop(n, array) {
    let l = array.length;
    if (n >= l) {
        return [];
    }

    l -= n;
    const a = new Array(l);
    for (let i = 0; i < l; ++i) {
        a[i] = array[n + i];
    }
    return a;
}

export function tail(array) {
    return drop(1, array);
}

export function copy(array) {
    const l = array.length;
    const a = new Array(l);
    for (let i = 0; i < l; ++i) {
        a[i] = array[i];
    }
    return a;
}

export function map(f, array) {
    const l = array.length;
    const a = new Array(l);
    for (let i = 0; i < l; ++i) {
        a[i] = f(array[i]);
    }
    return a;
}

export function reduce(f, z, array) {
    let r = z;
    for (let i = 0, l = array.length; i < l; ++i) {
        r = f(r, array[i], i);
    }
    return r;
}

export function replace(x, i, array) {
    const l = array.length;
    const a = new Array(l);
    for (let j = 0; j < l; ++j) {
        a[j] = i === j ? x : array[j];
    }
    return a;
}

function remove(index, array) {
    const l = array.length;
    if (l === 0 || index >= array) { // exit early if index beyond end of array
        return array;
    }

    if (l === 1) { // exit early if index in bounds and length === 1
        return [];
    }

    return unsafeRemove(index, array, l - 1);
}

export function unsafeRemove(index, a, l) {
    const b = new Array(l);
    let i;
    for (i = 0; i < index; ++i) {
        b[i] = a[i];
    }
    for (i = index; i < l; ++i) {
        b[i] = a[i + 1];
    }

    return b;
}

export function removeAll(f, a) {
    const l = a.length;
    const b = new Array(l);
    for (let x, i = 0, j = 0; i < l; ++i) {
        x = a[i];
        if (!f(x)) {
            b[j] = x;
            ++j;
        }
    }

    b.length = j;
    return b;
}

export function findIndex(x, a) {
    for (let i = 0, l = a.length; i < l; ++i) {
        if (x === a[i]) {
            return i;
        }
    }
    return -1;
}

export function isArrayLike(x) {
    return x != null && typeof x.length === 'number' && typeof x !== 'function';
}
