"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
});

export const THEME_STORAGE_KEY = "trustedaccounts-theme";

/**
 * Inline script for <head>: applies the saved theme before first paint so
 * there's no flash of the wrong theme on load.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(d?'dark':'light');}catch(e){}})();`;

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = THEME_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Read the saved preference after mount (avoids hydration mismatches).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey) as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") setThemeState(saved);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const next = theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;
      root.classList.add("theme-switching");
      root.classList.remove("light", "dark");
      root.classList.add(next);
      setResolvedTheme(next);
      // Re-enable transitions on the next frame.
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    };
    apply();

    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
      setThemeState(next);
    },
    [storageKey]
  );

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
