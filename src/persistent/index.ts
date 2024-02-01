import type { Middleware } from "../middleware/index.js";

export interface PersistentEngine<T> {
  set(val: T): void;
  get(): T;
}
export function createPersistent<T>(
  engine: PersistentEngine<T> | null
): Middleware<T> {
  function handleSave(val: T) {
    engine!.set(val);
    return val;
  }
  return function doPersist(initial, onChange) {
    if (!engine) return initial;
    onChange(handleSave);
    return engine.get() ?? initial;
  };
}
