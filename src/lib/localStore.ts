"use client";

import { useSyncExternalStore } from "react";
import { readStored, writeStored } from "./storage";

export type LocalStore<T> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((prev: T) => T)) => void;
};

/**
 * A tiny external store backed by localStorage. Server render and hydration
 * use the fallback; the stored value takes over straight after, so there is
 * never a hydration mismatch.
 */
export function createLocalStore<T>(key: string, fallback: T): LocalStore<T> {
  let cache: T | undefined;
  const listeners = new Set<() => void>();
  const get = () => {
    if (cache === undefined) cache = readStored(key, fallback);
    return cache;
  };
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: get,
    getServerSnapshot: () => fallback,
    set(next) {
      cache = typeof next === "function" ? (next as (prev: T) => T)(get()) : next;
      writeStored(key, cache);
      listeners.forEach((l) => l());
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
