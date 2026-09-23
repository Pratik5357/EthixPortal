import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ title, description, children }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 27px, currentColor 27px, currentColor 28px)",
            }}
          />
        </div>

        <div className="relative">
          <Link to="/login" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">EthixPortal</p>
              <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/65">
                IEC Management System
              </p>
            </div>
          </Link>
        </div>

        <div className="relative max-w-md space-y-6">
          <h1 className="text-4xl leading-[1.12] text-primary-foreground">
            Research ethics, filed and traceable from submission to approval.
          </h1>
          <p className="text-base leading-relaxed text-primary-foreground/75">
            A secure counter for proposal intake, committee review, revision cycles,
            and publication of approved studies — aligned with ICMR and institutional
            guidelines.
          </p>

          <dl className="grid grid-cols-2 gap-4 border-t border-primary-foreground/20 pt-6 text-sm">
            <div>
              <dt className="text-primary-foreground/55">Roles supported</dt>
              <dd className="mt-1 font-medium">Researcher · Reviewer · Scrutiny · Admin</dd>
            </div>
            <div>
              <dt className="text-primary-foreground/55">Record type</dt>
              <dd className="mt-1 font-medium">Proposal docket with full audit trail</dd>
            </div>
          </dl>
        </div>

        <p className="relative text-xs text-primary-foreground/50">
          For authorized institutional users only.
        </p>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">EthixPortal</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  IEC Management
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl">{title}</h2>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <div className="surface-card p-6 sm:p-8">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
