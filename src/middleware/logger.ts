import { type Listener } from "../index.js";

export function createLogger<T>(prefix: string, log = console.log) {
  return (listener: Listener<T>, initial: T) => {
    listener.on("state", (data) => {
      log(prefix, data);
    });
    return initial;
  };
}
