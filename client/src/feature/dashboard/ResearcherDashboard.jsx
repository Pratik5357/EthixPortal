import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Edit,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import StampBadge from "@/components/common/StampBadge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div className="py-12 text-muted-foreground">Loading your docket…</div>
    );
  }

  const safeStats = stats || {
    total: 0,
    underReview: 0,
    approved: 0,
    actionRequired: 0,
  };

  const revisionItems = recentProposals.filter(
    (p) => p.status === "revision_required"
  );

  return (
    <div className="page-section">
      <PageHeader
        title="Researcher docket"
        description={`Welcome${user?.name ? `, ${user.name}` : ""}. Track submissions, committee feedback, and approval status.`}
        actions={
          <Button
            onClick={() => navigate("/proposals/new")}
          >
            <PlusCircle className="h-4 w-4" />
            New proposal
          </Button>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile
          label="Total filed"
          value={safeStats.total}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatTile
          label="Under review"
          value={safeStats.underReview}
          icon={<Clock className="h-4 w-4" />}
          tone="amber"
        />
        <StatTile
          label="Approved"
          value={safeStats.approved}
          icon={<CheckCircle className="h-4 w-4" />}
          tone="green"
        />
        <StatTile
          label="Action needed"
          value={safeStats.actionRequired}
          icon={<AlertCircle className="h-4 w-4" />}
          tone="stamp"
        />
      </section>

      {revisionItems.length > 0 && (
        <Alert className="rounded-xl border-stamp/30 bg-stamp/5">
          <AlertCircle className="h-4 w-4 text-stamp" />
          <AlertTitle className="text-foreground">Revision requested</AlertTitle>
          <AlertDescription>
            <ul className="mt-3 space-y-2">
              {revisionItems.map((p) => (
                <li
                  key={p._id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium">{p.title}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-sm w-fit"
                    onClick={() => navigate(`/proposals/${p._id}`)}
                  >
                    Review feedback
                  </Button>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <section>
        <h2 className="mb-4 text-xl">Recent submissions</h2>

        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium">Study title</TableHead>
                <TableHead className="font-medium">Filed</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentProposals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No proposals filed yet. Start with a new submission.
                  </TableCell>
                </TableRow>
              ) : (
                recentProposals.map((p) => {
                  const canEdit =
                    p.status === "draft" || p.status === "revision_required";

                  return (
                    <TableRow key={p._id} className="hover:bg-accent/15">
                      <TableCell className="font-medium max-w-[240px]">
                        <span className="line-clamp-2">
                          {p.administrative?.studyTitle || p.title}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <StampBadge status={p.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title={
                              p.status === "revision_required"
                                ? "Review feedback"
                                : "View proposal"
                            }
                            onClick={() => navigate(`/proposals/${p._id}`)}
                          >
                            {p.status === "revision_required" ? (
                              <MessageSquare className="h-4 w-4 text-stamp" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon-sm"
                            disabled={!canEdit}
                            title={
                              canEdit
                                ? "Edit proposal"
                                : "Editing locked after submission"
                            }
                            onClick={() => navigate(`/proposals/${p._id}/Edit`)}
                          >
                            <Edit
                              className={`h-4 w-4 ${
                                canEdit ? "text-primary" : "text-muted-foreground/40"
                              }`}
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value, icon, tone = "default" }) {
  const tones = {
    default: "text-primary bg-accent/50",
    amber: "text-amber-800 bg-amber-100/80",
    green: "text-primary bg-primary/10",
    stamp: "text-stamp bg-stamp/10",
  };

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}
        >
          {icon}
        </div>
        <span className="font-display text-3xl font-semibold tabular-nums leading-none">
          {value ?? 0}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
