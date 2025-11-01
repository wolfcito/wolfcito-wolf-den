"use client";

import {
  BarChart3,
  ChevronDown,
  Gamepad2,
  MapPinned,
  ScanQrCode,
  Settings,
  ShieldCheck,
  Sparkles,
  SprayCan,
  SquareStack,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";

const navSections = [
  {
    key: "essentials",
    items: [
      { key: "auth", href: "/auth", icon: ShieldCheck },
      { key: "taberna", href: "/taberna", icon: UsersRound },
      { key: "checkin", href: "/checkin", icon: ScanQrCode },
    ] satisfies Array<{
      key: "auth" | "taberna" | "checkin";
      href: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }>,
  },
  {
    key: "lab",
    items: [
      { key: "mindGames", href: "/mind-games", icon: Gamepad2 },
      { key: "quests", href: "/quests", icon: MapPinned },
      { key: "showcase", href: "/showcase", icon: SquareStack },
      { key: "spray", href: "/spray", icon: SprayCan },
    ] satisfies Array<{
      key: "mindGames" | "quests" | "showcase" | "spray";
      href: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }>,
  },
  {
    key: "insights",
    items: [
      { key: "stats", href: "/stats", icon: BarChart3 },
      { key: "leaderboard", href: "/leaderboard", icon: Sparkles },
      { key: "settings", href: "/settings", icon: Settings },
    ] satisfies Array<{
      key: "stats" | "leaderboard" | "settings";
      href: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }>,
  },
] as const;

type SidebarNavVariant = "desktop" | "mobile";

type SidebarNavProps = {
  variant?: SidebarNavVariant;
};

export function SidebarNav({ variant = "desktop" }: SidebarNavProps) {
  const t = useTranslations("SidebarNav");
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<
    (typeof navSections)[number]["key"] | null
  >(navSections[0].key);

  const isMobile = variant === "mobile";
  const containerClasses = isMobile
    ? "flex flex-col gap-6 p-4 text-white"
    : "sticky top-0 flex h-screen w-[256px] flex-col bg-[radial-gradient(140%_120%_at_0%_0%,rgba(160,83,255,0.12),transparent_55%),linear-gradient(180deg,#0b0b10_0%,#141629_100%)] px-5 py-6 text-white";

  return (
    <aside className={containerClasses} aria-label={t("aria.navigation")}>
      <div className={isMobile ? "space-y-6" : "flex h-full flex-col gap-6"}>
        <div className="flex items-center gap-3 rounded-[14px] border border-[#2a2f36] bg-[#11131a] px-4 py-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border border-[#2f3440] bg-[#161821]">
            <Image
              src="/wolf-den-bn.png"
              alt={t("branding.badgeAlt")}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {t("branding.title")}
            </h1>
            <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[#9ba3af]">
              {t("branding.subtitle")}
            </p>
          </div>
        </div>

        <nav
          className={[
            "space-y-5",
            isMobile
              ? ""
              : "flex-1 overflow-y-auto rounded-[16px] border border-[#2a2f36] bg-[rgba(17,19,24,0.55)] p-4 backdrop-blur-[12px] pr-3",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {navSections.map((section, index) => {
            const sectionTitle = t(`sections.${section.key}.title`);
            const sectionListId = `${section.key}-list`;

            return (
              <section key={section.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#9ba3af]">
                    {sectionTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSection((current) =>
                        current === section.key ? null : section.key,
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-transparent text-[#9ba3af] transition hover:border-[rgba(160,83,255,0.25)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a053ff]"
                    aria-controls={sectionListId}
                    aria-expanded={openSection === section.key}
                    aria-label={sectionTitle}
                    title={sectionTitle}
                  >
                    <ChevronDown
                      className={`h-[18px] w-[18px] transition-transform ${
                        openSection === section.key
                          ? "rotate-180 text-white"
                          : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                </div>

                <ul
                  id={sectionListId}
                  className={`space-y-3 overflow-hidden transition-[max-height,opacity] duration-200 ${
                    openSection === section.key
                      ? "max-h-[420px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {section.items.map((item) => {
                    const isActive =
                      item.href === "/auth"
                        ? pathname?.startsWith(item.href)
                        : pathname === item.href ||
                          pathname?.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                      <li key={`${item.href}-${item.key}`}>
                        <Link
                          href={item.href}
                          className={`group relative flex h-[52px] items-center gap-3 rounded-[12px] border border-[#2a2f36] px-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a053ff] ${
                            isActive
                              ? "border-transparent bg-[linear-gradient(135deg,#a053ff,#5b2dff)] text-white"
                              : "bg-[rgba(17,19,24,0.55)] text-[#c2c7d2] hover:border-[rgba(160,83,255,0.35)] hover:bg-[rgba(160,83,255,0.12)] hover:text-white"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {isActive ? (
                            <span className="absolute left-[6px] top-1/2 h-[26px] w-[3px] -translate-y-1/2 rounded-full bg-[rgba(212,196,255,0.9)] shadow-[0_0_12px_rgba(160,83,255,0.55)]" />
                          ) : null}
                          <Icon
                            className="h-[18px] w-[18px] text-inherit"
                            aria-hidden
                          />
                          <span className="flex-1 truncate">
                            {t(`sections.${section.key}.items.${item.key}`)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {index < navSections.length - 1 ? (
                  <div className="h-px w-full bg-[#1f2430]" />
                ) : null}
              </section>
            );
          })}
        </nav>

        {isMobile ? null : (
          <p className="mt-auto rounded-[12px] border border-[#2a2f36] bg-[#11131a] px-4 py-3 text-[0.62rem] uppercase tracking-[0.26em] text-[#9ba3af]">
            {t("footer.copy")}
          </p>
        )}
      </div>
    </aside>
  );
}

export default SidebarNav;
