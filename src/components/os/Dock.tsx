"use client";

import { profile } from "@/data/profile";
import { AppIcon, GithubIcon, LinkedinIcon } from "@/components/os/icons";
import { cn } from "@/lib/cn";
import { APP_LABEL, APP_ORDER, type AppId, type DesktopWindow } from "@/lib/os-state";

export function Dock({
  windows,
  activeId,
  onDock,
}: {
  windows: DesktopWindow[];
  activeId: AppId | null;
  onDock: (app: AppId) => void;
}) {
  return (
    <nav
      data-dock
      aria-label="Aplicativos"
      className="absolute bottom-0 left-0 top-0 z-30 hidden w-[68px] flex-col items-center gap-1 bg-[var(--os-bar)] px-0 pt-2 pb-2 text-[var(--os-bar-text)] lg:flex"
    >
      {APP_ORDER.map((app) => {
        const win = windows.find((item) => item.app === app);
        const running = Boolean(win);
        const active = activeId === app && Boolean(win && !win.minimized);
        return (
          <div key={app} className="group relative">
            {running ? (
              <span
                className={cn(
                  "absolute top-1/2 left-0 w-1 -translate-x-2 -translate-y-1/2 rounded-r-full bg-white",
                  active ? "h-5" : "h-1.5",
                )}
              />
            ) : null}
            <button
              type="button"
              aria-label={APP_LABEL[app]}
              onClick={() => onDock(app)}
              className="grid size-12 place-items-center rounded-xl hover:bg-[var(--os-bar-hover)]"
            >
              <AppIcon app={app} className="size-10 transition-transform group-hover:scale-110" />
            </button>
            <span className="pointer-events-none absolute top-1/2 left-full z-10 ml-2 -translate-y-1/2 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow group-hover:opacity-100">
              {APP_LABEL[app]}
            </span>
          </div>
        );
      })}
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="group relative grid size-12 place-items-center rounded-xl text-[var(--os-bar-text)] hover:bg-[var(--os-bar-hover)]"
      >
        <LinkedinIcon className="size-8 transition-transform group-hover:scale-110" />
        <span className="pointer-events-none absolute top-1/2 left-full z-10 ml-2 -translate-y-1/2 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow group-hover:opacity-100">
          LinkedIn
        </span>
      </a>
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="group relative mt-auto grid size-12 place-items-center rounded-xl text-[var(--os-bar-text)] hover:bg-[var(--os-bar-hover)]"
      >
        <GithubIcon className="size-8 transition-transform group-hover:scale-110" />
        <span className="pointer-events-none absolute top-1/2 left-full z-10 ml-2 -translate-y-1/2 rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow group-hover:opacity-100">
          GitHub
        </span>
      </a>
    </nav>
  );
}
