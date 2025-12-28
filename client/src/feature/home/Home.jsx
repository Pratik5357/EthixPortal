import {
  FileText,
  ClipboardCheck,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ActionCard from "../../components/home/ActionCard";
import WorkflowStep from "../../components/home/WorkflowStep";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">

      {/* Welcome */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-slate-600 mt-1 max-w-2xl text-sm">
          EthixPortal is a secure platform for managing Institutional Ethics
          Committee workflows including research submissions, reviews, and
          approvals.
        </p>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            icon={<FileText />}
            title="Submit Proposal"
            description="Create and submit a new research proposal for IEC review."
          />

          <ActionCard
            icon={<ClipboardCheck />}
            title="Track Review Status"
            description="View approval progress and reviewer feedback."
          />

          <ActionCard
            icon={<Users />}
            title="Committee Activity"
            description="View assignments and committee actions."
          />
        </div>
      </section>

      {/* IEC Workflow */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">
          IEC Review Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WorkflowStep
            step="1"
            title="Submission"
            text="Researchers submit study protocols and required documents."
          />

          <WorkflowStep
            step="2"
            title="Ethical Review"
            text="Committee members review submissions and record decisions."
          />

          <WorkflowStep
            step="3"
            title="Approval & Monitoring"
            text="Approved studies are tracked for compliance and reporting."
          />
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Secure & Audit Ready
            </h3>
            <p className="text-slate-600 text-sm max-w-2xl">
              All actions are logged and auditable, supporting ethical
              governance and regulatory compliance for medical institutions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
