import AccessGate from "@/components/access/AccessGate";

type AccessPageSearchParams = {
  next?: string;
};

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<AccessPageSearchParams>;
}) {
  const resolved = await searchParams;
  const nextParam =
    typeof resolved.next === "string" && resolved.next.startsWith("/")
      ? resolved.next
      : undefined;

  return <AccessGate nextPath={nextParam} />;
}
