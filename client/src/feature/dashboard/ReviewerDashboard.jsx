import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle
} from "lucide-react";
import api from "../../api/axios";

export default function ReviewerDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [assignedProposals, setAssignedProposals] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/reviewer");
        setStats(res.data.stats);
        setAssignedProposals(res.data.assignedProposals);
      } catch {
        setError("Failed to load reviewer dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-600">Loading reviewer dashboard…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold text-slate-800">
          Reviewer Dashboard
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          You have <span className="font-medium">{stats.pending}</span>{" "}
          proposals awaiting review.
        </p>
      </section>

      {/* Stats */}
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

      {/* Needs Attention */}
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
                  className="flex justify-between items-center"
                >
                  <span className="text-slate-700">
                    {p.title}
                  </span>

                  <button
                    onClick={() => navigate(`/proposals/${p._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Review →
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Assigned Proposals Table */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Assigned Proposals
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Assigned On</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {assignedProposals.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                    No proposals assigned yet
                  </td>
                </tr>
              ) : (
                assignedProposals.map((p) => (
                  <ProposalRow
                    key={p._id}
                    title={p.title}
                    date={new Date(p.createdAt).toLocaleDateString()}
                    status={p.status}
                    onReview={() => navigate(`/proposals/${p._id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
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
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-800">
          {value}
        </span>
      </div>
      <p className="text-sm text-slate-600">
        {title}
      </p>
    </div>
  );
}

function ProposalRow({ title, date, status, onReview }) {
  const statusMap = {
    under_review: "bg-amber-50 text-amber-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700"
  };

  return (
    <tr
      onClick={onReview}
      className="cursor-pointer hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3 text-slate-800 font-medium">
        {title}
      </td>

      <td className="px-4 py-3 text-slate-600">
        {date}
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]}`}
        >
          {status.replace("_", " ")}
        </span>
      </td>

      <td className="px-4 py-3">
        {status === "under_review" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReview();
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            Review →
          </button>
        ) : (
          <span className="text-xs text-slate-400">
            Completed
          </span>
        )}
      </td>
    </tr>
  );
}