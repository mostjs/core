# Types

### Stream

```haskell
type Stream = {
  run :: Sink a -> Scheduler -> Disposable
}
```
