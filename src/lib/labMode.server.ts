/**
 * Lab Mode - Server-side helpers
 * Server-only functions for managing Lab Mode cookies
 */

"use server";

import { cookies } from "next/headers";
import { LAB_MODE_COOKIE } from "./labMode";

/**
 * Server-side: Get active lab slug from cookie
 * Returns null if no lab is active
 */
export async function getActiveLabSlug(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(LAB_MODE_COOKIE);
  return cookie?.value || null;
}

/**
 * Server-side: Set active lab cookie
 * @param slug - Lab slug to activate
 */
export async function setActiveLabSlug(slug: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LAB_MODE_COOKIE, slug, {
    httpOnly: false, // Allow client-side reading for instrumentation
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/**
 * Server-side: Clear active lab cookie
 */
export async function clearActiveLabSlug(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LAB_MODE_COOKIE);
}
