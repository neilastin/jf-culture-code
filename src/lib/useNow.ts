"use client";

import { useSyncExternalStore } from "react";

let clientNow: Date | null = null;
const noop = () => () => {};

/**
 * The visitor's current time, or null during server render and hydration,
 * so relative dates ("Today") never cause a hydration mismatch.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(
    noop,
    () => (clientNow ??= new Date()),
    () => null,
  );
}
