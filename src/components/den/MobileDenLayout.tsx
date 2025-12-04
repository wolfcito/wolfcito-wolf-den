"use client";

import { Home, LayoutGrid, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "@/i18n/routing";
import LimelightNav from "@/components/ui/LimelightNav";
import { useSidebar } from "@/components/ui/sidebar";

type MobilePanelKey = "main" | "menu" | "activity";

type NavigationItemConfig = {
  key: MobilePanelKey;
  icon: typeof Home;
  labelKey: string;
};

const navigationItems: NavigationItemConfig[] = [
  { key: "main", icon: Home, labelKey: "tabs.main" },
  { key: "menu", icon: LayoutGrid, labelKey: "tabs.menu" },
  { key: "activity", icon: Sparkles, labelKey: "tabs.activity" },
];

type MobileDenLayoutProps = {
  main: ReactNode;
  activity: ReactNode;
};

export function MobileDenLayout({ main, activity }: MobileDenLayoutProps) {
  const t = useTranslations("MobileDenLayout");
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [activePanel, setActivePanel] = useState<MobilePanelKey>("main");
  const navItems = useMemo(() => {
    return navigationItems.map(({ key, icon: Icon, labelKey }) => ({
      id: key,
      icon: <Icon className="h-5 w-5" aria-hidden />,
      label: t(labelKey),
    }));
  }, [t]);
  const activeIndex = navigationItems.findIndex(
    (item) => item.key === activePanel,
  );

  useEffect(() => {
    if (!pathname) {
      return;
    }
    setActivePanel("main");
  }, [pathname]);

  const renderPanel = useMemo(() => {
    if (activePanel === "activity") {
      return <div className="space-y-4">{activity}</div>;
    }

    return main;
  }, [activity, main, activePanel]);

  return (
    <>
      <div className="flex min-h-screen flex-col gap-5 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)]">
        <div className="wolf-card rounded-lg border border-wolf-border-strong p-4 shadow-[0_40px_110px_-80px_rgba(0,0,0,0.75)] backdrop-blur">
          {renderPanel}
        </div>
      </div>
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
      >
        <div className="pointer-events-auto w-full max-w-md">
          <LimelightNav
            items={navItems}
            activeIndex={activeIndex === -1 ? 0 : activeIndex}
            onTabChange={(index) => {
              const next = navigationItems[index];
              if (next) {
                if (next.key === "menu") {
                  setOpenMobile(true);
                  return;
                }
                setActivePanel(next.key);
              }
            }}
            className="w-full"
            iconContainerClassName="rounded-2xl"
            aria-label={t("aria.navigation")}
          />
        </div>
      </nav>
    </>
  );
}

export default MobileDenLayout;
