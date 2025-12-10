export type MissionType = "quest" | "minigame" | "event";

export type MissionStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed"
  | "eligible_for_reward";

export type Mission = {
  id: string;
  runId: string;
  title: string;
  description: string;
  type: MissionType;
  requiresSelf: boolean;
  rewardToken?: string;
  baseHowl?: number;
};

export type Run = {
  id: string;
  title: string;
  sponsor?: string;
  description?: string;
  isActive: boolean;
  missions: Mission[];
};

const mockRunsInternal: Run[] = [
  {
    id: "run-pos-pilot",
    title: "PoS Season Pilot",
    sponsor: "DenLabs",
    description: "Kick off PoS tooling with a lightweight builder Gauntlet.",
    isActive: true,
    missions: [
      {
        id: "mission-join-lab",
        runId: "run-pos-pilot",
        title: "Join the Lab",
        description:
          "Hop into DenLabs, pick your role, and check in for this run.",
        type: "quest",
        requiresSelf: false,
        baseHowl: 15,
      },
      {
        id: "mission-verify-self",
        runId: "run-pos-pilot",
        title: "Verify with Self",
        description: "Link your wallet with Self to unlock premium missions.",
        type: "quest",
        requiresSelf: true,
        rewardToken: "HOWL",
        baseHowl: 25,
      },
      {
        id: "mission-mines-demo",
        runId: "run-pos-pilot",
        title: "Try the Mines demo",
        description:
          "Play the Mind Games Mines demo and share your first score.",
        type: "minigame",
        requiresSelf: false,
        baseHowl: 10,
      },
      {
        id: "mission-taberna-live",
        runId: "run-pos-pilot",
        title: "Join Taberna live session",
        description: "Drop into the live Taberna call and post your takeaway.",
        type: "event",
        requiresSelf: false,
        rewardToken: "HOWL",
        baseHowl: 20,
      },
    ],
  },
];

export const mockRuns: Run[] = mockRunsInternal;

export const getActiveRun = (): Run | undefined =>
  mockRunsInternal.find((run) => run.isActive);
