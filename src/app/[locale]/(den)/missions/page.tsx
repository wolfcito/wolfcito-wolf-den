const MISSIONS: Array<{
  id: string;
  title: string;
  type: "quest" | "minigame" | "event";
  requiresSelf: boolean;
  reward: string;
}> = [
  {
    id: "mission-self",
    title: "Verify identity with Self",
    type: "quest",
    requiresSelf: true,
    reward: "HOWL boost + unlocks Run rewards",
  },
  {
    id: "mission-quest",
    title: "Mint a PoS Pilot badge on Celo",
    type: "minigame",
    requiresSelf: true,
    reward: "25 HOWL + Spray drop",
  },
  {
    id: "mission-event",
    title: "Check in at MiniApp Monday Taberna",
    type: "event",
    requiresSelf: false,
    reward: "5 HOWL + access to recap",
  },
];

const TYPE_LABEL: Record<(typeof MISSIONS)[number]["type"], string> = {
  quest: "Quest",
  minigame: "MiniGame",
  event: "Event",
};

export default function MissionsPage() {
  return (
    <div className="space-y-8 text-wolf-foreground">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.32em] text-wolf-text-subtle">
          Builder Home
        </p>
        <div>
          <h1 className="text-2xl font-semibold text-white/90">Missions</h1>
          <p className="mt-2 text-sm text-white/70">
            Active missions inside the current Lab Run. Complete them to earn
            HOWL and qualify for Spray rewards.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MISSIONS.map((mission) => (
          <article
            key={mission.id}
            className="flex h-full flex-col justify-between rounded-lg border border-wolf-border-strong bg-[#14181f]/70 p-5 shadow-[0_30px_90px_-65px_rgba(5,8,10,0.85)]"
          >
            <div className="space-y-2">
              <span className="wolf-pill bg-wolf-emerald-soft text-[0.65rem] uppercase tracking-[0.3em] text-wolf-emerald">
                {TYPE_LABEL[mission.type]}
              </span>
              <h2 className="text-lg font-semibold text-white/90">
                {mission.title}
              </h2>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Reward: {mission.reward}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="wolf-pill border border-wolf-border-mid px-3 py-1 uppercase tracking-[0.28em] text-white/70">
                {mission.requiresSelf ? "Self required" : "Open to viewers"}
              </span>
              <button
                type="button"
                className="rounded-lg bg-[linear-gradient(180deg,#c8ff64_0%,#8bea4e_55%,#3b572a_100%)] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-[#0b1407] shadow-[0_0_24px_rgba(186,255,92,0.45)] transition hover:shadow-[0_0_30px_rgba(186,255,92,0.6)]"
              >
                View brief
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
