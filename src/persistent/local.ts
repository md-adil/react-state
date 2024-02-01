import { type PersistentEngine } from "./index.js";

function isSupported() {
  const test = "$$3e2r342";
  try {
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function localStore<T>(name: string): PersistentEngine<T> | null {
  if (!isSupported()) {
    return null;
  }
  return {
    get() {
      const val = localStorage.getItem(name);
      if (!val) return;
      return JSON.parse(val);
    },
    set(val) {
      localStorage.setItem(name, JSON.stringify(val));
    },
  };
}
