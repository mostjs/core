export class VirtualTimer {
  constructor () {
    this._now = 0
    this._target = 0
  }

  now () {
    return this._now
  }

  setTimer (f, dt) {
    this._target = this._target + dt
    const task = { active: true, f }
    this._run(task, this._target)
    return task
  }

  clearTimer (t) {
    if (!t) {
      return
    }
    t.active = false
  }

  _run (task, t) {
    setTimeout((task, t, vt) => {
      if (!task.active) {
        return
      }
      vt._now = t
      task.f.call(undefined, t)
      vt._now = vt._target + 1
    }, 0, task, t, this)
  }
}
