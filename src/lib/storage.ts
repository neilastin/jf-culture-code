/**
 * localStorage that never throws. Private windows, blocked storage and
 * server rendering all fall back to "nothing stored".
 */
const PREFIX = "jf-culture-code:v1:";

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the demo keeps working for this session.
  }
}
