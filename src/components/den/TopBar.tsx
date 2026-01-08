"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  getBreadcrumbKeys,
  getModuleConfig,
  getTitleKey,
} from "@/config/moduleKeys";
import { usePathname } from "@/i18n/routing";
import { KeyboardShortcutsModal } from "../ui/KeyboardShortcutsModal";

export function TopBar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const config = getModuleConfig(pathname || "");
  const titleKey = getTitleKey(pathname || "");
  const breadcrumbKeys = getBreadcrumbKeys(pathname || "");

  const title = titleKey ? t(titleKey) : t("TopBar.fallback.title");

  // Extract module name from titleKey (sidebar.section.module -> module)
  const moduleName = config?.module;
  const description = moduleName
    ? t(`TopBar.modules.${moduleName}.description`, { default: "" })
    : t("TopBar.fallback.description");

  // Generate breadcrumb text
  const breadcrumb = breadcrumbKeys
    .map((key) => t(key, { default: "" }))
    .filter(Boolean)
    .join(" > ");

  // Global keyboard shortcut listener for '?'
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (
        e.key === "?" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-4 text-wolf-foreground">
        <div className="text-left">
          {breadcrumb && (
            <div className="text-xs text-wolf-text-subtle mb-0.5">
              {breadcrumb}
            </div>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
          {description && (
            <p className="text-sm text-wolf-text-subtle">{description}</p>
          )}
        </div>
      </div>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}

export default TopBar;
