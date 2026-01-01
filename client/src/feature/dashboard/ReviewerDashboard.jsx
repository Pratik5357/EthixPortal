import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle
} from "lucide-react";
import api from "../../api/axios";
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

export default function ReviewerDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [assignedProposals, setAssignedProposals] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/reviewer");
        setStats(res.data.stats);
        setAssignedProposals(res.data.assignedProposals);
      } catch {
        toast.error("Failed to load reviewer dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading reviewer dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <section>
        <h1 className="text-2xl font-semibold text-slate-800">
          Reviewer Dashboard
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          You have{" "}
          <span className="font-medium">{stats.pending}</span>{" "}
          proposals awaiting review.
        </p>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Proposals"
          value={stats.totalAssigned}
          icon={<ClipboardList />}
          color="blue"
        />

        <StatCard
          title="Pending Reviews"
          value={stats.pending}
          icon={<Clock />}
          color="amber"
        />

        <StatCard
          title="Completed Reviews"
          value={stats.completed}
          icon={<CheckCircle />}
          color="green"
        />
      </section>

      {/* ================= NEEDS ATTENTION ================= */}
      {assignedProposals.some(p => p.status === "under_review") && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">
            Pending Reviews
          </h3>

          <ul className="space-y-1 text-sm">
            {assignedProposals
              .filter(p => p.status === "under_review")
              .map(p => (
                <li
                  key={p._id}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-700">
                    {p.title}
                  </span>

                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={() => navigate(`/proposals/${p._id}`)}
                  >
                    Review →
                  </Button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* ================= ASSIGNED PROPOSALS ================= */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Assigned Proposals
        </h2>

        <Card className="border border-gray-200 rounded-xl overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-auto">
                <TableHead className="px-4 py-3 text-slate-600">
                  Title
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600">
                  Assigned On
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y">
              {assignedProposals.length === 0 ? (
                <TableRow className="h-auto">
                  <TableCell
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No proposals assigned yet
                  </TableCell>
                </TableRow>
              ) : (
                assignedProposals.map(p => (
                  <TableRow
                    key={p._id}
                    className="h-auto hover:bg-gray-50"
                  >
                    <TableCell className="px-4 py-3 text-slate-800 leading-none font-medium">
                      {p.title}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600 leading-none">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex items-center leading-none px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.status)}`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      {p.status === "under_review" ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600"
                          onClick={() => navigate(`/proposals/${p._id}`)}
                        >
                          Review →
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Completed
                        </span>
                      )}
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

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600"
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
    under_review: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700"
  }[status];
}