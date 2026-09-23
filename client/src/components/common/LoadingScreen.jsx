import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  fullscreen:
    "fixed inset-0 z-50 h-[100dvh] min-h-screen w-full bg-background",
  page: "min-h-[min(50vh,28rem)] w-full py-12",
  section: "w-full py-16",
};

export default function LoadingScreen({
  message = "Loading…",
  variant = "page",
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center px-6",
        variantStyles[variant],
        className
      )}
    >
      <div className="loader-panel">
        <div className="loader-emblem-wrap" aria-hidden>
          <div className="loader-emblem">
            <div className="loader-emblem__ring" />
            <div className="loader-emblem__icon">
              <Shield className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
        </div>

        <div className="loader-copy">
          <p className="loader-caption">EthixPortal</p>
          <p className="loader-message">{message}</p>
        </div>

        <div className="loader-track" aria-hidden>
          <div className="loader-track__bar" />
        </div>
      </div>

      <span className="sr-only">{message}</span>
    </div>
  );
}
