"use client";

import { useLayoutEffect, useRef } from "react";
import { getProject, projects } from "@/data/projects";
import { useOs } from "@/components/os/OsContext";

export function BrowserApp({ slug }: { slug: string | null }) {
  const { openProject, goHome } = useOs();
  const project = slug ? getProject(slug) : undefined;
  const address = project ? `portfolio.local/projetos/${project.slug}` : "portfolio.local";
  const scroller = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#2a2a2a] px-3 py-2">
        <button
          type="button"
          aria-label="Voltar"
          disabled={!project}
          onClick={goHome}
          className="grid size-7 place-items-center rounded-md text-white/80 hover:bg-white/10 disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Início"
          onClick={goHome}
          className="grid size-7 place-items-center rounded-md text-sm text-white/80 hover:bg-white/10"
        >
          ⌂
        </button>
        <p className="min-w-0 flex-1 truncate rounded-full bg-black/30 px-3 py-1 text-xs text-white/70">
          {address}
        </p>
      </div>
      <div ref={scroller} className="os-scroll min-h-0 flex-1 overflow-y-auto [overflow-anchor:none]">
        {slug && !project ? (
          <div className="px-8 py-10">
            <h3 className="text-xl font-semibold">Projeto não encontrado</h3>
            <p className="mt-2 text-sm text-white/60">Esse endereço não está na lista.</p>
          </div>
        ) : null}
        {!project && !slug ? <Start onOpen={openProject} /> : null}
        {project ? (
          <article className="mx-auto max-w-2xl px-6 py-8 sm:px-8">
            {project.example ? (
              <p className="mb-5 rounded-md bg-[#e95420]/15 px-3 py-2 text-sm text-[#ffb399]">
                Projeto de exemplo. Substitua o texto em src/data/projects.ts.
              </p>
            ) : null}
            <p className="text-xs tracking-[0.16em] text-[#e95420] uppercase">Projeto</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">{project.name}</h3>
            {project.image ? (
              <img
                src={project.image}
                alt={`Tela do ${project.name}`}
                className="mt-6 aspect-video w-full rounded-lg border border-white/10 object-cover object-top"
              />
            ) : null}
            <p className="mt-8 text-xs tracking-[0.14em] text-white/40 uppercase">O que é</p>
            <p className="mt-1 text-base leading-7 text-white/85">{project.about}</p>
            <p className="mt-6 text-xs tracking-[0.14em] text-white/40 uppercase">Como foi feito</p>
            <p className="mt-1 leading-7 text-white/85">{project.built}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
                  {item}
                </li>
              ))}
            </ul>
            {project.demo || project.repo ? (
              <div className="mt-6 flex gap-4 text-sm">
                {project.demo ? (
                  <a href={project.demo} target="_blank" rel="noreferrer" className="text-[#ffb399] hover:underline">
                    Demo
                  </a>
                ) : null}
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer" className="text-[#ffb399] hover:underline">
                    Código
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </div>
  );
}

function Start({ onOpen }: { onOpen: (slug: string) => void }) {
  const groups = [
    { title: "Principais", items: projects.filter((project) => project.featured) },
    { title: "Experimentos", items: projects.filter((project) => !project.featured) },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h3 className="text-2xl font-semibold">Projetos</h3>
      <p className="mt-2 text-sm text-white/60">Escolha um projeto para abrir aqui.</p>
      {groups.map((group) => (
        <section key={group.title} className="mt-8">
          <h4 className="text-xs tracking-[0.14em] text-white/40 uppercase">{group.title}</h4>
          <ul className="mt-2 divide-y divide-white/10">
            {group.items.map((project) => (
              <li key={project.slug}>
                <button
                  type="button"
                  onClick={() => onOpen(project.slug)}
                  className="w-full py-4 text-left hover:text-[#ffb399]"
                >
                  <span className="block font-medium">{project.name}</span>
                  <span className="mt-1 block text-sm text-white/55">{project.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
