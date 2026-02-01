import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft, Download, MessageSquare } from "lucide-react";

import {
  AdministrativeForm,
  ResearchForm,
  ParticipantForm,
  ConsentDataForm,
  DeclarationForm,
} from "../proposals/forms/Forms";
import ResearchPaperView from "./ResearchPaperView";

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useAuth();

  const [reviewForm, setReviewForm] = useState({
    text: "",
    decision: "revision_required"
  });

  const methods = useForm({
    defaultValues: {},
  });

  const { reset } = methods;

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await api.get(`/proposals/${id}`);
        setProposal(res.data);
        reset(res.data); // Populate form with data
      } catch (error) {
        toast.error("Failed to load proposal details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    }
  }, [id, navigate, reset]);

  const handleDownload = () => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/proposals/${id}/download`,
      "_blank"
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "revision_required": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "rejected": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "submitted": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "under_review": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.text.trim()) {
      return toast.error("Please provide review comments");
    }

    setSubmittingReview(true);
    try {
      await api.post(`/proposals/${id}/review/comment`, reviewForm);
      toast.success("Review submitted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isReviewerEligible = proposal &&
    user?.role === "reviewer" &&
    proposal.reviewers?.some(r => r._id === user?._id || r === user?._id) &&
    proposal.status === "under_review";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading proposal details...
      </div>
    );
  }

  if (!proposal) return null;

  // Check if we should show the Research Paper (HTML) view
  // Show paper view for approved documents OR when specifically requested via /documents route
  const showPaperView = proposal.status === "approved" && !isReviewerEligible && user?.role !== "admin" && user?.role !== "scrutiny";

  if (showPaperView) {
    return (
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <Button
            variant="ghost"
            className="pl-0 text-slate-500 hover:text-slate-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <ResearchPaperView proposal={proposal} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-2 pl-0 -ml-2 text-slate-500 hover:text-slate-800"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">
            {isReviewerEligible ? "Review Proposal" : "Proposal Details"}
          </h1>
          <p className="text-lg text-slate-600 mt-1">{proposal.title}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Badge className={getStatusColor(proposal.status)}>
              {proposal.status.replace("_", " ").toUpperCase()}
            </Badge>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">
              Submitted: {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "N/A"}
            </span>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">ID: {proposal.protocolNumber || proposal._id}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {proposal.status === "approved" ? (
            <Button
              variant="default"
              onClick={() => {
                const btn = document.getElementById("document-pdf-download-btn");
                if (btn) btn.click();
                else toast.error("PDF generator not ready");
              }}
              className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <Download className="h-4 w-4" /> Download Research Paper (PDF)
            </Button>
          ) : (
            proposal.documents?.length > 0 && (
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" /> Download Files
              </Button>
            )
          )}
        </div>
      </div>

      {/* Reviewer Comments Section - Visible if there are comments */}
      {proposal.comments && proposal.comments.length > 0 && (
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Reviewer Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {proposal.comments.map((comment, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">
                          {comment.reviewer?.name || "Reviewer"}
                        </span>
                        <Badge variant="outline" className={
                          comment.decision === "approved" ? "border-green-500 text-green-600" :
                            comment.decision === "revision_required" ? "border-orange-500 text-orange-600" :
                              "border-red-500 text-red-600"
                        }>
                          {comment.decision.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Read-Only Proposal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            Proposal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            {/* Hidden PDF Generator for when admin/researcher clicks Download in form view */}
            {!showPaperView && proposal.status === "approved" && (
              <div className="hidden">
                <ResearchPaperView proposal={proposal} />
              </div>
            )}
            <Tabs defaultValue="administrative" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 h-auto">
                <TabsTrigger value="administrative">Administrative</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="participant">Participant</TabsTrigger>
                <TabsTrigger value="consent">Consent & Data</TabsTrigger>
                <TabsTrigger value="declaration">Declaration</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <fieldset disabled={true} className="disabled:cursor-default disabled:opacity-100 group-disabled:opacity-100">
                  <style>{`
                  fieldset[disabled] input,
                  fieldset[disabled] textarea,
                  fieldset[disabled] select,
                  fieldset[disabled] button {
                    opacity: 1 !important;
                    background-color: #f8fafc;
                    color: #334155;
                    cursor: default;
                  }
                  /* Hide file inputs in read-only mode */
                  fieldset[disabled] input[type="file"] {
                    display: none;
                  }
                `}</style>

                  <TabsContent value="administrative" className="space-y-8">
                    <AdministrativeForm step={1} onFileUpload={() => { }} readOnly={true} />
                    <Separator className="my-8" />
                    <AdministrativeForm step={2} onFileUpload={() => { }} readOnly={true} />
                  </TabsContent>

                  <TabsContent value="research">
                    <ResearchForm onFileUpload={() => { }} readOnly={true} />
                  </TabsContent>

                  <TabsContent value="participant">
                    <ParticipantForm onFileUpload={() => { }} readOnly={true} />
                  </TabsContent>

                  <TabsContent value="consent">
                    <ConsentDataForm onFileUpload={() => { }} readOnly={true} />
                  </TabsContent>

                  <TabsContent value="declaration">
                    <DeclarationForm onFileUpload={() => { }} readOnly={true} />
                  </TabsContent>
                </fieldset>
              </div>
            </Tabs>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Review Submission Section for Reviewers */}
      {isReviewerEligible && (
        <Card className="border-t-4 border-t-amber-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-900">
              <MessageSquare className="h-6 w-6 text-amber-600" />
              Complete Your Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-700">Detailed Feedback for Research *</Label>
              <p className="text-sm text-slate-500">
                Please list any specific fields, data, or files that need correction or improvement.
                The researcher will see this feedback to revise their proposal.
              </p>
              <textarea
                className="w-full min-h-[150px] p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="Example: In section Research Details, the study duration seems unrealistic. Also, the Consent Form local language file is missing..."
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "approved",
                  label: "Approve Proposal",
                  activeClass: "border-green-500 bg-green-50",
                  dotClass: "bg-green-500",
                  textClass: "text-green-700"
                },
                {
                  id: "revision_required",
                  label: "Request Revision",
                  activeClass: "border-orange-500 bg-orange-50",
                  dotClass: "bg-orange-500",
                  textClass: "text-orange-700"
                },
                {
                  id: "rejected",
                  label: "Reject Proposal",
                  activeClass: "border-red-500 bg-red-50",
                  dotClass: "bg-red-500",
                  textClass: "text-red-700"
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, decision: opt.id })}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group
                    ${reviewForm.decision === opt.id
                      ? opt.activeClass
                      : "border-slate-100 bg-white hover:border-slate-200"}`}
                >
                  <div className={`w-3 h-3 rounded-full ${reviewForm.decision === opt.id ? opt.dotClass : "bg-slate-200"}`} />
                  <span className={`font-semibold text-sm ${reviewForm.decision === opt.id ? opt.textClass : "text-slate-600"}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleReviewSubmit}
                disabled={submittingReview}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 h-auto text-lg rounded-xl shadow-md transition-all active:scale-95"
              >
                {submittingReview ? "Submitting..." : "Submit Decision"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}