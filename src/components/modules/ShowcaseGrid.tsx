import { Github, Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function ShowcaseGrid() {
  const t = useTranslations("ShowcaseGrid");
  const projects = t.raw("projects") as Array<{
    id: string;
    name: string;
    oneLiner: string;
    repo: string;
    demo: string;
  }>;

  return (
    <div className="grid gap-5 text-wolf-foreground md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="wolf-card rounded-[1.9rem] border border-wolf-border-strong p-6 transition hover:-translate-y-1 hover:shadow-[0_32px_90px_-60px_rgba(160,83,255,0.35)]"
        >
          <h3 className="text-lg font-semibold text-white/90">
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-wolf-text-subtle">
            {project.oneLiner}
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href={`https://${project.repo}`}
              className="flex items-center gap-2 text-wolf-foreground/85 transition hover:text-wolf-emerald"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-wolf-emerald-soft text-wolf-emerald">
                <Github className="h-4 w-4" aria-hidden />
              </span>
              {project.repo}
            </a>
            <a
              href={`https://${project.demo}`}
              className="flex items-center gap-2 text-wolf-emerald transition hover:text-wolf-foreground"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-wolf-emerald-tint text-wolf-emerald">
                <Play className="h-4 w-4" aria-hidden />
              </span>
              {project.demo}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ShowcaseGrid;
