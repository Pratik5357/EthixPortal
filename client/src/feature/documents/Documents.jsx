import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";

const Documents = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH APPROVED DOCUMENTS ---------------- */
  useEffect(() => {
    api
      .get("/documents/approved")
      .then((res) => {
        setDocuments(res.data.approvedProposals || []);
      })
      .catch(() => toast.error("Failed to load approved documents"))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredDocuments = documents.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term)
    );
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header with Right-aligned Search */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Approved Research Documents
          </h1>
          <p className="text-gray-600 mt-1">
            Publicly available IEC-approved research proposals
          </p>
        </div>

        {/* Right: Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="
              w-full
              pl-10 pr-4 py-2.5
              bg-white
              border border-gray-300
              rounded-lg
              text-sm
              focus:ring-2 focus:ring-blue-500
              focus:border-blue-500
            "
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading approved documents…</p>
        </div>
      )}

      {/* Documents Grid */}
      {!loading && filteredDocuments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full font-medium text-green-700 bg-green-100">
                    APPROVED
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {doc.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {doc.description}
                </p>

                {/* Meta */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">Researcher</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(doc.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/documents/${doc._id}`)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>

                  {doc.documents?.length > 0 && (
                    <button
                      onClick={() =>
                        window.open(
                          `https://ethixportal.onrender.com/api/documents/${doc._id}/download`,
                          "_blank"
                        )
                      }
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No approved documents found
          </h3>
          <p className="text-gray-600">
            Try searching with different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;