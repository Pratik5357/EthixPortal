import { Menu, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, status } = useAuth();

  if (status !== "authenticated") return null;

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 flex h-[var(--size-header)] shrink-0 items-center justify-between border-b border-border/70 bg-card/90 px-5 backdrop-blur-sm sm:px-6 md:px-8 lg:px-10"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <Link
          to={user?.role === "researcher" ? "/" : "/dashboard"}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Shield
              className="h-[1.125rem] w-[1.125rem] text-primary-foreground"
              strokeWidth={1.75}
            />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[1.0625rem] font-semibold leading-tight text-foreground">
              EthixPortal
            </p>
            <p className="mt-0.5 hidden truncate text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground sm:block">
              IEC Desk
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-foreground">{user?.name}</p>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{user?.role}</p>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
          aria-hidden
        >
          {initials || "?"}
        </div>
      </div>
    </header>
  );
}
