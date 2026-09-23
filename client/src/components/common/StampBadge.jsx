import { cn } from "@/lib/utils";

const variants = {
  approved: "text-primary border-primary/70 bg-primary/5",
  under_review: "text-amber-800 border-amber-700/60 bg-amber-50",
  submitted: "text-ink-muted border-border bg-muted",
  admin_verified: "text-primary border-primary/50 bg-accent/50",
  scrutiny_verified: "text-primary border-primary/50 bg-accent/40",
  revision_required: "text-stamp border-stamp/70 bg-stamp/5",
  rejected: "text-stamp border-stamp bg-stamp/10",
  draft: "text-ink-muted border-dashed border-border bg-transparent",
  default: "text-primary border-primary/50 bg-accent/40",
};

export default function StampBadge({ status, label, className }) {
  const key = status?.toLowerCase?.().replace(/\s+/g, "_") || "default";

  return (
    <span
      className={cn(
        "stamp-mark whitespace-nowrap",
        variants[key] || variants.default,
        className
      )}
    >
      {label || status?.replace(/_/g, " ")}
    </span>
  );
}
