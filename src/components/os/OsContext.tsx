"use client";

import { createContext, useContext } from "react";
import type { AppId, OpenExtra } from "@/lib/os-state";

export type OsApi = {
  openApp: (app: AppId, extra?: OpenExtra) => void;
  openProject: (slug: string) => void;
  goHome: () => void;
};

const OsContext = createContext<OsApi | null>(null);

export function OsProvider({
  value,
  children,
}: {
  value: OsApi;
  children: React.ReactNode;
}) {
  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const api = useContext(OsContext);
  if (!api) {
    throw new Error("useOs precisa estar dentro do desktop");
  }
  return api;
}
