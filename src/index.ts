import Event from "events";
import { useEffect, useState } from "react";
type State<T> = T | ((state: T) => T);

function isCallable(val: unknown): val is CallableFunction {
  return typeof val === "function";
}

function resolveState<T>(state: State<T>, initial: T) {
  return isCallable(state) ? state(initial) : state;
}

export function createState<T>(initial?: T) {
  const listener = new Event();
  let shared = initial;
  function useAnyState() {
    const [state, setState] = useState<T>(shared);
    useEffect(() => {
      function handler(value: T) {
        setState(value);
      }
      listener.on("data", handler);
      return () => {
        listener.off("data", handler);
      };
    }, []);
    function newState(value: State<T>) {
      shared = resolveState(value, shared);
      setState(shared);
      listener.emit("data", shared);
    }
    return [state, newState] as const;
  }

  useAnyState.dispatch = function dispatch(data: State<T>) {
    listener.emit("data", resolveState(data, shared));
  };

  useAnyState.onChange = function onChange(callback: (data: T) => void) {
    listener.on("data", callback);
  };

  useAnyState.getState = function getState() {
    return shared;
  };

  useAnyState.listener = listener;

  return useAnyState;
}
