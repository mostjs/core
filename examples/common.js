const fail = (s) => { throw new Error(s) }
export const qs = (s, el) => el.querySelector(s) || fail(`${s} not found`)
