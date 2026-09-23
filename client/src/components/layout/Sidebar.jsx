import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Home,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";

const SIDEBAR_PAD = "px-4";

const ROLE_LABELS = {
  admin: "Administrator",
  researcher: "Researcher",
  reviewer: "Reviewer",
  scrutiny: "Scrutiny Officer",
};

function formatRoleLabel(role) {
  return ROLE_LABELS[role] || role?.replace(/_/g, " ") || "User";
}

function NavItem({ to, end, icon: Icon, children, onClick, collapsed, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "flex min-h-10 items-center gap-3 rounded-lg text-[0.9375rem] font-medium transition-colors duration-150",
          collapsed ? "w-full justify-center px-0 py-2.5" : "px-3 py-2.5",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/88 hover:bg-sidebar-accent/55 hover:text-sidebar-foreground"
        )
      }
    >
      <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={1.75} />
      {!collapsed && <span className="truncate">{children}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onMobileClose?.();
    navigate("/login");
  };

  const closeMobile = () => onMobileClose?.();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showLabels = !collapsed || mobileOpen;

  const widthClass = showLabels
    ? "w-[var(--size-sidebar)]"
    : "w-[var(--size-sidebar-collapsed)]";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground",
          "border-r border-sidebar-border transition-[width] duration-200 ease-out",
          "-translate-x-full md:static md:translate-x-0 md:z-auto",
          mobileOpen && "translate-x-0",
          mobileOpen ? "w-[var(--size-sidebar)]" : widthClass
        )}
      >
        {/* Brand */}
        <div className={cn("shrink-0 border-b border-sidebar-border py-5", SIDEBAR_PAD)}>
          <div
            className={cn(
              "flex items-center",
              showLabels ? "justify-between gap-2" : "flex-col gap-3"
            )}
          >
            <NavLink
              to={user?.role === "researcher" ? "/" : "/dashboard"}
              className={cn(
                "flex min-w-0 items-center",
                showLabels ? "gap-3" : "justify-center"
              )}
              onClick={closeMobile}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent"
              >
                <Shield
                  className="h-5 w-5 text-sidebar-accent-foreground"
                  strokeWidth={1.75}
                />
              </div>
              {showLabels && (
                <div className="min-w-0">
                  <p className="font-display text-[1.0625rem] font-semibold leading-tight">
                    EthixPortal
                  </p>
                  <p className="mt-0.5 truncate text-[0.6875rem] uppercase tracking-[0.1em] text-sidebar-foreground/55">
                    IEC Records
                  </p>
                </div>
              )}
            </NavLink>

            <button
              type="button"
              onClick={onToggle}
              className={cn(
                "hidden rounded-lg p-2 text-sidebar-foreground/70 transition-colors",
                "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground md:inline-flex",
                !showLabels && "mx-auto"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeft className="h-[1.125rem] w-[1.125rem]" />
              ) : (
                <PanelLeftClose className="h-[1.125rem] w-[1.125rem]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 overflow-y-auto py-4", SIDEBAR_PAD)}>
          <ul className="flex flex-col gap-1">
            {user?.role === "researcher" && (
              <li>
                <NavItem
                  to="/"
                  end
                  icon={Home}
                  onClick={closeMobile}
                  collapsed={!showLabels}
                  label="Home"
                >
                  Home
                </NavItem>
              </li>
            )}
            <li>
              <NavItem
                to="/dashboard"
                icon={LayoutDashboard}
                onClick={closeMobile}
                collapsed={!showLabels}
                label="Dashboard"
              >
                Dashboard
              </NavItem>
            </li>
            <li>
              <NavItem
                to="/documents"
                icon={FileText}
                onClick={closeMobile}
                collapsed={!showLabels}
                label="Documents"
              >
                Documents
              </NavItem>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-sidebar-border py-4">
          {showLabels && user && (
            <div className={cn("mb-3", SIDEBAR_PAD)}>
              <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/40 px-3 py-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground"
                  aria-hidden
                >
                  {initials || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs capitalize text-sidebar-foreground/55">
                    {formatRoleLabel(user.role)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={SIDEBAR_PAD}>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2.5",
                "text-[0.9375rem] font-medium text-sidebar-foreground/85 transition-colors",
                "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                !showLabels && "justify-center px-0"
              )}
            >
              <LogOut className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={1.75} />
              {showLabels && "Sign out"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
