"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { DesktopWindow } from "@/lib/os-state";

export function WindowFrame({
  win,
  active,
  onClose,
  onFocus,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
  children,
}: {
  win: DesktopWindow;
  active: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: ReactNode;
}) {
  function onHeaderPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    onFocus();
    if (win.maximized) return;
    if (window.innerWidth < 1024) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const originX = win.x;
    const originY = win.y;
    const handle = event.currentTarget;
    const frame = handle.parentElement;
    const area = frame?.parentElement;

    const move = (ev: PointerEvent) => {
      let nextX = originX + ev.clientX - startX;
      let nextY = originY + ev.clientY - startY;
      if (area && frame) {
        const margin = 72;
        const limitX = Math.max(0, (area.clientWidth + frame.offsetWidth) / 2 - margin);
        const limitY = Math.max(0, (area.clientHeight + frame.offsetHeight) / 2 - margin);
        nextX = Math.min(limitX, Math.max(-limitX, nextX));
        nextY = Math.min(limitY, Math.max(-limitY, nextY));
      }
      onMove(nextX, nextY);
    };
    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // O arraste segue pelos listeners quando o ponteiro não pode ser capturado.
    }
  }

  function onResizePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.preventDefault();
    onFocus();
    const startX = event.clientX;
    const startY = event.clientY;
    const originW = win.width;
    const originH = win.height;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);

    const move = (ev: PointerEvent) => {
      onResize(originW + ev.clientX - startX, originH + ev.clientY - startY);
    };
    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  }

  return (
    <section
      data-window
      role="dialog"
      aria-label={win.title}
      onPointerDown={onFocus}
      style={
        win.maximized
          ? { zIndex: win.z }
          : {
              left: `calc(50% + ${win.x}px)`,
              top: `calc(50% + ${win.y}px)`,
              width: win.width,
              height: win.height,
              zIndex: win.z,
              transform: "translate(-50%, -50%)",
            }
      }
      className={cn(
        "os-window absolute flex-col overflow-hidden rounded-xl bg-[#242424] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10",
        win.minimized ? "hidden" : "flex",
        "max-lg:!inset-0 max-lg:!h-auto max-lg:!w-auto max-lg:!transform-none max-lg:rounded-none",
        win.maximized &&
          "lg:!top-2 lg:!right-2 lg:!bottom-2 lg:!left-[76px] lg:!h-auto lg:!w-auto",
        !active && "max-lg:hidden",
        active ? "ring-[#e95420]/50" : "brightness-95",
      )}
    >
      <header
        onPointerDown={onHeaderPointerDown}
        onDoubleClick={onToggleMaximize}
        className={cn(
          "relative flex h-11 shrink-0 cursor-grab touch-none items-center gap-2 border-b border-black/40 px-2 active:cursor-grabbing",
          active ? "bg-[#383838]" : "bg-[#2c2c2c]",
        )}
      >
        <button
          type="button"
          onClick={onMinimize}
          className="grid size-7 place-items-center rounded-full text-white/80 hover:bg-white/10 lg:hidden"
          aria-label="Voltar"
        >
          <span aria-hidden="true">←</span>
        </button>
        <h2
          className={cn(
            "pointer-events-none absolute inset-x-16 truncate text-center text-[13px]",
            active ? "text-white" : "text-white/55",
          )}
        >
          {win.title}
        </h2>
        <div className="ml-auto hidden items-center gap-1.5 lg:flex">
          <button
            type="button"
            aria-label="Minimizar"
            onClick={onMinimize}
            className="grid size-6 place-items-center rounded-full text-white/80 hover:bg-white/15"
          >
            <span className="block h-0.5 w-2.5 rounded-full bg-current" />
          </button>
          <button
            type="button"
            aria-label={win.maximized ? "Restaurar" : "Maximizar"}
            onClick={onToggleMaximize}
            className="grid size-6 place-items-center rounded-full text-white/80 hover:bg-white/15"
          >
            <span className="block size-2.5 rounded-[2px] border border-current" />
          </button>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="grid size-6 place-items-center rounded-full text-white/80 hover:bg-[#e95420] hover:text-white"
          >
            <span className="text-sm leading-none">×</span>
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {win.maximized ? null : (
        <div
          onPointerDown={onResizePointerDown}
          className="absolute right-0 bottom-0 hidden size-4 cursor-nwse-resize lg:block"
          aria-hidden="true"
        />
      )}
    </section>
  );
}
