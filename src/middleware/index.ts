import { type Listener } from "../index.js";

export type Middleware<T> = (listener: Listener<T>, initial: T) => T;
