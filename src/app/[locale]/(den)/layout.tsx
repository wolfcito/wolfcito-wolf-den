import type { ReactNode } from "react";
import ActivityRail from "@/components/den/ActivityRail";
import MobileDenLayout from "@/components/den/MobileDenLayout";
import SidebarNav from "@/components/den/SidebarNav";
import TopBar from "@/components/den/TopBar";

export default function DenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="wolf-neon-backdrop text-wolf-foreground">
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="hidden lg:flex lg:flex-col lg:gap-6">
          <SidebarNav />
          <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
            <main className="wolf-card rounded-[2.2rem] border border-wolf-border-strong p-6 shadow-[0_40px_110px_-80px_rgba(0,0,0,0.75)] backdrop-blur">
              <TopBar />
              <section className="mt-6">{children}</section>
            </main>
            <aside>
              <div className="wolf-card rounded-[2rem] border border-wolf-border-strong p-4 shadow-[0_30px_95px_-70px_rgba(0,0,0,0.75)] backdrop-blur">
                <ActivityRail />
              </div>
            </aside>
          </div>
        </div>

        <div className="lg:hidden">
          <MobileDenLayout
            main={
              <>
                <TopBar />
                <section className="mt-6">{children}</section>
              </>
            }
            menu={<SidebarNav variant="mobile" />}
            activity={<ActivityRail />}
          />
        </div>
      </div>
    </div>
  );
}
