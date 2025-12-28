import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [recentProposals, setRecentProposals] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/researcher");
        setStats(res.data.stats);
        setRecentProposals(res.data.recentProposals);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-600">Loading your dashboard…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
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

        {/* Create Proposal Button */}
        <button
          onClick={() => navigate("/proposals/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          <PlusCircle className="h-4 w-4" />
          Create New Proposal
        </button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Proposals" value={stats.total} icon={<FileText />} color="blue" />
        <StatCard title="Under Review" value={stats.underReview} icon={<Clock />} color="amber" />
        <StatCard title="Approved" value={stats.approved} icon={<CheckCircle />} color="green" />
        <StatCard title="Action Required" value={stats.actionRequired} icon={<AlertCircle />} color="red" />
      </section>

      {/* Needs Action */}
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

                  <button className="text-sm text-blue-600 hover:underline">
                    View & Respond
                  </button>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Recent Proposals */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Proposals
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentProposals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-slate-500">
                    No proposals submitted yet
                  </td>
                </tr>
              ) : (
                recentProposals.map((p) => (
                  <ProposalRow
                    key={p._id}
                    id={p._id}
                    title={p.title}
                    date={new Date(p.createdAt).toLocaleDateString()}
                    status={p.status}
                    onClick={() => navigate(`/proposals/${p._id}`)}
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
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-2xl font-semibold text-slate-800">{value}</span>
      </div>
      <p className="text-sm text-slate-600">{title}</p>
    </div>
  );
}

function ProposalRow({ id, title, date, status, onClick }) {
  const statusMap = {
    submitted: "bg-gray-100 text-gray-600",
    under_review: "bg-amber-50 text-amber-600",
    approved: "bg-green-50 text-green-600",
    revision_required: "bg-red-50 text-red-600",
    rejected: "bg-red-100 text-red-700"
  };

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-50">
      <td className="px-4 py-3 text-slate-800">{title}</td>
      <td className="px-4 py-3 text-slate-600">{date}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]}`}>
          {status.replace("_", " ")}
        </span>
      </td>
    </tr>
  );
}