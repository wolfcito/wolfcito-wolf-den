"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import type { Locale } from "@/i18n/routing";
import { routing, usePathname, useRouter } from "@/i18n/routing";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (nextLocale: Locale) => {
    if (!pathname || nextLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-wolf-border-soft/80 bg-wolf-panel/80 px-1.5 py-1 text-xs font-semibold uppercase shadow-[0_0_20px_rgba(160,83,255,0.12)] backdrop-blur-md ${className}`.trim()}
    >
      {routing.locales.map((option) => {
        const isActive = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={isPending}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 transition ${
              isActive
                ? "bg-[linear-gradient(135deg,rgba(160,83,255,0.85),rgba(91,45,255,0.65))] text-white shadow-[0_0_24px_rgba(160,83,255,0.45)]"
                : "text-wolf-text-subtle hover:text-white/80"
            }`}
            aria-pressed={isActive}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
