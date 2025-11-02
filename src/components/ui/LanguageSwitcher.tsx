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
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {routing.locales.map((option) => {
        const isActive = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={isPending || isActive}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              isActive
                ? "bg-wolf-cyan/20 text-wolf-cyan"
                : "bg-white/5 text-wolf-bone/70 hover:bg-white/10 disabled:opacity-60"
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
