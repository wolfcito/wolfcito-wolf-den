/**
 * Onboarding Guard - Ensures users complete required onboarding steps
 * before accessing Host Console (/en/labs routes)
 *
 * Required for Host Console:
 * 1. Wallet connected
 * 2. Handle set
 *
 * Optional (shows banner but doesn't block):
 * 3. Self verification
 */

export interface OnboardingStatus {
  /** Is wallet connected via AppKit? */
  hasWallet: boolean;
  /** Does user have a handle set? */
  hasHandle: boolean;
  /** Is user self-verified? (optional, doesn't block) */
  hasSelfVerified: boolean;
  /** Is user fully onboarded (wallet + handle)? */
  isOnboarded: boolean;
  /** User ID if available */
  userId: string | null;
}

/**
 * Check if user has completed required onboarding steps (client-side)
 * Uses fetch to /api/lab-user/self to get user status
 * @returns OnboardingStatus object
 */
export async function checkOnboardingStatus(): Promise<OnboardingStatus> {
  try {
    // Fetch user profile - this API call checks cookies internally
    const response = await fetch("/api/lab-user/self");

    if (!response.ok) {
      // User not authenticated or no profile
      return {
        hasWallet: false,
        hasHandle: false,
        hasSelfVerified: false,
        isOnboarded: false,
        userId: null,
      };
    }

    const { user } = await response.json();

    if (!user) {
      return {
        hasWallet: false,
        hasHandle: false,
        hasSelfVerified: false,
        isOnboarded: false,
        userId: null,
      };
    }

    const hasHandle = Boolean(user?.handle);
    const hasSelfVerified = Boolean(user?.self_verified);

    return {
      hasWallet: true, // If we got user, they have wallet
      hasHandle,
      hasSelfVerified,
      isOnboarded: hasHandle, // Onboarded = has wallet + handle
      userId: user.id,
    };
  } catch (error) {
    console.error("[OnboardingGuard] Error checking status:", error);
    return {
      hasWallet: false,
      hasHandle: false,
      hasSelfVerified: false,
      isOnboarded: false,
      userId: null,
    };
  }
}

/**
 * Generate redirect URL for incomplete onboarding
 * @param currentPath - Where user wanted to go (may include locale prefix)
 * @returns Redirect URL with next param (locale removed from next value)
 */
export function getOnboardingRedirectUrl(currentPath: string): string {
  // Remove locale prefix from path (/en/labs/create -> /labs/create)
  const pathWithoutLocale = currentPath.replace(/^\/(en|es)\//, "/");
  const nextParam = encodeURIComponent(pathWithoutLocale);
  return `/access?next=${nextParam}`;
}
