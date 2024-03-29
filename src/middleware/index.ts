import type { EventEmitter as Listener } from "events";

type Callback<T> = (state: T) => T;
type OnChange<T> = (callback: Callback<T>) => void;

export type Middleware<T> = (
  initial: T,
  onChange: OnChange<T>,
  listener: Listener
) => T;

export function apply<T>(
  initial: T,
  middlewares: Middleware<T>[],
  listener: Listener
) {
  const callbacks: Callback<T>[] = [];

  for (const middleware of middlewares) {
    initial = middleware(initial, (cb) => callbacks.push(cb), listener);
  }

  function filter(value: T) {
    for (const cb of callbacks) {
      value = cb(value);
    }
    return value;
  }

  return [initial, filter] as const;
}
