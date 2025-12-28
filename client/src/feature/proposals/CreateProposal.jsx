import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Send } from "lucide-react";
import api from "../../api/axios";

export default function CreateProposal() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    objectives: "",
    methodology: "",
    expectedOutcome: ""
  });

  const [proposalId, setProposalId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  /* ================= SAVE DRAFT ================= */
  const saveDraft = async () => {
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Title is required to save draft");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/proposals/draft", form);
      setProposalId(res.data.proposal._id);
      setMessage("Draft saved successfully");
    } catch {
      setError("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD DOCUMENT ================= */
  const uploadDocuments = async () => {
    if (!proposalId || files.length === 0) return;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post(
          `/proposals/${proposalId}/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      setMessage("Documents uploaded successfully");
      setFiles([]);
    } catch {
      setError("Document upload failed");
    }
  };

  /* ================= SUBMIT PROPOSAL ================= */
  const submitProposal = async () => {
    setError("");
    setMessage("");

    if (!proposalId) {
      setError("Please save draft before submitting");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/proposals/${proposalId}/submit`);
      navigate("/dashboard");
    } catch {
      setError("Failed to submit proposal");
    } finally {
      setLoading(false);
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
            Create Research Proposal
          </h1>
          <p className="text-sm text-slate-600">
            Save as draft, upload documents, and submit for IEC review
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

        <Input label="Proposal Title *" name="title" value={form.title} onChange={handleChange} />
        <Textarea label="Summary" name="summary" value={form.summary} onChange={handleChange} />
        <Textarea label="Objectives" name="objectives" value={form.objectives} onChange={handleChange} />
        <Textarea label="Methodology" name="methodology" value={form.methodology} onChange={handleChange} />
        <Textarea label="Expected Outcome" name="expectedOutcome" value={form.expectedOutcome} onChange={handleChange} />

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Upload Documents (PDF / Word)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm"
          />
        </div>

        {/* Messages */}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {message && <div className="text-sm text-green-600">{message}</div>}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end pt-4">

          <button
            onClick={saveDraft}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>

          <button
            onClick={uploadDocuments}
            disabled={!proposalId || files.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </button>

          <button
            onClick={submitProposal}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            Submit Proposal
          </button>

        </div>
      </div>
    </div>
  );
}


function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}