import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function BlogHighlights() {
  const t = useTranslations("HomeLanding.blogHighlights");
  const items = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section className="wolf-card den-noise-surface rounded-lg border border-wolf-border-strong/60 p-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wolf-text-subtle">
            {t("label")}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {t("title")}
          </h2>
        </div>
        <Link
          href={t("cta.href")}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-wolf-emerald transition hover:border-wolf-border-xstrong hover:text-white"
        >
          {t("cta.label")}
        </Link>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="wolf-card--muted den-glass rounded-lg border border-wolf-border-mid/70 p-6"
          >
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-white/75">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BlogHighlights;
