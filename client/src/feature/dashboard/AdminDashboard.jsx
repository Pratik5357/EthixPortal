import { useEffect, useState } from "react";
import {
  Layers,
  Users,
  CheckCircle,
  Clock,
  Eye,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

/* ================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [proposals, setProposals] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, proposalsRes, reviewersRes] = await Promise.all([
          api.get("/dashboard/admin"),
          api.get("/admin/proposals"),
          api.get("/admin/reviewers")
        ]);

        setStats(statsRes.data);
        setProposals(proposalsRes.data);
        setReviewers(reviewersRes.data);
      } catch {
        toast.error("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignReviewer = async (proposalId, reviewerIds) => {
    try {
      await api.post(`/admin/proposals/${proposalId}/assign-reviewers`, {
        reviewers: reviewerIds
      });

      toast.success("Reviewers assigned successfully");

      setProposals(prev => prev.filter(p => p._id !== proposalId));
      setAssigning(null);
    } catch {
      toast.error("Failed to assign reviewers");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-slate-600">
        Loading admin dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <section>
        <h1 className="text-2xl font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          System overview and reviewer assignment management.
        </p>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Proposals"
          value={stats.proposals.total}
          icon={<Layers />}
          color="blue"
        />
        <StatCard
          title="Approved"
          value={stats.proposals.approved}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="Under Review"
          value={stats.proposals.underReview}
          icon={<Clock />}
          color="amber"
        />
        <StatCard
          title="Total Users"
          value={stats.users.total}
          icon={<Users />}
          color="purple"
        />
      </section>

      {/* ================= ASSIGNMENT TABLE ================= */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Pending Reviewer Assignment
        </h2>

        <Card className="border border-gray-200 rounded-xl overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-auto">
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Study Title
                </TableHead>
                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                  Submitted On
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
              {proposals.length === 0 ? (
                <TableRow className="h-auto">
                  <TableCell
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No proposals awaiting assignment
                  </TableCell>
                </TableRow>
              ) : (
                proposals.map(p => (
                  <TableRow
                    key={p._id}
                    className="h-auto hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-3 font-medium text-slate-800 align-middle">
                      {p.administrative?.studyTitle || p.title}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-slate-600 align-middle">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="px-4 py-3 align-middle">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 italic">
                        {p.status.replace("_", " ")}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-start gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Proposal"
                          className="hover:bg-slate-100"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/proposals/${p._id}`);
                          }}
                        >
                          <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Assign Reviewer"
                          className="hover:bg-slate-100"
                          onClick={(e) => {
                            e.preventDefault();
                            setAssigning(p);
                          }}
                        >
                          <UserPlus className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* ================= MODAL ================= */}
      {assigning && (
        <AssignReviewerModal
          proposal={assigning}
          reviewers={reviewers}
          onClose={() => setAssigning(null)}
          onAssign={assignReviewer}
        />
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <Card className="border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-800">
          <p>{value}</p>
        </span>
      </div>
      <p className="text-md text-slate-600">{title}</p>
    </Card>
  );
}

/* ================= MODAL ================= */

function AssignReviewerModal({ proposal, reviewers, onClose, onAssign }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">

        <h3 className="text-lg font-semibold text-slate-800">
          Assign Reviewers
        </h3>

        <p className="text-sm text-slate-600">
          Proposal:{" "}
          <span className="font-medium">{proposal.title}</span>
        </p>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {reviewers.map(r => (
            <label
              key={r._id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(r._id)}
                onChange={() => toggle(r._id)}
              />
              {r.name} ({r.email})
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            disabled={selected.length === 0}
            onClick={() => onAssign(proposal._id, selected)}
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}