import { redirect } from "next/navigation";

/**
 * Demo redirect - Host view
 * /labs/demo → /en/labs/demo-event
 */
export default function DemoRedirect() {
  redirect("/en/labs/demo-event");
}
