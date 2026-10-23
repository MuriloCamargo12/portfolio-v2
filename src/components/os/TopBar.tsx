"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { BatteryIcon, VolumeIcon, WifiIcon } from "@/components/os/icons";
import { useTheme } from "@/components/os/ThemeContext";
import { useVolume } from "@/components/os/VolumeContext";
import { previewClick, setClickVolume } from "@/lib/click-sound";
import { cn } from "@/lib/cn";

type Menu = "wifi" | "volume" | "battery" | "calendar";

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function formatClock(date: Date) {
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(date)
    .replace(".", "");
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(".", "");
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${weekday} ${date.getDate()} ${month}  ${time}`;
}

function monthTitle(date: Date) {
  const title = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function shiftMonth(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function monthCells(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function TopBar({ onOpenAbout }: { onOpenAbout: () => void }) {
  const [now, setNow] = useState<Date | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const { volume, setVolume, toggleMute } = useVolume();
  const [view, setView] = useState<Date | null>(null);
  const { night, toggleNight } = useTheme();

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!menu) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement;
      if (target.closest(`[data-menu="${menu}"]`)) return;
      setMenu(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(null);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  function toggle(next: Menu) {
    setMenu((current) => (current === next ? null : next));
  }

  function toggleCalendar() {
    setView(new Date());
    toggle("calendar");
  }

  return (
    <header
      data-topbar
      className="relative z-50 flex h-8 items-center border-b border-[var(--os-bar-hover)] bg-[var(--os-bar)] px-1 text-[13px] text-[var(--os-bar-text)]"
    >
      <p className="px-3 font-medium tracking-wide">🖥️ MuriloOS</p>
      <div data-menu="calendar" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          aria-label="Calendário"
          aria-expanded={menu === "calendar"}
          onClick={toggleCalendar}
          className="min-w-40 rounded-md px-2 py-0.5 text-center tabular-nums hover:bg-[var(--os-bar-hover)]"
        >
          {now ? formatClock(now) : "\u00a0"}
        </button>
        {menu === "calendar" && view && now ? (
          <div
            role="dialog"
            aria-label="Calendário"
            className="absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl bg-[#242424] p-3 text-left text-white shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Mês anterior"
                onClick={() => setView((current) => (current ? shiftMonth(current, -1) : current))}
                className="grid size-6 place-items-center rounded-md text-white/80 hover:bg-white/10"
              >
                ‹
              </button>
              <p className="truncate text-sm font-medium">{monthTitle(view)}</p>
              <button
                type="button"
                aria-label="Próximo mês"
                onClick={() => setView((current) => (current ? shiftMonth(current, 1) : current))}
                className="grid size-6 place-items-center rounded-md text-white/80 hover:bg-white/10"
              >
                ›
              </button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px]">
              {WEEKDAYS.map((day) => (
                <span key={day} className="text-white/40">
                  {day}
                </span>
              ))}
              {monthCells(view).map((day, index) => {
                const current =
                  day === now.getDate() &&
                  view.getMonth() === now.getMonth() &&
                  view.getFullYear() === now.getFullYear();
                return (
                  <span
                    key={`${view.getMonth()}-${index}`}
                    className={cn(
                      "grid h-7 place-items-center rounded-full",
                      current && "bg-[#e95420] font-medium",
                      day !== null && !current && "text-white/85",
                    )}
                  >
                    {day ?? ""}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-2 pr-1.5">
        <button
          type="button"
          onClick={toggleNight}
          aria-label={night ? "Ativar modo claro" : "Ativar modo noturno"}
          aria-pressed={!night}
          className="grid size-6 place-items-center rounded-full hover:bg-[var(--os-bar-hover)]"
        >
          {night ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="hidden items-center gap-1.5 sm:flex">
          <div data-menu="wifi" className="relative">
            <button
              type="button"
              aria-label="Wi-Fi"
              aria-expanded={menu === "wifi"}
              onClick={() => toggle("wifi")}
              className="grid size-6 place-items-center rounded-full hover:bg-[var(--os-bar-hover)]"
            >
              <WifiIcon />
            </button>
            {menu === "wifi" ? (
              <MenuCard label="Wi-Fi">
                <p className="text-[11px] tracking-wide text-white/45 uppercase">Wi-Fi</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="size-2 shrink-0 rounded-full bg-[#62d13e]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">Murilo</p>
                    <p className="text-xs text-white/55">Conectado</p>
                  </div>
                </div>
              </MenuCard>
            ) : null}
          </div>
          <div data-menu="volume" className="relative">
            <button
              type="button"
              aria-label="Volume"
              aria-expanded={menu === "volume"}
              onClick={() => toggle("volume")}
              className="grid size-6 place-items-center rounded-full hover:bg-[var(--os-bar-hover)]"
            >
              <VolumeIcon muted={volume === 0} />
            </button>
            {menu === "volume" ? (
              <MenuCard label="Volume" className="w-44">
                <p className="text-[11px] tracking-wide text-white/45 uppercase">Som</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={volume === 0 ? "Ativar som" : "Mutar"}
                    aria-pressed={volume === 0}
                    onClick={() => {
                      const next = toggleMute();
                      setClickVolume(next);
                      if (next > 0) previewClick();
                    }}
                    className="grid size-7 shrink-0 place-items-center rounded-md text-white/90 hover:bg-white/10"
                  >
                    <VolumeIcon muted={volume === 0} />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    aria-label="Nível do volume"
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setVolume(next);
                      setClickVolume(next);
                      previewClick();
                    }}
                    className="w-full accent-[#e95420]"
                  />
                </div>
                <p className="mt-1 text-xs text-white/55">{volume === 0 ? "Mudo" : `${volume}%`}</p>
              </MenuCard>
            ) : null}
          </div>
          <div data-menu="battery" className="relative">
            <button
              type="button"
              aria-label="Bateria"
              aria-expanded={menu === "battery"}
              onClick={() => toggle("battery")}
              className="grid size-6 place-items-center rounded-full hover:bg-[var(--os-bar-hover)]"
            >
              <BatteryIcon />
            </button>
            {menu === "battery" ? (
              <MenuCard label="Bateria" className="w-44">
                <p className="text-[11px] tracking-wide text-white/45 uppercase">Bateria</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="size-2 shrink-0 rounded-full bg-[#62d13e]" />
                  <div>
                    <p className="text-sm font-medium">100%</p>
                    <p className="text-xs text-white/55">Carregado</p>
                  </div>
                </div>
              </MenuCard>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAbout}
          aria-label="Abrir sobre"
          className="relative size-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/70"
        >
          <img
            src="/murilo-avatar.png?v=4"
            alt=""
            className="size-full object-contain object-center"
          />
          {profile.available ? (
            <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-[#62d13e] ring-2 ring-[var(--os-bar)]" />
          ) : null}
        </button>
      </div>
    </header>
  );
}

function MenuCard({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-label={label}
      className={cn(
        "absolute top-full right-0 z-50 mt-2 w-52 rounded-xl bg-[#242424] p-3 text-left text-white shadow-2xl ring-1 ring-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      <path
        d="M9.2 1.8a5.2 5.2 0 1 0 5 6.8 4.2 4.2 0 0 1-5-6.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
