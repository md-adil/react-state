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
  let prevState = initial;
  function useAnyState() {
    const [state, setState] = useState<T>(prevState);
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
      prevState = resolveState(value, prevState);
      setState(prevState);
      listener.emit("data", prevState);
    }
    return [state, newState] as const;
  }

  useAnyState.dispatch = function dispatch(state: State<T>) {
    prevState = resolveState(state, prevState);
    listener.emit("data", prevState);
  };

  useAnyState.onChange = function onChange(callback: (data: T) => void) {
    listener.on("data", callback);
  };

  useAnyState.getState = function getState() {
    return prevState;
  };

  useAnyState.listener = listener;
  return useAnyState;
}
