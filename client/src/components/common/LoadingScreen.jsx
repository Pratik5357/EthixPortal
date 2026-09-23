import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  fullscreen: "loader-screen loader-screen--fullscreen",
  page: "loader-screen loader-screen--page",
  section: "loader-screen loader-screen--section",
};

export default function LoadingScreen({
  message = "Loading…",
  variant = "page",
  className,
}) {
  useEffect(() => {
    if (variant !== "fullscreen") return undefined;

    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [variant]);

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(variantStyles[variant], className)}
    >
      <div className="loader-panel">
        <div className="loader-seal-wrap" aria-hidden>
          <div className="loader-seal">
            <span className="loader-seal__ripple loader-seal__ripple--one" />
            <span className="loader-seal__ripple loader-seal__ripple--two" />
            <div className="loader-seal__mark">
              <Shield className="h-5 w-5" strokeWidth={1.75} />
            </div>
          </div>
        </div>

        <div className="loader-copy">
          <p className="loader-caption">EthixPortal</p>
          <p className="loader-message">{message}</p>
        </div>

        <div className="loader-registry" aria-hidden>
          <span className="loader-registry__line" />
          <span className="loader-registry__line loader-registry__line--mid" />
          <span className="loader-registry__line loader-registry__line--short" />
        </div>
      </div>

      <span className="sr-only">{message}</span>
    </div>
  );

  if (variant === "fullscreen" && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
