import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DocumentDetail() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/proposals/${id}`) // 🔥 backend must ensure approved only
      .then((res) => setProposal(res.data))
      .catch(() => toast.error("Document not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    window.open(
      `https://ethixportal.onrender.com/api/proposals/${id}/download`,
      "_blank"
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Loading proposal…</p>;
  }

  if (!proposal) {
    return <p className="text-center mt-10">Proposal not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        {proposal.title}
      </h1>

      <p className="text-sm text-gray-600 mb-4">
        Submitted on{" "}
        {new Date(proposal.submittedAt).toLocaleDateString()}
      </p>

      <div className="bg-white border rounded-lg p-6 shadow">
        <p className="whitespace-pre-line">
          {proposal.description}
        </p>
      </div>

      {proposal.documents?.length > 0 && (
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-700"
          onClick={handleDownload}
        >
          Download Documents
        </Button>
      )}
    </div>
  );
}