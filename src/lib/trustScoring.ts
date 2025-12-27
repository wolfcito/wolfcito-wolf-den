import type { TrustScore } from "./eventLabs";
import { supabaseAdmin } from "./supabaseAdmin";

// =====================================================
// TRUST SCORING CONSTANTS
// =====================================================

const RATE_LIMIT_THRESHOLD = 10; // Max feedback items per session per lab
const TRUST_SCORE_BASE = 50;
const TRUST_SCORE_SELF_VERIFIED = 30;
const TRUST_SCORE_WALLET = 20;
const TRUST_PENALTY_RATE_LIMIT = -50;

// =====================================================
// TRUST SCORE CALCULATION
// =====================================================

/**
 * Calculate trust score for feedback submission
 *
 * Algorithm:
 * - Base score: 50
 * - Self-verified: +30
 * - Wallet connected: +20
 * - Rate limited (>10 feedback/session): -50
 *
 * Final score clamped to 0-100
 * Risk levels: trusted (80+), unverified (40-79), risk (<40)
 */
export async function calculateTrustScore(params: {
  labId: string;
  sessionId: string | null;
  labUserId: string | null;
}): Promise<TrustScore> {
  const { labId, sessionId, labUserId } = params;

  let score = TRUST_SCORE_BASE;
  const flags = {
    has_self_verification: false,
    has_wallet: false,
    is_rate_limited: false,
    session_feedback_count: 0,
  };

  // Check if user has self verification or wallet
  if (labUserId) {
    const { data: user } = await supabaseAdmin
      .from("lab_users")
      .select("self_verified, wallet_address")
      .eq("id", labUserId)
      .maybeSingle();

    if (user) {
      if (user.self_verified) {
        score += TRUST_SCORE_SELF_VERIFIED;
        flags.has_self_verification = true;
      }
      if (user.wallet_address) {
        score += TRUST_SCORE_WALLET;
        flags.has_wallet = true;
      }
    }
  }

  // Check session feedback count for rate limiting
  if (sessionId) {
    const { count } = await supabaseAdmin
      .from("feedback_items")
      .select("id", { count: "exact", head: true })
      .eq("lab_id", labId)
      .eq("session_id", sessionId);

    flags.session_feedback_count = count ?? 0;

    if (flags.session_feedback_count >= RATE_LIMIT_THRESHOLD) {
      score += TRUST_PENALTY_RATE_LIMIT;
      flags.is_rate_limited = true;
    }
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine risk level
  let risk_level: "trusted" | "unverified" | "risk";
  if (score >= 80) {
    risk_level = "trusted";
  } else if (score >= 40) {
    risk_level = "unverified";
  } else {
    risk_level = "risk";
  }

  return {
    score,
    flags,
    risk_level,
  };
}

/**
 * Get trust score description for UI display
 */
export function getTrustScoreLabel(score: number): string {
  if (score >= 80) return "Trusted";
  if (score >= 40) return "Unverified";
  return "Risk";
}

/**
 * Get trust score color class for UI styling
 */
export function getTrustScoreColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 40) return "yellow";
  return "red";
}
