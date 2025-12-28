import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Send, FileText } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proposal, setProposal] = useState(null);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isResearcher = user?.role === "researcher";
  const canEdit =
    isResearcher &&
    proposal &&
    ["draft", "revision_required"].includes(proposal.status);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await api.get(`/proposals/${id}`);
        setProposal(res.data);
        setForm(res.data);
      } catch {
        setError("Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-600">Loading proposal…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!proposal) {
    return (
      <div className="p-6 text-slate-600">
        Loading proposal details…
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const saveChanges = async () => {
    setError("");
    setMessage("");
    try {
      await api.put(`/proposals/${id}`, form);
      setMessage("Changes saved");
    } catch {
      setError("Failed to save changes");
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        await api.post(`/proposals/${id}/upload`, fd);
      }
      setMessage("Files uploaded");
      setFiles([]);
    } catch {
      setError("File upload failed");
    }
  };

  const submitProposal = async () => {
    try {
      await api.post(`/proposals/${id}/submit`);
      navigate("/dashboard");
    } catch {
      setError("Submission failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Proposal Details
          </h1>
          <p className="text-sm text-slate-600">
            Status:{" "}
            <span className="font-medium capitalize">
              {proposal.status.replace("_", " ")}
            </span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

        <Field label="Title" name="title" value={form.title} onChange={handleChange} disabled={!canEdit} />
        <Field label="Summary" name="summary" value={form.summary} onChange={handleChange} disabled={!canEdit} textarea />
        <Field label="Objectives" name="objectives" value={form.objectives} onChange={handleChange} disabled={!canEdit} textarea />
        <Field label="Methodology" name="methodology" value={form.methodology} onChange={handleChange} disabled={!canEdit} textarea />
        <Field label="Expected Outcome" name="expectedOutcome" value={form.expectedOutcome} onChange={handleChange} disabled={!canEdit} textarea />

        {/* Documents */}
        <section>
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            Uploaded Documents
          </h3>

          {proposal.documents?.length === 0 && (
            <p className="text-sm text-slate-500">No documents uploaded</p>
          )}

          <ul className="space-y-2">
            {proposal.documents?.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-blue-600">
                <FileText className="h-4 w-4" />
                <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                  {doc.fileName}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Upload */}
        {canEdit && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Documents
            </label>
            <input type="file" multiple onChange={handleFileChange} />
          </div>
        )}

        {/* Reviewer Comments */}
        {proposal.comments?.length > 0 && (
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Reviewer Comments
            </h3>

            <ul className="space-y-3 text-sm">
              {proposal.comments.map((c, idx) => (
                <li key={idx} className="border-b pb-2">
                  <p className="text-slate-700">{c.text}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Decision: <span className="capitalize">{c.decision.replace("_", " ")}</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reviewer Action */}
        {user?.role === "reviewer" && proposal.status === "under_review" && (
          <ReviewerCommentBox
            proposalId={proposal._id}
            onReviewed={() => navigate("/dashboard")}
          />
        )}

        {/* Resubmission */}
        {user?.role === "researcher" &&
          proposal.status === "revision_required" && (
            <ResubmissionBox proposalId={proposal._id} />
          )}

        {/* Actions */}
        {canEdit && (
          <div className="flex flex-wrap gap-3 justify-end pt-4">
            <button onClick={saveChanges} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
              <Save className="h-4 w-4" />
              Save Changes
            </button>

            <button onClick={uploadFiles} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
              <Upload className="h-4 w-4" />
              Upload Files
            </button>

            {proposal.status === "draft" && (
              <button onClick={submitProposal} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm">
                <Send className="h-4 w-4" />
                Submit Proposal
              </button>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}

function Field({ label, textarea, disabled, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea {...props} disabled={disabled} rows={4} className="w-full rounded-lg border px-4 py-2 text-sm disabled:bg-gray-50" />
      ) : (
        <input {...props} disabled={disabled} className="w-full rounded-lg border px-4 py-2 text-sm disabled:bg-gray-50" />
      )}
    </div>
  );
}

function ReviewerCommentBox({ proposalId, onReviewed }) {
  const [text, setText] = useState("");
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitReview = async () => {
    if (!text || !decision) return setError("All fields required");
    try {
      setLoading(true);
      await api.post(`/reviewer/proposals/${proposalId}/review`, { text, decision });
      onReviewed();
    } catch {
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t pt-6 space-y-4">
      <h3 className="text-lg font-semibold">Reviewer Decision</h3>

      <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm" />

      <div className="flex gap-6 text-sm">
        {["approved", "revision_required", "rejected"].map((d) => (
          <label key={d} className="flex items-center gap-2">
            <input type="radio" name="decision" value={d} onChange={(e) => setDecision(e.target.value)} />
            {d.replace("_", " ")}
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button onClick={submitReview} disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Submit Review
        </button>
      </div>
    </section>
  );
}

function ResubmissionBox({ proposalId }) {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resubmit = async () => {
    if (!response) return setError("Response required");
    try {
      setLoading(true);
      await api.post(`/proposals/${proposalId}/resubmit`, { responseText: response });
      navigate("/dashboard");
    } catch {
      setError("Resubmission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t pt-6 space-y-4">
      <h3 className="text-lg font-semibold">Respond & Resubmit</h3>
      <textarea rows={4} value={response} onChange={(e) => setResponse(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <button onClick={resubmit} disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm">
          Resubmit Proposal
        </button>
      </div>
    </section>
  );
}