"use client";

import { projects, type Project } from "@/data/projects";
import { FilesIcon } from "@/components/os/icons";
import { useOs } from "@/components/os/OsContext";

const groups = [
  { title: "Principais", items: projects.filter((project) => project.featured) },
  { title: "Experimentos", items: projects.filter((project) => !project.featured) },
];

export function FilesApp() {
  const { openProject } = useOs();

  return (
    <div className="flex h-full min-h-0 bg-[#2b2b2b]">
      <aside className="hidden w-44 shrink-0 flex-col border-r border-white/10 bg-[#1e1e1e] py-3 sm:flex">
        <p className="px-4 pb-2 text-[11px] tracking-wide text-white/40 uppercase">Lugares</p>
        <p className="mx-2 rounded-md bg-white/10 px-2 py-1.5 text-sm">Projetos</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center border-b border-white/10 px-4 text-xs text-white/55">
          Início / Projetos
        </div>
        <div className="os-scroll min-h-0 flex-1 overflow-y-auto p-4">
          {groups.map((group) => (
            <section key={group.title} className="mb-6 last:mb-0">
              <p className="px-2 pb-1 text-[11px] tracking-wide text-white/40 uppercase">{group.title}</p>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                {group.items.map((project) => (
                  <ProjectFile key={project.slug} project={project} onOpen={openProject} />
                ))}
              </ul>
            </section>
          ))}
        </div>
        <footer className="flex h-8 shrink-0 items-center border-t border-white/10 px-3 text-xs text-white/45">
          {projects.length} {projects.length === 1 ? "item" : "itens"}
        </footer>
      </div>
    </div>
  );
}

function ProjectFile({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        className="flex w-full flex-col items-center gap-2 rounded-lg px-2 py-3 text-center hover:bg-white/10"
      >
        <FilesIcon className="size-14" />
        <span className="text-sm leading-tight">{project.name}</span>
        {project.example ? (
          <span className="text-[10px] tracking-wide text-[#e95420] uppercase">Exemplo</span>
        ) : null}
      </button>
    </li>
  );
}
