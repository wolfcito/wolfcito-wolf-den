import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getStoredLabUserId, type LabUserProfile } from "@/lib/userProfile";

type GuardOptions = {
  locale: string;
  nextPath: string;
};

function sanitizeNextPath(nextPath: string) {
  if (!nextPath) {
    return "/lab";
  }
  const trimmed = nextPath.trim();
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/[^/A-Za-z0-9?=&._-]/g, "");
}

function buildAccessUrl({ locale, nextPath }: GuardOptions) {
  const params = new URLSearchParams();
  params.set("next", sanitizeNextPath(nextPath));
  return `/${locale}/access?${params.toString()}`;
}

export async function requireProfile({
  locale,
  nextPath,
}: GuardOptions): Promise<LabUserProfile> {
  const id = await getStoredLabUserId();
  if (!id) {
    redirect(buildAccessUrl({ locale, nextPath }));
  }
  const { data, error } = await supabaseAdmin
    .from("lab_users")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    redirect(buildAccessUrl({ locale, nextPath }));
  }
  const profile = data as LabUserProfile;
  if (!profile.wallet_address || !profile.handle) {
    redirect(buildAccessUrl({ locale, nextPath }));
  }
  return profile;
}

export async function requireWallet({
  locale,
  nextPath,
}: GuardOptions): Promise<LabUserProfile> {
  const profile = await requireProfile({ locale, nextPath });
  return profile;
}
