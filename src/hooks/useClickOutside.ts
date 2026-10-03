import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(onOutside: () => void, enabled = true) {
  const ref = useRef<T>(null);

  const callbackRef = useRef(onOutside);
  callbackRef.current = onOutside;

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [enabled]);

  return ref;
}