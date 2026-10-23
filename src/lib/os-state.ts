import { getProject } from "@/data/projects";

export type AppId = "files" | "editor" | "terminal" | "browser";
export type EditorDoc = "sobre" | "curriculo";

export type OpenExtra = {
  projectSlug?: string | null;
  editorDoc?: EditorDoc;
};

export type DesktopWindow = {
  id: AppId;
  app: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  projectSlug?: string;
  editorDoc?: EditorDoc;
};

export type OsState = {
  windows: DesktopWindow[];
  activeId: AppId | null;
  overview: boolean;
  z: number;
};

export type OsAction =
  | { type: "open"; app: AppId; extra?: OpenExtra }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "toggle-max"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; width: number; height: number }
  | { type: "dock"; app: AppId }
  | { type: "overview"; open: boolean }
  | { type: "overview-toggle" }
  | { type: "cycle" }
  | { type: "blur" }
  | { type: "sync-route"; slug: string | null };

const DEFAULTS: Record<AppId, { title: string; width: number; height: number }> = {
  files: { title: "Arquivos", width: 740, height: 460 },
  editor: { title: "sobre.txt", width: 640, height: 500 },
  terminal: { title: "Terminal", width: 680, height: 400 },
  browser: { title: "Navegador", width: 760, height: 520 },
};

export const APP_ORDER: AppId[] = ["files", "editor", "terminal", "browser"];

export const APP_LABEL: Record<AppId, string> = {
  files: "Arquivos",
  editor: "Editor de texto",
  terminal: "Terminal",
  browser: "Navegador",
};

function titleFor(app: AppId, extra?: OpenExtra) {
  if (app === "browser") {
    if (!extra?.projectSlug) return "Navegador";
    return getProject(extra.projectSlug)?.name ?? "Navegador";
  }
  if (app === "editor") {
    return extra?.editorDoc === "curriculo" ? "curriculo.pdf" : "sobre.txt";
  }
  return DEFAULTS[app].title;
}

function applyExtra(win: DesktopWindow, extra?: OpenExtra): DesktopWindow {
  if (!extra) return win;
  const next = { ...win };
  if (extra.editorDoc) {
    next.editorDoc = extra.editorDoc;
    next.title = extra.editorDoc === "curriculo" ? "curriculo.pdf" : "sobre.txt";
  }
  if (extra.projectSlug !== undefined) {
    next.projectSlug = extra.projectSlug ?? undefined;
    next.title = extra.projectSlug
      ? (getProject(extra.projectSlug)?.name ?? "Navegador")
      : "Navegador";
  }
  return next;
}

function focusWindow(
  state: OsState,
  id: AppId,
  patch?: (win: DesktopWindow) => DesktopWindow,
): OsState {
  const max = state.windows.reduce((highest, win) => Math.max(highest, win.z), 0);
  let windows = state.windows.map((win) => {
    if (win.id !== id) return win;
    const base = patch ? patch(win) : win;
    return { ...base, minimized: false, z: max + 1 };
  });

  if (max + 1 > 20) {
    const order = [...windows].sort((a, b) => a.z - b.z);
    const rank = new Map(order.map((win, index) => [win.id, index + 1]));
    windows = windows.map((win) => ({ ...win, z: rank.get(win.id) ?? win.z }));
  }

  return { ...state, windows, activeId: id, overview: false };
}

function openApp(state: OsState, app: AppId, extra?: OpenExtra): OsState {
  const existing = state.windows.find((win) => win.app === app);
  if (existing) {
    return focusWindow(state, existing.id, (win) => applyExtra(win, extra));
  }

  const offset = state.windows.length;
  const defaults = DEFAULTS[app];
  const win: DesktopWindow = {
    id: app,
    app,
    title: titleFor(app, extra),
    x: offset * 28,
    y: offset * 28,
    width: defaults.width,
    height: defaults.height,
    z: state.z,
    minimized: false,
    maximized: false,
    projectSlug: extra?.projectSlug ?? undefined,
    editorDoc: extra?.editorDoc ?? (app === "editor" ? "sobre" : undefined),
  };

  return {
    ...state,
    z: state.z + 1,
    activeId: app,
    overview: false,
    windows: [...state.windows, win],
  };
}

export function initState(slug: string | null): OsState {
  const base: OsState = { windows: [], activeId: null, overview: false, z: 10 };
  if (!slug) return openApp(base, "editor", { editorDoc: "sobre" });
  return openApp(base, "browser", { projectSlug: slug });
}

export function osReducer(state: OsState, action: OsAction): OsState {
  switch (action.type) {
    case "open":
      return openApp(state, action.app, action.extra);
    case "focus":
      return focusWindow(state, action.id);
    case "close": {
      const windows = state.windows.filter((win) => win.id !== action.id);
      const activeId =
        state.activeId === action.id
          ? (windows[windows.length - 1]?.id ?? null)
          : state.activeId;
      return { ...state, windows, activeId };
    }
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, minimized: true } : win,
        ),
      };
    case "toggle-max": {
      const current = state.windows.find((win) => win.id === action.id);
      if (!current) return state;
      return focusWindow(state, action.id, (win) => ({
        ...win,
        maximized: !current.maximized,
      }));
    }
    case "move":
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id
            ? { ...win, x: action.x, y: action.y }
            : win,
        ),
      };
    case "resize":
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id
            ? {
                ...win,
                width: Math.max(380, action.width),
                height: Math.max(260, action.height),
              }
            : win,
        ),
      };
    case "dock": {
      const existing = state.windows.find((win) => win.app === action.app);
      if (!existing) return openApp(state, action.app);
      if (existing.minimized || state.activeId !== existing.id) {
        return focusWindow(state, existing.id);
      }
      return {
        ...state,
        overview: false,
        activeId: null,
        windows: state.windows.map((win) =>
          win.id === existing.id ? { ...win, minimized: true } : win,
        ),
      };
    }
    case "overview":
      return { ...state, overview: action.open };
    case "overview-toggle":
      return { ...state, overview: !state.overview };
    case "cycle": {
      if (state.windows.length === 0) return state;
      const index = state.windows.findIndex((win) => win.id === state.activeId);
      const next = state.windows[(index + 1) % state.windows.length];
      return focusWindow(state, next.id);
    }
    case "blur":
      return { ...state, activeId: null };
    case "sync-route": {
      if (!action.slug) {
        return {
          ...state,
          windows: state.windows.map((win) =>
            win.app === "browser"
              ? { ...win, projectSlug: undefined, title: "Navegador" }
              : win,
          ),
        };
      }
      return openApp(state, "browser", { projectSlug: action.slug });
    }
    default:
      return state;
  }
}

export function slugFromPath(pathname: string) {
  const match = pathname.match(/^\/projetos\/([^/]+)\/?$/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
