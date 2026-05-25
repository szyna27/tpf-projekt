export const ACTIVE_SESSION_CHANGED = 'tm:active-session-changed';

export function emitActiveSessionChanged() {
  try {
    window.dispatchEvent(new Event(ACTIVE_SESSION_CHANGED));
  } catch {
    // no-op in non-browser
  }
}

export function onActiveSessionChanged(handler: () => void) {
  const fn = () => handler();
  try {
    window.addEventListener(ACTIVE_SESSION_CHANGED, fn);
  } catch {
    // no-op
  }
  return () => {
    try {
      window.removeEventListener(ACTIVE_SESSION_CHANGED, fn);
    } catch {}
  };
}
