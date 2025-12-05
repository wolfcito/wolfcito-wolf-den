import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  Gamepad2,
  LayoutGrid,
  Lock,
  Puzzle,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import { requireProfile } from "@/lib/accessGuards";
import type { LabUserProfile } from "@/lib/userProfile";

const LAB_NAME = process.env.NEXT_PUBLIC_LAB_NAME ?? "DenLabs";

type MiniAppDefinition = {
  id: string;
  name: string;
  status: "LIVE" | "SOON";
  href?: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

const MINI_APPS: MiniAppDefinition[] = [
  {
    id: "spray",
    name: "Spray Disperser",
    status: "LIVE",
    href: "/spray",
    icon: Sparkles,
    description: "Send rewards in bulk.",
  },
  {
    id: "taberna",
    name: "Taberna Mentorship",
    status: "LIVE",
    href: "/taberna",
    icon: Store,
    description: "Live sessions & rooms.",
  },
  {
    id: "self",
    name: "Self.xyz Auth",
    status: "LIVE",
    href: "/self-auth",
    icon: ShieldCheck,
    description: "Verify your identity.",
  },
  {
    id: "mini-games",
    name: "Mini-Games Lab",
    status: "SOON",
    icon: Gamepad2,
    description: "Play & earn inside Runs.",
  },
  {
    id: "sponsor",
    name: "Sponsor Showcase",
    status: "SOON",
    icon: Wallet,
    description: "Highlights for partners.",
  },
  {
    id: "extensions",
    name: "Builder Extensions",
    status: "SOON",
    icon: Puzzle,
    description: "Custom run add-ons.",
  },
  {
    id: "insights",
    name: "Insights",
    status: "SOON",
    icon: BarChart3,
    description: "Metrics & live KPIs.",
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    status: "SOON",
    icon: LayoutGrid,
    description: "Top builders per run.",
  },
  {
    id: "coming-soon",
    name: "More coming soon",
    status: "SOON",
    icon: Lock,
    description: "Reserved slot.",
  },
];

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await requireProfile({ locale, nextPath: "/lab" });
  return <LabShell locale={locale} profile={profile} />;
}

type LabShellProps = {
  locale: string;
  profile: LabUserProfile;
};

function LabShell({ locale, profile }: LabShellProps) {
  const localePrefix = `/${locale}`;
  const handle = formatHandle(profile.name);
  const hasWallet = Boolean(profile.wallet_address);
  const holdScore = Number(profile.hold_score ?? 0);
  const holdMax = 120;
  const holdProgress = Math.min(
    100,
    Math.max(0, Math.round((holdScore / holdMax) * 100)),
  );
  const stats = [
    { label: "HOLD score", value: holdScore.toString(), meta: "Out of 120" },
    { label: "Sessions", value: "3", meta: "This week" },
    { label: "Rewards", value: "2", meta: "Claimed" },
    { label: "Streak", value: "5 days", meta: "Check-ins" },
  ];
  const quests = [
    {
      id: "self",
      label: "Verify with Self (+10 HOLD)",
      completed: Boolean(profile.self_verified),
      href: `${localePrefix}/self-auth`,
      cta: "Start",
    },
    {
      id: "taberna",
      label: "Open Taberna",
      completed: false,
      href: `${localePrefix}/taberna`,
      cta: "Open",
    },
    {
      id: "spray",
      label: "Send a test Spray",
      completed: false,
      href: `${localePrefix}/spray`,
      cta: "Open",
      disabled: profile.role !== "organizer",
    },
  ];

  return (
    <div className="space-y-6 text-white">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.32em] text-white/50">
          Lab Profile – {LAB_NAME}
        </p>
        <p className="text-sm text-white/70">
          Your footprint and tools inside this lab.
        </p>
      </header>
      <div className="flex flex-col gap-8 lg:flex-row">
        <section className="flex-1 space-y-6">
          <ProfileHeaderCard
            profile={profile}
            handle={handle}
            hasWallet={hasWallet}
          />
          <div className="rounded-3xl border border-white/10 bg-[#0b1119] px-4 py-4">
            <nav className="flex items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#05070c] px-2 py-2 text-sm">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#05070c]">
                Overview
              </span>
              <InactiveTab label="Activity" />
              <InactiveTab label="Rewards" />
              <InactiveTab label="Signals" />
            </nav>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <LabStatsCard
                holdProgress={holdProgress}
                holdScore={holdScore}
                stats={stats}
              />
              <NextStepsCard quests={quests} />
            </div>
          </div>
          <MobileMiniApps apps={MINI_APPS} localePrefix={localePrefix} />
        </section>
        <aside className="hidden w-80 shrink-0 lg:block">
          <MiniAppsPanel apps={MINI_APPS} localePrefix={localePrefix} />
        </aside>
      </div>
    </div>
  );
}

