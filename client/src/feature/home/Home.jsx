import {
  FileText,
  ClipboardCheck,
  Users,
  ShieldCheck,
  ArrowRight,
  Star,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();

  if (user?.role !== "researcher") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 shadow-lg">
        <div className="max-w-3xl">
          <Badge className="mb-4 bg-white/20 text-white">
            Institutional Ethics Committee Platform
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="mt-4 text-blue-100 text-lg">
            EthixPortal is a secure digital platform for managing IEC workflows —
            from research submission to ethical review, approval, and compliance.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              Submit New Proposal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              View Approved Research
            </Button>
          </div>
        </div>

        <div className="absolute -right-24 -top-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            title="Submit Proposal"
            text="Create and submit a new research proposal for IEC review."
          />
          <ActionCard
            icon={<ClipboardCheck className="h-5 w-5 text-green-600" />}
            title="Track Review Status"
            text="Monitor approval progress and reviewer feedback."
          />
          <ActionCard
            icon={<Users className="h-5 w-5 text-purple-600" />}
            title="Committee Activity"
            text="View assignments and committee decisions."
          />
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          IEC Review Workflow
        </h2>
        <p className="text-slate-600 mb-8 max-w-2xl">
          A transparent, auditable workflow aligned with ICMR and institutional
          ethical guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WorkflowCard step="1" title="Submission" />
          <WorkflowCard step="2" title="Ethical Review" />
          <WorkflowCard step="3" title="Approval & Monitoring" />
        </div>
      </section>

      {/* FEEDBACK / TESTIMONIALS */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          What Researchers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeedbackCard
            name="Dr. Ananya Rao"
            role="Principal Investigator"
            text="EthixPortal streamlined our IEC submissions and reduced approval time significantly."
          />
          <FeedbackCard
            name="Dr. Rajesh Kumar"
            role="IEC Reviewer"
            text="The review workflow is transparent, structured, and audit-ready."
          />
          <FeedbackCard
            name="Dr. Sarah Johnson"
            role="Clinical Researcher"
            text="Tracking approvals and reviewer feedback is now effortless."
          />
        </div>
      </section>

      {/* SECURITY */}
      <section>
        <Card>
          <CardContent className="flex gap-5 p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Secure, Compliant & Audit-Ready
              </h3>
              <p className="text-slate-600 max-w-3xl">
                All submissions, reviews, and approvals are securely logged,
                time-stamped, and auditable for regulatory compliance.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CONTACT US */}
      <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Contact Us
          </h2>
          <p className="text-slate-600 mb-6">
            Have questions or need support? Reach out to the IEC team.
          </p>

          <form className="space-y-4">
            <Input placeholder="Your Name" />
            <Input type="email" placeholder="Your Email" />
            <Textarea placeholder="Your Message" rows={4} />

            <Button className="bg-blue-600 hover:bg-blue-700">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}

/* ----------------- SMALL COMPONENTS ----------------- */

function ActionCard({ icon, title, text }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        {text}
      </CardContent>
    </Card>
  );
}

function WorkflowCard({ step, title }) {
  return (
    <Card>
      <CardHeader>
        <Badge className="w-fit mb-2">Step {step}</Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Detailed, structured, and auditable workflow step.
      </CardContent>
    </Card>
  );
}

function FeedbackCard({ name, role, text }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-1 mb-2 text-yellow-500">
          <Star className="h-4 w-4 fill-yellow-400" />
          <Star className="h-4 w-4 fill-yellow-400" />
          <Star className="h-4 w-4 fill-yellow-400" />
          <Star className="h-4 w-4 fill-yellow-400" />
          <Star className="h-4 w-4 fill-yellow-400" />
        </div>
        <p className="text-sm text-slate-600 mb-4">
          “{text}”
        </p>
        <div className="text-sm font-medium text-slate-800">
          {name}
        </div>
        <div className="text-xs text-slate-500">
          {role}
        </div>
      </CardContent>
    </Card>
  );
}