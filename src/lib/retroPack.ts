import type { EventLab, FeedbackItem } from "./eventLabs";
import { supabaseAdmin } from "./supabaseAdmin";

// =====================================================
// RETRO PACK TYPES
// =====================================================

export type RetroPack = {
  lab: EventLab;
  summary: {
    total_feedback: number;
    by_status: Record<string, number>;
    by_priority: Record<string, number>;
    trust_distribution: {
      trusted: number;
      unverified: number;
      risk: number;
    };
  };
  top_issues: {
    p0: FeedbackItem[];
    p1: FeedbackItem[];
    p2: FeedbackItem[];
  };
  dropoff_points: Array<{
    route: string;
    error_count: number;
    last_seen_count: number;
  }>;
  recommendations: string[];
};

// =====================================================
// RETRO PACK GENERATION
// =====================================================

/**
 * Generate comprehensive retro pack for a lab
 *
 * Aggregates:
 * - Feedback items with status/priority breakdown
 * - Trust score distribution
 * - Top P0/P1/P2 issues (max 5 each)
 * - Drop-off points from error events
 * - Actionable recommendations
 */
export async function generateRetroPack(labId: string): Promise<RetroPack> {
  // Fetch lab details
  const { data: lab, error: labError } = await supabaseAdmin
    .from("event_labs")
    .select("*")
    .eq("id", labId)
    .single();

  if (labError || !lab) {
    throw new Error("Lab not found");
  }

  // Fetch all feedback items
  const { data: feedbackItems } = await supabaseAdmin
    .from("feedback_items")
    .select("*")
    .eq("lab_id", labId)
    .order("created_at", { ascending: false });

  const items = (feedbackItems ?? []) as FeedbackItem[];

  // Calculate summary stats
  const by_status: Record<string, number> = {};
  const by_priority: Record<string, number> = {};
  const trust_distribution = { trusted: 0, unverified: 0, risk: 0 };

  for (const item of items) {
    // Status breakdown
    by_status[item.status] = (by_status[item.status] ?? 0) + 1;

    // Priority breakdown
    if (item.priority) {
      by_priority[item.priority] = (by_priority[item.priority] ?? 0) + 1;
    }

    // Trust distribution
    if (item.trust_score >= 80) trust_distribution.trusted++;
    else if (item.trust_score >= 40) trust_distribution.unverified++;
    else trust_distribution.risk++;
  }

  // Get top issues by priority (max 5 each)
  const top_issues = {
    p0: items.filter((i) => i.priority === "P0").slice(0, 5),
    p1: items.filter((i) => i.priority === "P1").slice(0, 5),
    p2: items.filter((i) => i.priority === "P2").slice(0, 5),
  };

  // Analyze drop-off points from event tracking
  const { data: errorEvents } = await supabaseAdmin
    .from("event_tracking")
    .select("route, session_id")
    .eq("lab_id", labId)
    .eq("event_type", "error_flag");

  const routeErrors: Record<string, Set<string>> = {};
  for (const event of errorEvents ?? []) {
    if (!event.route) continue;
    if (!routeErrors[event.route]) {
      routeErrors[event.route] = new Set();
    }
    routeErrors[event.route].add(event.session_id);
  }

  const dropoff_points = Object.entries(routeErrors)
    .map(([route, sessions]) => ({
      route,
      error_count: sessions.size,
      last_seen_count: sessions.size,
    }))
    .sort((a, b) => b.error_count - a.error_count)
    .slice(0, 5);

  // Generate actionable recommendations
  const recommendations: string[] = [];

  if (top_issues.p0.length > 0) {
    recommendations.push(
      `Address ${top_issues.p0.length} critical P0 issue${top_issues.p0.length > 1 ? "s" : ""} immediately`,
    );
  }

  if (top_issues.p1.length > 3) {
    recommendations.push(
      `Triage ${top_issues.p1.length} P1 issues - prioritize by impact and effort`,
    );
  }

  if (dropoff_points.length > 0) {
    recommendations.push(
      `Investigate drop-off at: ${dropoff_points[0].route} (${dropoff_points[0].error_count} errors)`,
    );
  }

  if (trust_distribution.risk > items.length * 0.2) {
    recommendations.push(
      "High spam risk detected - consider enabling stricter verification for this lab",
    );
  }

  if (trust_distribution.trusted > items.length * 0.7) {
    recommendations.push(
      "Strong trust signals - feedback quality is high, safe to prioritize implementation",
    );
  }

  if (items.length === 0) {
    recommendations.push(
      "No feedback collected yet - share the public lab link to gather signals",
    );
  }

  return {
    lab: lab as EventLab,
    summary: {
      total_feedback: items.length,
      by_status,
      by_priority,
      trust_distribution,
    },
    top_issues,
    dropoff_points,
    recommendations,
  };
}

