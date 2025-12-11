interface NotificationItemProps {
  title: string;
  timestamp: string;
  description?: string;
  accent?: "cyan" | "violet" | "neutral";
}

const accentClass: Record<
  NonNullable<NotificationItemProps["accent"]>,
  string
> = {
  cyan: "border-l-wolf-border-strong",
  violet: "border-l-wolf-violet-border",
  neutral: "border-l-wolf-border",
};

export function NotificationItem({
  title,
  timestamp,
  description,
  accent = "neutral",
}: NotificationItemProps) {
  return (
    <div className={`border-l-2 pl-4 ${accentClass[accent]}`}>
      <p className="text-sm font-medium text-white">{title}</p>
      {description ? (
        <p className="text-xs text-wolf-text-subtle">{description}</p>
      ) : null}
      <p className="mt-1 text-[11px] uppercase text-wolf-text-subtle">
        {timestamp}
      </p>
    </div>
  );
}

export default NotificationItem;
