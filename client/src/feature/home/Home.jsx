import {
  FileText,
  ClipboardList,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Mail,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

const workflow = [
  {
    phase: "Intake",
    title: "Proposal submission",
    detail:
      "Complete the structured wizard with study details, consent documents, and investigator credentials.",
    icon: Send,
  },
  {
    phase: "Review",
    title: "Committee examination",
    detail:
      "Scrutiny checks compliance; reviewers assess methodology, risk, and ethical safeguards.",
    icon: ClipboardList,
  },
  {
    phase: "Resolution",
    title: "Approval & archive",
    detail:
      "Approved studies enter the public document registry with a permanent audit record.",
    icon: CheckCircle2,
  },
];

const quickLinks = [
  {
    title: "New proposal",
    text: "Open the submission wizard and file a study for IEC review.",
    to: "/proposals/new",
    icon: FileText,
  },
  {
    title: "Track submissions",
    text: "See status, reviewer notes, and revision requests on your dashboard.",
    to: "/dashboard",
    icon: Clock,
  },
  {
    title: "Approved registry",
    text: "Browse IEC-cleared research available for institutional reference.",
    to: "/documents",
    icon: FolderOpen,
  },
];

export default function Home() {
  const { user } = useAuth();

  if (user?.role !== "researcher") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-section">
      <PageHeader
        title={user?.name ? `Good day, ${user.name.split(" ")[0]}` : "Researcher desk"}
        description="Your IEC counter for filing proposals, tracking committee decisions, and accessing approved research."
        actions={
          <Button asChild size="lg">
            <Link to="/proposals/new">
              File new proposal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {/* Quick action cards */}
      <section className="surface-card overflow-hidden">
        <div className="grid md:grid-cols-3">
          {quickLinks.map((item, index) => (
            <Link
              key={item.title}
              to={item.to}
              className={cn(
                "group flex h-full min-h-[11rem] flex-col p-6 transition-colors duration-150 sm:p-7",
                "hover:bg-accent/25",
                index > 0 && "border-t border-border md:border-t-0 md:border-l"
              )}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/70 text-primary"
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg leading-snug">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
              <span
                className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              >
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Review pathway */}
      <section>
        <div className="mb-6 max-w-xl">
          <h2>Review pathway</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every proposal moves through the same auditable stages — from desk intake
            to committee sign-off.
          </p>
        </div>

        <ol className="surface-card divide-y divide-border overflow-hidden">
          {workflow.map((step, index) => (
            <li
              key={step.phase}
              className="flex gap-4 p-6 sm:gap-6 sm:p-7 lg:gap-8"
            >
              <div className="flex shrink-0 flex-col items-center gap-3 sm:w-14">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold tabular-nums text-primary-foreground"
                >
                  {index + 1}
                </span>
                <span
                  className="hidden text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block [writing-mode:vertical-rl] rotate-180"
                >
                  {step.phase}
                </span>
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start gap-3.5">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/60 text-primary"
                  >
                    <step.icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug">{step.title}</h3>
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Bottom panels */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card p-6 sm:p-7">
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/70 text-primary"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2>Compliance & audit trail</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Submissions, reviewer actions, and approval timestamps are logged
                for regulatory inspection. Revision requests preserve the full
                correspondence chain.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-6 sm:p-7">
          <h2 className="text-lg">IEC support desk</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Questions about submission requirements or committee scheduling.
          </p>

          <form
            className="mt-5 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = form.elements.namedItem("contact-name")?.value?.trim();
              const email = form.elements.namedItem("contact-email")?.value?.trim();
              const message = form.elements.namedItem("contact-message")?.value?.trim();

              if (!name || !email || !message) {
                toast.error("Please complete all fields before sending.");
                return;
              }

              toast.success("Enquiry recorded", {
                description:
                  "The IEC office will respond to your institutional email. For urgent matters, contact your committee secretary directly.",
              });
              form.reset();
            }}
          >
            <Input
              name="contact-name"
              placeholder="Your name"
              className="bg-background"
              required
            />
            <Input
              name="contact-email"
              type="email"
              placeholder="Institutional email"
              className="bg-background"
              required
            />
            <Textarea
              name="contact-message"
              placeholder="Describe your enquiry"
              rows={3}
              className="resize-none bg-background"
              required
            />
            <Button type="submit" variant="outline" className="w-full">
              <Mail className="h-4 w-4" />
              Send to IEC office
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