function ProfileHeaderCard({
  profile,
  handle,
  hasWallet,
}: {
  profile: LabUserProfile;
  handle: string;
  hasWallet: boolean;
}) {
  const chips = [
    { label: `HOLD score: ${profile.hold_score ?? 0}` },
    { label: `Role: ${profile.role === "organizer" ? "Organizer" : "Player"}` },
    {
      label: `Self: ${profile.self_verified ? "Verified" : "Not verified"}`,
    },
    { label: `Wallet: ${hasWallet ? "Linked" : "No wallet"}` },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d141f] via-[#101a29] to-[#141f30] px-6 py-6 shadow-[0_45px_85px_-65px_rgba(0,0,0,0.85)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#11ffee]/60 to-[#8477ff]/40 text-2xl">
            🐺
          </div>
          <div>
            <p className="text-2xl font-semibold">{profile.name}</p>
            <p className="text-sm text-white/60">{handle}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="rounded-full border border-white/15 px-4 py-2"
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function InactiveTab({ label }: { label: string }) {
  return (
    <span className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
      {label}
    </span>
  );
}

type LabStatsCardProps = {
  holdProgress: number;
  holdScore: number;
  stats: Array<{ label: string; value: string; meta: string }>;
};

function LabStatsCard({ holdProgress, holdScore, stats }: LabStatsCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#04070c]/80 px-5 py-5">
      <p className="text-xs uppercase tracking-[0.32em] text-white/50">
        Lab stats
      </p>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/70">HOLD progress</p>
          <span className="font-semibold text-white">{holdScore} pts</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#56f0d5] to-[#68a1ff]"
            style={{ width: `${holdProgress}%` }}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 px-4 py-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              {stat.label}
            </p>
            <p className="mt-2 text-xl font-semibold text-white">
              {stat.value}
            </p>
            <p className="text-xs text-white/60">{stat.meta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type Quest = {
  id: string;
  label: string;
  completed: boolean;
  href: string;
  cta: string;
  disabled?: boolean;
};

function NextStepsCard({ quests }: { quests: Quest[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#050a12]/80 px-5 py-5">
      <p className="text-xs uppercase tracking-[0.32em] text-white/50">
        Next steps / Quests
      </p>
      <div className="mt-4 space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                {quest.label}
              </p>
              {!quest.completed ? (
                <p className="text-xs text-white/60">
                  {quest.id === "self"
                    ? "Boost trust and unlock gated quests."
                    : quest.id === "taberna"
                      ? "Join the live room with builders."
                      : "Send a dry-run Spray before your run."}
                </p>
              ) : (
                <p className="text-xs text-[#56f0d5]">Completed</p>
              )}
            </div>
            {quest.disabled || quest.completed ? (
              <span
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
                  quest.completed
                    ? "border border-[#56f0d5]/30 text-[#56f0d5]/70"
                    : "border border-white/20 text-white/30"
                }`}
              >
                {quest.completed ? "Done" : "Locked"}
              </span>
            ) : (
              <Link
                href={quest.href}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#05070c] transition hover:bg-white/90"
              >
                {quest.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

type MiniAppsPanelProps = {
  apps: MiniAppDefinition[];
  localePrefix: string;
};

function MiniAppsPanel({ apps, localePrefix }: MiniAppsPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#050a12]/90 px-5 py-5">
      <header className="mb-4 flex items-center justify-between text-sm text-white/70">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/40">
            Lab Mini Apps
          </p>
          <p className="text-xs text-white/60">Quick shortcuts for this run.</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 p-2 text-white/70 hover:text-white"
          aria-label="Customize mini apps (coming soon)"
        >
          <Settings className="h-4 w-4" />
        </button>
      </header>
      <MiniAppsGrid apps={apps} localePrefix={localePrefix} />
    </section>
  );
}

function MobileMiniApps({
  apps,
  localePrefix,
}: {
  apps: MiniAppDefinition[];
  localePrefix: string;
}) {
  return (
    <section className="lg:hidden">
      <details className="rounded-3xl border border-white/10 bg-[#050a12]/80 px-5 py-4">
        <summary className="flex cursor-pointer items-center justify-between text-sm text-white/80">
          <span className="inline-flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Mini Apps
          </span>
          <span className="text-xs text-white/50">Tap to open</span>
        </summary>
        <div className="mt-4">
          <MiniAppsGrid apps={apps} localePrefix={localePrefix} />
        </div>
      </details>
    </section>
  );
}

function MiniAppsGrid({
  apps,
  localePrefix,
}: {
  apps: MiniAppDefinition[];
  localePrefix: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {apps.map((app) => {
        const Icon = app.icon;
        const href = app.href ? `${localePrefix}${app.href}` : undefined;
        const content = (
          <div
            className={`flex flex-col items-center rounded-2xl border px-3 py-4 text-center text-xs ${
              app.status === "LIVE"
                ? "border-white/15 bg-white/5 text-white"
                : "border-white/5 bg-white/5 text-white/40"
            }`}
            title={app.description}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-semibold">{app.name}</p>
            <span
              className={`mt-2 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${
                app.status === "LIVE"
                  ? "bg-[#56f0d5]/20 text-[#56f0d5]"
                  : "bg-white/5 text-white/40"
              }`}
            >
              {app.status}
            </span>
          </div>
        );
        if (href && app.status === "LIVE") {
          return (
            <Link key={app.id} href={href}>
              {content}
            </Link>
          );
        }
        return (
          <div key={app.id} className="cursor-not-allowed">
            {content}
          </div>
        );
      })}
    </div>
  );
}

function formatHandle(name: string) {
  const safe = name.replace(/\s+/g, "").toLowerCase();
  return `@${safe || "denbuilder"}`;
}
