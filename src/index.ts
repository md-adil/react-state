import Event from "events";
import { useEffect, useState } from "react";

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
    function newState(value: T) {
      setState(value);
      shared = value;
      listener.emit("data", value);
    }
    return [state, newState] as const;
  }

  useAnyState.dispatch = function dispatch(data: T) {
    listener.emit("data", data);
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
