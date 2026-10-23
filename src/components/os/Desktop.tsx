"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { profile } from "@/data/profile";
import { getProject } from "@/data/projects";
import { BrowserApp } from "@/components/os/apps/BrowserApp";
import { EditorApp } from "@/components/os/apps/EditorApp";
import { FilesApp } from "@/components/os/apps/FilesApp";
import { TerminalApp } from "@/components/os/apps/TerminalApp";
import { DesktopIcons } from "@/components/os/DesktopIcons";
import { Dock } from "@/components/os/Dock";
import { AppIcon, EditorIcon, GithubIcon, LinkedinIcon, PdfIcon } from "@/components/os/icons";
import { OsProvider, useOs, type OsApi } from "@/components/os/OsContext";
import { ThemeProvider, useTheme } from "@/components/os/ThemeContext";
import { VolumeProvider } from "@/components/os/VolumeContext";
import { TopBar } from "@/components/os/TopBar";
import { WindowFrame } from "@/components/os/WindowFrame";
import { cn } from "@/lib/cn";
import { playWindowOpen } from "@/lib/click-sound";
import {
  APP_LABEL,
  APP_ORDER,
  initState,
  osReducer,
  slugFromPath,
  type AppId,
  type DesktopWindow,
} from "@/lib/os-state";

export function Desktop() {
  const pathname = usePathname();
  const router = useRouter();
  const slug = slugFromPath(pathname);
  const [state, dispatch] = useReducer(osReducer, slug, initState);
  const synced = useRef(slug);
  const windowsRef = useRef(state.windows);
  windowsRef.current = state.windows;

  function soundIfOpening(app: AppId) {
    const win = windowsRef.current.find((item) => item.app === app);
    if (!win || win.minimized) playWindowOpen();
  }

  useEffect(() => {
    if (synced.current === slug) return;
    synced.current = slug;
    dispatch({ type: "sync-route", slug });
  }, [slug]);

  useEffect(() => {
    const project = slug ? getProject(slug) : undefined;
    const nextTitle = project
      ? `${project.name} · ${profile.name}`
      : `${profile.name} · Portfólio`;
    document.title = nextTitle;
    const id = window.setTimeout(() => {
      document.title = nextTitle;
    }, 50);
    return () => window.clearTimeout(id);
  }, [slug]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        soundIfOpening("terminal");
        dispatch({ type: "open", app: "terminal" });
        return;
      }

      if (event.altKey && event.key === "Tab") {
        event.preventDefault();
        dispatch({ type: "cycle" });
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const api = useMemo<OsApi>(
    () => ({
      openApp(app, extra) {
        soundIfOpening(app);
        dispatch({ type: "open", app, extra });
      },
      openProject(next) {
        soundIfOpening("browser");
        dispatch({ type: "open", app: "browser", extra: { projectSlug: next } });
        const path = `/projetos/${encodeURIComponent(next)}`;
        if (pathname !== path) router.push(path);
      },
      goHome() {
        soundIfOpening("browser");
        dispatch({ type: "open", app: "browser", extra: { projectSlug: null } });
        if (pathname !== "/") router.push("/");
      },
    }),
    [pathname, router],
  );

  function onBackground(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("[data-window], [data-icon], [data-dock], button, a, input")) return;
    dispatch({ type: "blur" });
  }

  return (
    <OsProvider value={api}>
      <ThemeProvider>
        <VolumeProvider>
        <ThemedShell>
        <TopBar
          onOpenAbout={() => {
            soundIfOpening("editor");
            dispatch({ type: "open", app: "editor", extra: { editorDoc: "sobre" } });
          }}
        />
        <div className="absolute inset-x-0 bottom-0 top-8" onPointerDown={onBackground}>
          <MobileHome />
          <DesktopIcons />
          {state.windows.map((win) => (
            <WindowFrame
              key={win.id}
              win={win}
              active={state.activeId === win.id}
              onClose={() => dispatch({ type: "close", id: win.id })}
              onFocus={() => {
                if (state.activeId !== win.id || win.minimized) {
                  dispatch({ type: "focus", id: win.id });
                }
              }}
              onMinimize={() => dispatch({ type: "minimize", id: win.id })}
              onToggleMaximize={() => dispatch({ type: "toggle-max", id: win.id })}
              onMove={(x, y) => dispatch({ type: "move", id: win.id, x, y })}
              onResize={(width, height) =>
                dispatch({ type: "resize", id: win.id, width, height })
              }
            >
              <WindowBody win={win} active={state.activeId === win.id} />
            </WindowFrame>
          ))}
          <Dock
            windows={state.windows}
            activeId={state.activeId}
            onDock={(app) => {
              soundIfOpening(app);
              dispatch({ type: "dock", app });
            }}
          />
        </div>
        </ThemedShell>
        </VolumeProvider>
      </ThemeProvider>
    </OsProvider>
  );
}

function ThemedShell({ children }: { children: React.ReactNode }) {
  const { night } = useTheme();
  return (
    <div className={cn("os-bg relative h-dvh overflow-hidden text-[var(--os-icon)]", !night && "os-bg-light")}>
      {children}
    </div>
  );
}

function WindowBody({ win, active }: { win: DesktopWindow; active: boolean }) {
  switch (win.app) {
    case "files":
      return <FilesApp />;
    case "editor":
      return <EditorApp doc={win.editorDoc ?? "sobre"} />;
    case "terminal":
      return <TerminalApp active={active} />;
    case "browser":
      return <BrowserApp slug={win.projectSlug ?? null} />;
  }
}

function MobileHome() {
  const { openApp } = useOs();

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-y-auto px-6 py-8 lg:hidden">
      <p className="mb-8 text-sm text-[var(--os-icon)] opacity-80">{profile.role}</p>
      <div className="my-auto grid grid-cols-3 gap-x-3 gap-y-8">
        {APP_ORDER.map((app) => (
          <button
            key={app}
            type="button"
            onClick={() => openApp(app)}
            className="flex flex-col items-center gap-2"
          >
            <AppIcon app={app} className="size-14" />
            <span className="text-center text-xs">{APP_LABEL[app]}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => openApp("editor", { editorDoc: "sobre" })}
          className="flex flex-col items-center gap-2"
        >
          <EditorIcon className="size-14" />
          <span className="text-center text-xs">readme.txt</span>
        </button>
        <button
          type="button"
          onClick={() => openApp("editor", { editorDoc: "curriculo" })}
          className="flex flex-col items-center gap-2"
        >
          <PdfIcon className="size-14" />
          <span className="text-center text-xs">curriculo.pdf</span>
        </button>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-2"
        >
          <span className="grid size-14 place-items-center rounded-xl bg-[#0A66C2] text-white">
            <LinkedinIcon className="size-8" />
          </span>
          <span className="text-center text-xs">LinkedIn</span>
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-2"
        >
          <span className="grid size-14 place-items-center rounded-full bg-white text-[#24292f]">
            <GithubIcon className="size-9" />
          </span>
          <span className="text-center text-xs">GitHub</span>
        </a>
      </div>
    </div>
  );
}
