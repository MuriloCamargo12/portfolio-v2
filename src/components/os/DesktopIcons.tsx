"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { BrowserIcon, EditorIcon, FilesIcon, GithubIcon, LinkedinIcon, PdfIcon } from "@/components/os/icons";
import { useOs } from "@/components/os/OsContext";
import { cn } from "@/lib/cn";

type IconId = "readme" | "curriculo" | "projetos" | "navegador" | "linkedin" | "github";
type IconPlace = { x: number; y: number };
type Box = IconPlace & { w: number; h: number };
type DesktopIcon = {
  id: IconId;
  label: string;
  href?: string;
  open?: () => void;
};

const ORDER: IconId[] = ["projetos", "navegador", "readme", "curriculo", "linkedin", "github"];

const START: Record<IconId, IconPlace> = {
  projetos: { x: 76, y: 12 },
  navegador: { x: 76, y: 108 },
  readme: { x: 76, y: 204 },
  curriculo: { x: 76, y: 300 },
  linkedin: { x: 76, y: 396 },
  github: { x: 76, y: 492 },
};

const MIN_X = 76;
const MIN_Y = 12;
const EDGE = 8;

function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function IconGraphic({ id }: { id: IconId }) {
  switch (id) {
    case "readme":
      return <EditorIcon className="size-12" />;
    case "curriculo":
      return <PdfIcon className="size-12" />;
    case "projetos":
      return <FilesIcon className="size-12" />;
    case "navegador":
      return <BrowserIcon className="size-12" />;
    case "linkedin":
      return (
        <span className="grid size-12 place-items-center rounded-xl bg-[#0A66C2] text-white">
          <LinkedinIcon className="size-7" />
        </span>
      );
    case "github":
      return (
        <span className="grid size-12 place-items-center rounded-full bg-white text-[#24292f]">
          <GithubIcon className="size-8" />
        </span>
      );
  }
}

export function DesktopIcons() {
  const { openApp } = useOs();
  const icons: DesktopIcon[] = [
    { id: "projetos", label: "Projetos", open: () => openApp("files") },
    { id: "navegador", label: "Navegador", open: () => openApp("browser") },
    { id: "readme", label: "readme.txt", open: () => openApp("editor", { editorDoc: "sobre" }) },
    { id: "curriculo", label: "curriculo.pdf", open: () => openApp("editor", { editorDoc: "curriculo" }) },
    { id: "linkedin", label: "LinkedIn", href: profile.linkedin },
    { id: "github", label: "GitHub", href: profile.github },
  ];
  const [places, setPlaces] = useState(START);
  const [dragId, setDragId] = useState<IconId | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Partial<Record<IconId, HTMLElement>>>({});
  const skipClick = useRef(false);

  useEffect(() => {
    const measured = ORDER.every((id) => (iconRefs.current[id]?.offsetHeight ?? 0) > 0);
    if (!measured) return;
    setPlaces((current) => {
      const untouched = ORDER.every(
        (id) => current[id].x === START[id].x && current[id].y === START[id].y,
      );
      if (!untouched) return current;
      let y = MIN_Y;
      const next = { ...current };
      for (const id of ORDER) {
        next[id] = { x: MIN_X, y };
        y += (iconRefs.current[id]?.offsetHeight ?? 0) + EDGE;
      }
      return next;
    });
  }, []);

  function sizeOf(id: IconId) {
    const el = iconRefs.current[id];
    return { w: el?.offsetWidth ?? 92, h: el?.offsetHeight ?? 88 };
  }

  function onPointerDown(id: IconId, event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0 || window.innerWidth < 1024) return;

    const handle = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = places[id];
    let last = origin;
    let moved = false;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      setDragId(id);

      const area = areaRef.current;
      if (!area) return;
      const self = sizeOf(id);
      const maxX = Math.max(MIN_X, area.clientWidth - self.w - EDGE);
      const maxY = Math.max(MIN_Y, area.clientHeight - self.h - EDGE);
      const clamp = (point: IconPlace): IconPlace => ({
        x: Math.min(maxX, Math.max(MIN_X, point.x)),
        y: Math.min(maxY, Math.max(MIN_Y, point.y)),
      });
      const others = icons
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...places[item.id],
          ...sizeOf(item.id),
        }));
      const blocked = (point: IconPlace) =>
        others.some((other) => overlaps({ ...point, w: self.w, h: self.h }, other));

      let next = clamp({ x: origin.x + dx, y: origin.y + dy });
      if (blocked(next)) {
        const slideX = clamp({ x: next.x, y: last.y });
        const slideY = clamp({ x: last.x, y: next.y });
        if (!blocked(slideX)) next = slideX;
        else if (!blocked(slideY)) next = slideY;
        else next = last;
      }

      last = next;
      setPlaces((current) => ({ ...current, [id]: next }));
    };

    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      setDragId(null);
      if (moved) skipClick.current = true;
    };

    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // O arraste segue pelos listeners quando o ponteiro não pode ser capturado.
    }
  }

  return (
    <div ref={areaRef} className="absolute inset-0 z-[1] hidden lg:block">
      {icons.map((icon) => {
        const shared = {
          ref: (node: HTMLElement | null) => {
            if (node) iconRefs.current[icon.id] = node;
            else delete iconRefs.current[icon.id];
          },
          "data-icon": icon.id,
          draggable: false as const,
          onPointerDown: (event: React.PointerEvent<HTMLElement>) => onPointerDown(icon.id, event),
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            if (skipClick.current) {
              skipClick.current = false;
              event.preventDefault();
              return;
            }
            icon.open?.();
          },
          style: { left: places[icon.id].x, top: places[icon.id].y },
          className: cn(
            "absolute flex w-[92px] cursor-grab touch-none flex-col items-center gap-1 rounded-lg p-2 text-[var(--os-icon)] select-none hover:bg-[var(--os-bar-hover)]",
            dragId === icon.id && "z-10 cursor-grabbing bg-[var(--os-bar-hover)]",
          ),
          children: (
            <>
              <IconGraphic id={icon.id} />
              <span className="text-center text-xs leading-tight drop-shadow">{icon.label}</span>
            </>
          ),
        };

        if (icon.href) {
          return (
            <a key={icon.id} href={icon.href} target="_blank" rel="noreferrer" aria-label={icon.label} {...shared} />
          );
        }

        return <button key={icon.id} type="button" aria-label={icon.label} {...shared} />;
      })}
    </div>
  );
}
