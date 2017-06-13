# Transform

## map

```haskell
 map :: (a -> b) -> Stream a -> Stream b
 ```

```js
map(x => x + 1, stream)
```

##### map-example

## chain

```haskell
chain :: (a -> Stream b) -> Stream a -> Stream b
```

```js
chain(x => just(x + 1), stream)
```

##### chain-example
