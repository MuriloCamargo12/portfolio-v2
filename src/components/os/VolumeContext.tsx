"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { setClickVolume } from "@/lib/click-sound";

type VolumeApi = {
  volume: number;
  setVolume: (value: number) => void;
  toggleMute: () => number;
};

const VolumeContext = createContext<VolumeApi | null>(null);
const STORAGE_KEY = "muriloos-volume";
const LAST_KEY = "muriloos-volume-last";

function clampVolume(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  const [volume, setVolumeState] = useState(60);
  const [lastAudible, setLastAudible] = useState(60);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedLast = localStorage.getItem(LAST_KEY);
    const parsed = saved === null ? null : Number(saved);
    const parsedLast = savedLast === null ? null : Number(savedLast);
    const next = parsed !== null && Number.isFinite(parsed) ? clampVolume(parsed) : 60;
    const last =
      parsedLast !== null && Number.isFinite(parsedLast) && parsedLast > 0
        ? clampVolume(parsedLast)
        : next > 0
          ? next
          : 60;
    setVolumeState(next);
    setLastAudible(last);
    setReady(true);
  }, []);

  useEffect(() => {
    setClickVolume(volume);
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, String(volume));
    if (lastAudible > 0) localStorage.setItem(LAST_KEY, String(lastAudible));
  }, [volume, lastAudible, ready]);

  function setVolume(value: number) {
    const next = clampVolume(value);
    setVolumeState(next);
    if (next > 0) setLastAudible(next);
  }

  function toggleMute() {
    if (volume <= 0) {
      const next = lastAudible > 0 ? lastAudible : 60;
      setVolumeState(next);
      return next;
    }
    setLastAudible(volume);
    setVolumeState(0);
    return 0;
  }

  return (
    <VolumeContext.Provider value={{ volume, setVolume, toggleMute }}>{children}</VolumeContext.Provider>
  );
}

export function useVolume() {
  const volume = useContext(VolumeContext);
  if (!volume) throw new Error("useVolume precisa estar dentro do desktop");
  return volume;
}
