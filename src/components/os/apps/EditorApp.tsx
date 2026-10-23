"use client";

import { profile } from "@/data/profile";
import { getProject } from "@/data/projects";
import { resume } from "@/data/resume";
import { useOs } from "@/components/os/OsContext";
import { cn } from "@/lib/cn";
import type { EditorDoc } from "@/lib/os-state";

function Links() {
  return (
    <div className="mt-6 flex flex-wrap gap-3 text-sm">
      {profile.email ? (
        <a className="text-[#ffb399] underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      ) : null}
      <a
        className="text-[#ffb399] underline-offset-2 hover:underline"
        href={profile.github}
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
      <a
        className="text-[#ffb399] underline-offset-2 hover:underline"
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
    </div>
  );
}

export function EditorApp({ doc }: { doc: EditorDoc }) {
  const { openApp } = useOs();

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
      <div className="flex shrink-0 gap-1 border-b border-white/10 bg-[#2a2a2a] px-2 pt-2">
        {(
          [
            ["sobre", "sobre.txt"],
            ["curriculo", "curriculo.pdf"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => openApp("editor", { editorDoc: id })}
            className={cn(
              "rounded-t-md px-3 py-1.5 text-xs",
              doc === id ? "bg-[#1e1e1e] text-white" : "text-white/50 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="os-scroll min-h-0 flex-1 overflow-y-auto">
        {doc === "sobre" ? <About /> : <Resume />}
      </div>
    </div>
  );
}

function About() {
  return (
    <article className="mx-auto max-w-xl px-6 py-8 text-[15px] leading-7 text-white/90">
      <p className="text-xs tracking-[0.16em] text-[#e95420] uppercase">{profile.role}</p>
      <h3 className="mt-2 font-sans text-3xl font-semibold tracking-tight">{profile.name}</h3>
      <p className="mt-1 text-sm text-white/50">
        {[profile.location, profile.status].filter(Boolean).join(" · ")}
      </p>
      <div className="mt-6 space-y-4">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {profile.stack.map((item) => (
          <li key={item} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
            {item}
          </li>
        ))}
      </ul>
      <Links />
    </article>
  );
}

function Resume() {
  return (
    <article className="mx-auto max-w-xl px-6 py-8 text-sm leading-6 text-white/90">
      <header className="border-b border-white/10 pb-4">
        <h3 className="font-sans text-2xl font-semibold">{profile.name}</h3>
        <p className="text-white/60">{profile.role}</p>
        <p className="text-white/60">{resume.availability}</p>
        <div className="mt-3 flex gap-4">
          <a className="text-[#ffb399] underline-offset-2 hover:underline" href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="text-[#ffb399] underline-offset-2 hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </header>

      <section className="mt-6">
        <h4 className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Resumo profissional</h4>
        <p className="mt-3 text-white/80">{resume.summary}</p>
      </section>

      <section className="mt-6">
        <h4 className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Competências técnicas</h4>
        <ul className="mt-3 space-y-1.5">
          {resume.skills.map((skill) => (
            <li key={skill.label}>
              <span className="font-medium">{skill.label}:</span> <span className="text-white/75">{skill.items}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h4 className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Projetos</h4>
        <ul className="mt-3 space-y-5">
          {resume.projects.map((item) => {
            const project = getProject(item.slug);
            return (
              <li key={item.slug}>
                <p className="font-medium">{item.title}</p>
                <p className="text-white/55">Tecnologias: {item.stack}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-white/75">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {project?.demo || project?.repo ? (
                  <p className="mt-1 flex gap-4">
                    {project.demo ? (
                      <a className="text-[#ffb399] underline-offset-2 hover:underline" href={project.demo} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    ) : null}
                    {project.repo ? (
                      <a className="text-[#ffb399] underline-offset-2 hover:underline" href={project.repo} target="_blank" rel="noreferrer">
                        Código
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-white/75">
          <span className="font-medium text-white/90">Outros projetos: </span>
          {resume.otherProjects}
        </p>
      </section>

      <section className="mt-6">
        <h4 className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Formação</h4>
        <p className="mt-3 font-medium">{resume.education.title}</p>
        <p className="text-white/60">
          {resume.education.place} · {resume.education.period}
        </p>
      </section>

      <section className="mt-6">
        <h4 className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Certificações</h4>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-white/75">
          {resume.certifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
