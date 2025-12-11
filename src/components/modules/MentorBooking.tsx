import { CalendarClock, NotebookPen } from "lucide-react";
import { useTranslations } from "next-intl";

export function MentorBooking() {
  const t = useTranslations("MentorBooking");
  const slots = t.raw("slots") as Array<{
    id: string;
    mentor: string;
    time: string;
    available: boolean;
  }>;
  const prepChecklist = t.raw("preparation.items") as string[];

  return (
    <div className="grid gap-6 text-wolf-foreground lg:grid-cols-[360px_1fr]">
      <div className="wolf-card p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-wolf-emerald-mid text-wolf-emerald">
            <CalendarClock className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-semibold uppercase text-white/90">
            {t("title")}
          </h3>
        </div>
        <p className="mt-2 text-sm text-wolf-text-subtle">{t("subtitle")}</p>
        <ul className="mt-5 space-y-3">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className={`wolf-card--muted flex flex-col gap-1 rounded-lg border border-wolf-border-soft px-4 py-4 text-sm transition ${
                slot.available
                  ? "hover:border-wolf-border-xstrong hover:shadow-[0_15px_45px_-35px_rgba(160,83,255,0.4)]"
                  : "opacity-60"
              }`}
            >
              <p className="text-sm font-medium text-white/90">{slot.mentor}</p>
              <p className="text-xs uppercase text-wolf-text-subtle">
                {slot.time}
              </p>
              {slot.available ? (
                <span className="wolf-pill mt-2 bg-wolf-emerald-soft text-xs uppercase text-wolf-emerald">
                  Available
                </span>
              ) : (
                <span className="wolf-pill mt-2 border border-white/10 bg-transparent text-xs uppercase text-wolf-text-subtle">
                  Filled
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="wolf-card p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-wolf-emerald-mid text-wolf-emerald">
            <NotebookPen className="h-5 w-5" aria-hidden />
          </span>
          <h4 className="text-base font-semibold uppercase text-white/90">
            {t("preparation.title")}
          </h4>
        </div>
        <div className="mt-4 space-y-3 text-sm text-wolf-foreground/80">
          {prepChecklist.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <button
          type="button"
          className="den-button-primary mt-6 px-6 py-3 text-sm"
        >
          {t("preparation.cta")}
        </button>
      </div>
    </div>
  );
}

export default MentorBooking;
