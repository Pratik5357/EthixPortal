import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    FileCheck
} from "lucide-react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ================================================= */

export default function ScrutinyDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pendingProposals, setPendingProposals] = useState([]);
    const [stats, setStats] = useState({ pendingCount: 0 });
    const [confirmation, setConfirmation] = useState({ id: null, decision: null });

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/scrutiny/dashboard");
                setPendingProposals(res.data.pending);
                setStats(res.data.stats);
            } catch {
                toast.error("Failed to load scrutiny dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const processAction = async () => {
        const { id, decision } = confirmation;
        if (!id || !decision) return;

        try {
            await api.post(`/scrutiny/${id}/action`, { decision });
            toast.success(
                decision === "approve"
                    ? "Proposal approved and forwarded to reviewer"
                    : "Proposal rejected"
            );
            setPendingProposals(prev => prev.filter(p => p._id !== id));
            setStats(prev => ({ ...prev, pendingCount: prev.pendingCount - 1 }));
        } catch {
            toast.error("Failed to process proposal");
        } finally {
            setConfirmation({ id: null, decision: null });
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-slate-600">
                Loading scrutiny dashboard…
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* ================= HEADER ================= */}
            <section>
                <h1 className="text-2xl font-semibold text-slate-800">
                    Scrutiny Dashboard
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                    Review admin-verified proposals before forwarding to reviewers.
                </p>
            </section>

            {/* ================= STATS ================= */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="Pending Scrutiny"
                    value={stats.pendingCount}
                    icon={<Clock />}
                    color="amber"
                />
                {/* Placeholder stats */}
                <StatCard
                    title="Scrutiny Verified"
                    value="-"
                    icon={<CheckCircle />}
                    color="green"
                />
                <StatCard
                    title="Total Processed"
                    value="-"
                    icon={<ClipboardList />}
                    color="blue"
                />
            </section>

            {/* ================= TABLE ================= */}
            <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                    Pending Verification
                </h2>

                <Card className="border border-gray-200 rounded-xl overflow-hidden p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow className="h-auto">
                                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                                    Study Title
                                </TableHead>
                                <TableHead className="px-4 py-3 text-slate-600 w-1/4">
                                    Researcher ID
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
                            {pendingProposals.length === 0 ? (
                                <TableRow className="h-auto">
                                    <TableCell
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-slate-500"
                                    >
                                        No proposals pending scrutiny
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingProposals.map(p => (
                                    <TableRow
                                        key={p._id}
                                        className="h-auto hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell className="px-4 py-3 font-medium text-slate-800 align-middle">
                                            {p.title}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-slate-600 align-middle">
                                            {p.researcher?.shortCode || "N/A"}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 align-middle">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 italic">
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
                                                    onClick={() => navigate(`/proposals/${p._id}`)}
                                                >
                                                    <Eye className="h-4 w-4 text-slate-500 hover:text-blue-600" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => setConfirmation({ id: p._id, decision: "approve" })}
                                                >
                                                    <FileCheck className="h-4 w-4 mr-1" />
                                                    Verify
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setConfirmation({ id: p._id, decision: "reject" })}
                                                >
                                                    Reject
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


            <AlertDialog open={!!confirmation.id} onOpenChange={(open) => !open && setConfirmation({ id: null, decision: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmation.decision === "approve" ? "Approve Proposal?" : "Reject Proposal?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmation.decision === "approve"
                                ? "This will approve the proposal and forward it to reviewers. This action cannot be undone."
                                : "This will reject the proposal and return it to the researcher. This action cannot be undone."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={processAction}
                            className={confirmation.decision === "reject" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                            {confirmation.decision === "approve" ? "Approve & Forward" : "Reject Proposal"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
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
