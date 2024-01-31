import Event from "events";
import { useEffect, useState } from "react";
import { type Middleware } from "./middleware/index.js";

export type State<T> = T | ((state: T) => T);
export type Dispatch<T> = (val: State<T>) => void;
type Callback<T> = (state: T) => void;

export interface Listener<T> {
  on(evt: "state", callback: Callback<T>): void;
  off(evt: "state", callback: Callback<T>): void;
  emit(evt: "state", state: T): void;
}
function isCallable(val: unknown): val is CallableFunction {
  return typeof val === "function";
}

function resolveState<T>(state: State<T>, initial: T) {
  return isCallable(state) ? state(initial) : state;
}

export function createState<T>(initial: T, ...middlewares: Middleware<T>[]) {
  const listener: Listener<T> = new Event();

  let prevState = initial;
  for (const middleware of middlewares) {
    prevState = middleware(listener, prevState);
  }
  function useAnyState(): [T, Dispatch<T>] {
    const [state, setState] = useState<T>(prevState);
    useEffect(() => {
      function handler(value: T) {
        setState(value);
      }
      listener.on("state", handler);
      return () => {
        listener.off("state", handler);
      };
    }, []);
    function newState(value: State<T>) {
      prevState = resolveState(value, prevState);
      setState(prevState);
      listener.emit("state", prevState);
    }
    return [state, newState];
  }

  useAnyState.dispatch = function dispatch(state: State<T>) {
    prevState = resolveState(state, prevState);
    listener.emit("state", prevState);
  };

  useAnyState.onChange = function onChange(callback: Callback<T>) {
    listener.on("state", callback);
  };

  useAnyState.getState = function getState() {
    return prevState;
  };

  useAnyState.listener = listener;
  return useAnyState;
}
