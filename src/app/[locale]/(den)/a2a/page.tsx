"use client";

import { Workflow } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface A2ACapabilities {
  name: string;
  version: string;
  status: string;
  capabilities: string[];
  endpoints?: Array<{
    name: string;
    url: string;
    method: string;
  }>;
}

export default function A2APage() {
  const t = useTranslations("A2A");
  const [capabilities, setCapabilities] = useState<A2ACapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTestCapabilities() {
    setIsLoading(true);
    setCapabilities(null);

    try {
      const response = await fetch("/api/a2a/capabilities");
      const data: A2ACapabilities = await response.json();
      setCapabilities(data);
    } catch (_error) {
      setCapabilities({
        name: "Error",
        version: "N/A",
        status: "error",
        capabilities: [t("errors.network")],
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <Workflow className="h-6 w-6 text-wolf-emerald" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-semibold text-white">{t("title")}</h1>
        </div>
        <p className="text-white/70">{t("description")}</p>
      </div>

      {/* Concept Explanation */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">{t("concept.title")}</h2>
        <p className="text-sm text-white/70">{t("concept.description")}</p>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>{t("concept.item1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>{t("concept.item2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>{t("concept.item3")}</span>
          </li>
        </ul>
      </div>

      {/* Test Capabilities */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">{t("test.title")}</h2>
        <p className="text-sm text-white/70">{t("test.description")}</p>

        <button
          type="button"
          onClick={handleTestCapabilities}
          disabled={isLoading}
          className="w-full rounded-lg border border-[#4ca22a] bg-[#89e24a] px-6 py-3 font-semibold uppercase text-[#09140a] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(186,255,92,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isLoading ? t("test.testing") : t("test.testCapabilities")}
        </button>

        {capabilities && (
          <div className="mt-4 space-y-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase text-white/60">
                  {t("capabilities.agent")}
                </p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase text-white/70">
                  {capabilities.status}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">
                {capabilities.name}
              </p>
              <p className="text-sm text-white/60">
                {t("capabilities.version")}: {capabilities.version}
              </p>
            </div>

            {capabilities.capabilities && capabilities.capabilities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase text-white/60">
                  {t("capabilities.available")}
                </p>
                <ul className="space-y-1">
                  {capabilities.capabilities.map((capability, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <span className="text-wolf-emerald">✓</span>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {capabilities.endpoints && capabilities.endpoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase text-white/60">
                  {t("capabilities.endpoints")}
                </p>
                {capabilities.endpoints.map((endpoint) => (
                  <div
                    key={endpoint.url}
                    className="rounded-lg border border-white/10 bg-black/30 p-3"
                  >
                    <p className="font-mono text-xs text-white">
                      <span className="text-wolf-emerald">{endpoint.method}</span>{" "}
                      {endpoint.url}
                    </p>
                    <p className="mt-1 text-xs text-white/60">{endpoint.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Use Cases */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">{t("useCases.title")}</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold text-white">{t("useCases.case1Title")}</p>
            <p className="mt-1 text-sm text-white/70">
              {t("useCases.case1Description")}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold text-white">{t("useCases.case2Title")}</p>
            <p className="mt-1 text-sm text-white/70">
              {t("useCases.case2Description")}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold text-white">{t("useCases.case3Title")}</p>
            <p className="mt-1 text-sm text-white/70">
              {t("useCases.case3Description")}
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
        <p className="font-semibold text-white/90">{t("info.title")}</p>
        <p className="mt-2">{t("info.description")}</p>
      </div>
    </div>
  );
}
