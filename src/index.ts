import Event from "events";
import { useEffect, useState } from "react";
type State<T> = T | ((state: T) => T);
type Dispatch<T> = (val: State<T>) => void;

interface Action<T> {
  dispatch: Dispatch<T>;
  onChange: (state: T) => void;
}

interface Listener<T> {
  on(evt: "data", callback: (state: T) => void): void;
  off(evt: "data", callback: (state: T) => void): void;
  emit(evt: "data", state: T): void;
}
function isCallable(val: unknown): val is CallableFunction {
  return typeof val === "function";
}

function resolveState<T>(state: State<T>, initial: T) {
  return isCallable(state) ? state(initial) : state;
}

export function createState<T, U = T>(): (() => [U, Dispatch<U>]) & Action<U>;
export function createState<T>(
  initial: T
): (() => [T, Dispatch<T>]) & Action<T>;
export function createState<T>(initial?: T) {
  const listener: Listener<T> = new Event();
  let prevState = initial as T;
  function useAnyState(): [T, Dispatch<T>] {
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
      prevState = resolveState(value!, prevState);
      setState(prevState);
      listener.emit("data", prevState);
    }
    return [state, newState];
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

const useProfile = createState(null);
const [profile, setProfile] = useProfile();
setProfile(null);
