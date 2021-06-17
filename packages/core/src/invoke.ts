/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * TODO: find a better way (without `any`)
 * might be possible using typescript's 4.0 "Variadic Tuple Types"
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
 */
export default function invoke<Args extends any[], R>(f: (...args: any) => R, args: Args): R {
  /* eslint complexity: [2,7] */
  switch (args.length) {
    case 0: return f()
    case 1: return f(args[0])
    case 2: return f(args[0], args[1])
    case 3: return f(args[0], args[1], args[2])
    case 4: return f(args[0], args[1], args[2], args[3])
    case 5: return f(args[0], args[1], args[2], args[3], args[4])
    default:
      return f.apply(undefined, args)
  }
}
