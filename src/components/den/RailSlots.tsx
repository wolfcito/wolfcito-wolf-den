"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type RailSlotName = "left" | "right";

type RailSlotTargets = Record<RailSlotName, HTMLElement | null>;
type RailSlotActiveMap = Record<RailSlotName, boolean>;

type RailSlotsContextValue = {
  targets: RailSlotTargets;
  setTarget: (slot: RailSlotName, node: HTMLElement | null) => void;
  setActive: (slot: RailSlotName, isActive: boolean) => void;
  active: RailSlotActiveMap;
};

const RailSlotsContext = createContext<RailSlotsContextValue | null>(null);

export function DenRailSlotsProvider({ children }: PropsWithChildren) {
  const [targets, setTargets] = useState<RailSlotTargets>({
    left: null,
    right: null,
  });
  const [active, setActiveState] = useState<RailSlotActiveMap>({
    left: false,
    right: false,
  });

  const setTarget = useCallback((slot: RailSlotName, node: HTMLElement | null) => {
    setTargets((prev) => {
      if (prev[slot] === node) {
        return prev;
      }
      return { ...prev, [slot]: node };
    });
  }, []);

  const setActive = useCallback((slot: RailSlotName, isActive: boolean) => {
    setActiveState((prev) => {
      if (prev[slot] === isActive) {
        return prev;
      }
      return { ...prev, [slot]: isActive };
    });
  }, []);

  const value = useMemo(
    () => ({
      targets,
      setTarget,
      setActive,
      active,
    }),
    [targets, setTarget, setActive, active],
  );

  return (
    <RailSlotsContext.Provider value={value}>
      {children}
    </RailSlotsContext.Provider>
  );
}

function useRailSlotsContext() {
  const context = useContext(RailSlotsContext);
  if (!context) {
    throw new Error("Den rail slots provider missing");
  }
  return context;
}

export function useRailSlotTarget(slot: RailSlotName) {
  const { setTarget } = useRailSlotsContext();
  return useCallback(
    (node: HTMLElement | null) => {
      setTarget(slot, node);
    },
    [setTarget, slot],
  );
}

export function useRailSlotActive(slot: RailSlotName) {
  const { active } = useRailSlotsContext();
  return active[slot];
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}

function createRailPortalSlot(slot: RailSlotName) {
  return function RailPortalSlot({ children }: PropsWithChildren) {
    const { targets, setActive } = useRailSlotsContext();
    const isDesktop = useIsDesktop();
    useEffect(() => {
      setActive(slot, isDesktop);
      return () => setActive(slot, false);
    }, [setActive, isDesktop, slot]);
    const target = targets[slot];
    if (!target || !isDesktop) {
      return <>{children}</>;
    }
    return createPortal(children, target);
  };
}

export function DenMain({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export const DenLeftRail = createRailPortalSlot("left");
export const DenRightRail = createRailPortalSlot("right");
