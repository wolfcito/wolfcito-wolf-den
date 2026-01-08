"use client";

import { Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const t = useTranslations("KeyboardShortcuts");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ["navigation", "actions", "general"] as const;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-wolf-emerald/10">
              <Keyboard className="h-5 w-5 text-wolf-emerald" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{t("title")}</h2>
              <p className="text-sm text-white/60">{t("description")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-wolf-emerald">
                {t(`categories.${category}.title`)}
              </h3>
              <div className="space-y-2">
                {(
                  t.raw(`categories.${category}.shortcuts`) as Array<{
                    keys: string;
                    description: string;
                  }>
                ).map((shortcut) => (
                  <div
                    key={`${category}-${shortcut.keys}`}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm text-white/80">
                      {shortcut.description}
                    </span>
                    <kbd className="rounded border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm font-mono text-white">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
