"use client";

import { Activity, Loader2, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getActiveLabSlugClient } from "@/lib/labMode";

interface LabModeControlProps {
  labSlug: string;
  surfaces?: string[];
}

export function LabModeControl({
  labSlug,
  surfaces = [],
}: LabModeControlProps) {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Lab Mode is active on mount
  useEffect(() => {
    const activeSlug = getActiveLabSlugClient();
    setIsActive(activeSlug === labSlug);
  }, [labSlug]);

  const handleActivate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/labs/${labSlug}/lab-mode`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to activate Lab Mode");
      }

      setIsActive(true);

      // Reload page to initialize instrumentation
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to activate Lab Mode",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/labs/${labSlug}/lab-mode`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to deactivate Lab Mode");
      }

      setIsActive(false);

      // Reload page to stop instrumentation
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to deactivate Lab Mode",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-white">Lab Mode</p>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/60">
            {isActive
              ? "Navigate DenLabs routes to capture telemetry automatically"
              : "Activate to track your navigation and capture rich context"}
          </p>
          {surfaces.length > 0 && (
            <p className="mt-1 text-xs text-white/50">
              Observing: {surfaces.join(", ")}
            </p>
          )}
          {surfaces.length === 0 && (
            <p className="mt-1 text-xs text-white/50">Observing: All routes</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeactivate}
              disabled={isLoading}
              className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Lab Mode
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleActivate}
              disabled={isLoading}
              className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Start Lab Mode
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
