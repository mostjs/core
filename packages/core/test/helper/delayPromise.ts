export default function delayPromise <A> (ms: number, x: A): Promise<A> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(x)
    }, ms)
  })
}
