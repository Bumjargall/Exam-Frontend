"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownKeys = "key" | "status" | "download" | "print" | "send";

export default function useDropdowns<T extends string>(keys: T[]) {
  const [dropdownStates, setDropdownStates] = useState(
    Object.fromEntries(keys.map((k) => [k, false])) as Record<T, boolean>
  );

  const refs = useRef<Record<T, HTMLDivElement | null>>(
    Object.fromEntries(keys.map((k) => [k, null])) as Record<
      T,
      HTMLDivElement | null
    >
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      keys.forEach((key) => {
        const ref = refs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownStates((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [keys]);

  const toggleDropdown = (key: T) => {
    setDropdownStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAllDropdowns = () => {
    setDropdownStates(
      Object.fromEntries(keys.map((k) => [k, false])) as Record<T, boolean>
    );
  };

  return {
    dropdownStates,
    toggleDropdown,
    closeAllDropdowns,
    refs,
  };
}
