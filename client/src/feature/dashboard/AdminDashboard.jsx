import { useEffect, useState } from "react";
import {
  Layers,
  Users,
  CheckCircle,
  Clock
} from "lucide-react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stats
  const [stats, setStats] = useState(null);

  // Assignment
  const [proposals, setProposals] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          proposalsRes,
          reviewersRes
        ] = await Promise.all([
          api.get("/dashboard/admin"),   
          api.get("/admin/proposals"),   
          api.get("/admin/reviewers")  
        ]);

        setStats(statsRes.data);
        setProposals(proposalsRes.data);
        setReviewers(reviewersRes.data);
      } catch {
        setError("Failed to load admin dashboard data");
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

      // Remove assigned proposal from list
      setProposals(prev =>
        prev.filter(p => p._id !== proposalId)
      );

      setAssigning(null);
    } catch {
      alert("Failed to assign reviewers");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-600">Loading admin dashboard…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-10">

      {/* Header */}
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

      {/* ================= ASSIGNMENT ================= */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Pending Reviewer Assignment
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-slate-500">
                    No proposals awaiting assignment
                  </td>
                </tr>
              ) : (
                proposals.map(p => (
                  <tr key={p._id}>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {p.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700">
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setAssigning(p)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Assign Reviewer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
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

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-800">
          {value}
        </span>
      </div>
      <p className="text-sm text-slate-600">{title}</p>
    </div>
  );
}

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">

        <h3 className="text-lg font-semibold text-slate-800">
          Assign Reviewers
        </h3>

        <p className="text-sm text-slate-600">
          Proposal: <span className="font-medium">{proposal.title}</span>
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {reviewers.map(r => (
            <label key={r._id} className="flex items-center gap-2 text-sm">
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={selected.length === 0}
            onClick={() => onAssign(proposal._id, selected)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            Assign
          </button>
        </div>

      </div>
    </div>
  );
}