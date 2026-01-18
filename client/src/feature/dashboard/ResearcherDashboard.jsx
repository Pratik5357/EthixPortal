import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Edit,
  Eye
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentProposals, setRecentProposals] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/researcher");
        setStats(res.data.stats);
        setRecentProposals(res.data.recentProposals);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Researcher Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Welcome{user?.name ? `, ${user.name}` : ""}. Track your IEC submissions
            and review progress.
          </p>
        </div>

        <Button
          onClick={() => navigate("/proposals/new")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Proposal
        </Button>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Proposals"
          value={stats.total}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          title="Under Review"
          value={stats.underReview}
          icon={<Clock />}
          color="amber"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="Action Required"
          value={stats.actionRequired}
          icon={<AlertCircle />}
          color="red"
        />
      </section>

      {/* ================= NEEDS ACTION ================= */}
      {recentProposals.some(p => p.status === "revision_required") && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Needs Your Attention
          </h2>

          <ul className="space-y-2">
            {recentProposals
              .filter(p => p.status === "revision_required")
              .map(p => (
                <li
                  key={p._id}
                  className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-4 py-2"
                >
                  <span className="text-sm text-slate-700">
                    {p.title}
                  </span>

                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={() => navigate(`/proposals/${p._id}`)}
                  >
                    View & Respond
                  </Button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ================= RECENT PROPOSALS ================= */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Proposals
        </h2>

        <Card className="border border-gray-200 rounded-xl overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-auto">
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Title
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Submitted
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y">
              {recentProposals.length === 0 ? (
                <TableRow className="h-auto">
                  <TableCell
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No proposals submitted yet
                  </TableCell>
                </TableRow>
              ) : (
                recentProposals.map(p => (
                  <TableRow
                    key={p._id}
                    className="h-auto hover:bg-gray-50 bg-white transition-colors"
                  >
                    <TableCell className="px-4 py-3 text-slate-800 font-medium align-middle">
                      {p.title}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600 whitespace-nowrap align-middle">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.status)}`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-start gap-3">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Proposal"
                          className="hover:bg-slate-100"
                          onClick={() => navigate(`/documents/${p._id}`)}
                        >
                          <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>

                        {/* Edit Button - Disabled if submitted/approved/rejected */}
                        <div
                          className={`inline-block ${p.status !== "draft" && p.status !== "revision_required" ? "cursor-not-allowed" : ""}`}
                          title={p.status !== "draft" && p.status !== "revision_required" ? "Editing disabled for submitted proposals" : "Edit Proposal"}
                          onClick={(e) => {
                            if (p.status !== "draft" && p.status !== "revision_required") {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={p.status !== "draft" && p.status !== "revision_required"}
                            className={p.status !== "draft" && p.status !== "revision_required" ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"}
                            onClick={(e) => {
                              // This might not fire if disabled, handled by wrapper
                              e.preventDefault();
                              navigate(`/proposals/${p._id}/Edit`);
                            }}
                          >
                            <Edit className={`h-4 w-4 ${p.status === "draft" || p.status === "revision_required" ? "text-blue-600" : "text-slate-300"}`} />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <Card className="border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-800">
          {value}
        </span>
      </div>
      <p className="text-md text-slate-600">{title}</p>
    </Card>
  );
}

function statusBadge(status) {
  return {
    submitted: "bg-gray-100 text-gray-600",
    under_review: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    revision_required: "bg-red-50 text-red-700",
    rejected: "bg-red-100 text-red-700"
  }[status];
}