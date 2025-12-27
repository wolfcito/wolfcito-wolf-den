"use client";

import { FlaskConical } from "lucide-react";
import Link from "next/link";
import { LabForm } from "@/components/modules/labs/LabForm";

export default function CreateLabPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          ← Back to Labs
        </Link>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <FlaskConical
              className="h-6 w-6 text-wolf-emerald"
              aria-hidden="true"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Create Event Lab
            </h1>
            <p className="text-sm text-white/70">
              Set up a new feedback collection session
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <LabForm mode="create" />
      </div>

      {/* Info */}
      <div className="rounded-lg border border-wolf-emerald/20 bg-wolf-emerald/5 p-4">
        <h3 className="text-sm font-semibold text-white">
          What happens after creation?
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>You'll get a public link to share with participants</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>Feedback and events will be tracked automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>You can generate retro packs anytime</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-wolf-emerald">•</span>
            <span>Participants don't need accounts to submit feedback</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