// =====================================================
// MARKDOWN EXPORT
// =====================================================

/**
 * Export retro pack as markdown document
 *
 * Format:
 * - Title with lab name and objective
 * - Summary stats
 * - Trust distribution
 * - Top P0/P1/P2 issues
 * - Drop-off points
 * - Recommendations
 * - Generated timestamp
 */
export function exportRetroPackAsMarkdown(retro: RetroPack): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Retro Pack: ${retro.lab.name}`);
  lines.push("");
  lines.push(`**Objective:** ${retro.lab.objective ?? "N/A"}`);
  lines.push(
    `**Duration:** ${retro.lab.start_date} - ${retro.lab.end_date ?? "Ongoing"}`,
  );
  lines.push(`**Status:** ${retro.lab.status}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Total Feedback:** ${retro.summary.total_feedback}`);
  lines.push(
    `- **Status Breakdown:** ${JSON.stringify(retro.summary.by_status)}`,
  );
  lines.push(
    `- **Priority Breakdown:** ${JSON.stringify(retro.summary.by_priority)}`,
  );
  lines.push("");

  // Trust Distribution
  lines.push("## Trust Distribution");
  lines.push("");
  lines.push(
    `- **Trusted (80+):** ${retro.summary.trust_distribution.trusted}`,
  );
  lines.push(
    `- **Unverified (40-79):** ${retro.summary.trust_distribution.unverified}`,
  );
  lines.push(`- **Risk (<40):** ${retro.summary.trust_distribution.risk}`);
  lines.push("");

  // Top P0 Issues
  if (retro.top_issues.p0.length > 0) {
    lines.push("## Top P0 Issues (Critical)");
    lines.push("");
    for (const item of retro.top_issues.p0) {
      const preview = item.message.substring(0, 100).replace(/\n/g, " ");
      lines.push(
        `- **[${item.id.substring(0, 8)}]** ${preview}${item.message.length > 100 ? "..." : ""}`,
      );
      lines.push(`  - Trust: ${item.trust_score}/100`);
      lines.push(`  - Status: ${item.status}`);
      if (item.route) lines.push(`  - Route: ${item.route}`);
      lines.push("");
    }
  }

  // Top P1 Issues
  if (retro.top_issues.p1.length > 0) {
    lines.push("## Top P1 Issues (High Priority)");
    lines.push("");
    for (const item of retro.top_issues.p1) {
      const preview = item.message.substring(0, 100).replace(/\n/g, " ");
      lines.push(
        `- **[${item.id.substring(0, 8)}]** ${preview}${item.message.length > 100 ? "..." : ""}`,
      );
      lines.push(`  - Trust: ${item.trust_score}/100`);
      lines.push(`  - Status: ${item.status}`);
      lines.push("");
    }
  }

  // Top P2 Issues
  if (retro.top_issues.p2.length > 0) {
    lines.push("## Top P2 Issues (Medium Priority)");
    lines.push("");
    for (const item of retro.top_issues.p2) {
      const preview = item.message.substring(0, 80).replace(/\n/g, " ");
      lines.push(
        `- **[${item.id.substring(0, 8)}]** ${preview}${item.message.length > 80 ? "..." : ""}`,
      );
      lines.push("");
    }
  }

  // Drop-off Points
  if (retro.dropoff_points.length > 0) {
    lines.push("## Drop-off Points");
    lines.push("");
    lines.push("Routes where users encountered errors:");
    lines.push("");
    for (const point of retro.dropoff_points) {
      lines.push(
        `- **${point.route}**: ${point.error_count} error${point.error_count > 1 ? "s" : ""} across ${point.last_seen_count} session${point.last_seen_count > 1 ? "s" : ""}`,
      );
    }
    lines.push("");
  }

  // Recommendations
  if (retro.recommendations.length > 0) {
    lines.push("## Recommendations");
    lines.push("");
    for (const rec of retro.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push("");
  }

  // Footer
  lines.push("---");
  lines.push("");
  lines.push(`Generated on ${new Date().toISOString()}`);
  lines.push(`Lab ID: ${retro.lab.id}`);
  lines.push(`Lab Slug: ${retro.lab.slug}`);

  return lines.join("\n");
}
