"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";
import { resume } from "@/data/resume";
import { useOs } from "@/components/os/OsContext";
import type { AppId } from "@/lib/os-state";

type Line = { kind: "in" | "out" | "err"; text: string };

type CommandResult = {
  text: string;
  clear?: boolean;
  app?: AppId;
  editorDoc?: "sobre" | "curriculo";
  project?: string;
};

const welcome = "portfolio 1.0\nDigite help para ver os comandos.";

function runCommand(raw: string): CommandResult {
  const input = raw.trim();
  if (!input) return { text: "" };
  const [command, ...args] = input.split(/\s+/);
  const name = command.toLowerCase();

  if (name === "help") {
    return {
      text: [
        "help                 lista os comandos",
        "whoami               quem está na sessão",
        "ls                   arquivos e projetos",
        "cat sobre.txt        lê a bio",
        "cat curriculo.txt    lê o currículo",
        "neofetch             resumo da stack",
        "projetos             lista os cases",
        "abrir <slug|app>     abre um projeto ou aplicativo",
        "contato              e-mail e links",
        "clear                limpa a tela",
      ].join("\n"),
    };
  }

  if (name === "whoami") {
    return {
      text: `${profile.username}\n${profile.name} · ${profile.role}\n${profile.location}`,
    };
  }

  if (name === "pwd") return { text: `/home/${profile.username}` };

  if (name === "ls") {
    return {
      text: ["sobre.txt", "curriculo.pdf", ...projects.map((project) => project.slug)].join("\n"),
    };
  }

  if (name === "cat") {
    const file = (args[0] ?? "").toLowerCase();
    if (file === "sobre.txt") return { text: profile.about.join("\n\n") };
    if (file === "curriculo.txt" || file === "curriculo.pdf") {
      const skills = resume.skills.map((skill) => `${skill.label}: ${skill.items}`).join("\n");
      const cases = resume.projects
        .map((item) => `${item.title}\n${item.bullets.map((bullet) => `- ${bullet}`).join("\n")}`)
        .join("\n\n");
      return {
        text: [
          profile.name,
          profile.role,
          resume.availability,
          "",
          resume.summary,
          "",
          skills,
          "",
          cases,
          "",
          `Outros projetos: ${resume.otherProjects}`,
          "",
          `${resume.education.title} · ${resume.education.place} · ${resume.education.period}`,
          resume.certifications.join("\n"),
        ].join("\n"),
      };
    }
    return { text: args[0] ? `cat: ${args[0]}: arquivo não encontrado` : "cat: falta o arquivo", };
  }

  if (name === "neofetch") {
    return {
      text: [
        `${profile.username}@portfolio`,
        "-----------------",
        `Nome:   ${profile.name}`,
        `Papel:  ${profile.role}`,
        `Local:  ${profile.location}`,
        `Stack:  ${profile.stack.join(", ")}`,
        "Shell:  next.js",
        "WM:     janelas",
      ].join("\n"),
    };
  }

  if (name === "projetos") {
    return {
      text: projects.map((project) => `${project.slug}  ${project.name}`).join("\n"),
    };
  }

  if (name === "contato") {
    return {
      text: `${profile.email}\n${profile.github}\n${profile.linkedin}`,
    };
  }

  if (name === "clear") return { text: "", clear: true };

  if (name === "abrir" || name === "open") {
    const target = (args[0] ?? "").toLowerCase();
    if (!target) return { text: "abrir: diga o app ou o slug do projeto" };
    if (["arquivos", "files"].includes(target)) return { text: "abrindo Arquivos", app: "files" };
    if (["editor", "sobre"].includes(target)) {
      return { text: "abrindo sobre.txt", app: "editor", editorDoc: "sobre" };
    }
    if (["curriculo", "currículo"].includes(target)) {
      return { text: "abrindo curriculo.pdf", app: "editor", editorDoc: "curriculo" };
    }
    if (target === "terminal") return { text: "o terminal já está aberto", app: "terminal" };
    if (["navegador", "browser"].includes(target)) {
      return { text: "abrindo Navegador", app: "browser" };
    }
    const project = getProject(args[0] ?? "");
    if (!project) return { text: `abrir: não achei "${args[0]}"` };
    return { text: `abrindo ${project.name}`, project: project.slug };
  }

  return { text: `${command}: comando não encontrado` };
}

export function TerminalApp({ active }: { active: boolean }) {
  const { openApp, openProject } = useOs();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: welcome }]);
  const [draft, setDraft] = useState("");
  const [commands, setCommands] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function submit(raw: string) {
    const result = runCommand(raw);
    if (result.clear) {
      setLines([]);
    } else if (raw.trim()) {
      const kind = result.text.includes("não encontrado") || result.text.includes("não achei") ? "err" : "out";
      setLines((current) => [
        ...current,
        { kind: "in", text: raw },
        ...(result.text ? [{ kind, text: result.text } as Line] : []),
      ]);
    }
    if (raw.trim()) {
      setCommands((current) => [...current, raw]);
    }
    setCursor(-1);
    setDraft("");
    if (result.project) openProject(result.project);
    else if (result.app) openApp(result.app, result.editorDoc ? { editorDoc: result.editorDoc } : undefined);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit(draft);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = cursor < 0 ? commands.length - 1 : Math.max(0, cursor - 1);
      if (next < 0) return;
      setCursor(next);
      setDraft(commands[next] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor < 0) return;
      const next = cursor + 1;
      if (next >= commands.length) {
        setCursor(-1);
        setDraft("");
      } else {
        setCursor(next);
        setDraft(commands[next] ?? "");
      }
    }
  }

  return (
    <div
      className="os-scroll h-full overflow-y-auto bg-[#1a1218] px-4 py-3 font-mono text-[13px] leading-6 text-white/90"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, index) => (
        <pre
          key={`${index}-${line.kind}`}
          className={`font-mono whitespace-pre-wrap ${
            line.kind === "in" ? "text-white" : line.kind === "err" ? "text-[#ff8f73]" : "text-white/85"
          }`}
        >
          {line.kind === "in" ? `${profile.username}@portfolio:~$ ${line.text}` : line.text}
        </pre>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
        className="flex gap-2"
      >
        <span className="shrink-0 text-[#8ae234]">
          {profile.username}@portfolio
          <span className="text-white/50">:~$</span>
        </span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Comando"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="min-w-0 flex-1 bg-transparent font-mono text-white outline-none"
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
