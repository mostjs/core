export default Iteration

function Iteration <A> (done: boolean, value: A) {
  this.done = done
  this.value = value
}

Iteration.DONE = new Iteration(true, void 0)
