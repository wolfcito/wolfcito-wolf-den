import { redirect } from "next/navigation";

/**
 * Demo redirect - Participant view
 * /labs/demo/participant → /en/lab/demo-event
 */
export default function DemoParticipantRedirect() {
  redirect("/en/lab/demo-event");
}
