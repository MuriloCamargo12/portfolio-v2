"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeApi = {
  night: boolean;
  toggleNight: () => void;
};

const ThemeContext = createContext<ThemeApi | null>(null);
const STORAGE_KEY = "muriloos-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "light") setNight(false);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = night ? "dark" : "light";
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, night ? "dark" : "light");
  }, [night, ready]);

  return (
    <ThemeContext.Provider value={{ night, toggleNight: () => setNight((current) => !current) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme precisa estar dentro do desktop");
  return theme;
}
