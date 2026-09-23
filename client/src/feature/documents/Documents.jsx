import { useEffect, useState } from "react";
import { Search, Download, Eye, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";
import ResearchPaperView from "./ResearchPaperView";
import PageHeader from "@/components/common/PageHeader";
import StampBadge from "@/components/common/StampBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Documents() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  useEffect(() => {
    api
      .get("/documents/approved")
      .then((res) => {
        setDocuments(res.data.approvedProposals || []);
      })
      .catch(() => toast.error("Failed to load approved documents"))
      .finally(() => setLoading(false));
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-section">
      <PageHeader
        title="Approved research registry"
        description="IEC-cleared proposals available for institutional reference and download."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title…"
              className="h-10 bg-card pl-9"
            />
          </div>
        }
      />

      {loading && (
        <div className="py-16 text-center text-muted-foreground">
          Loading registry…
        </div>
      )}

      {!loading && filteredDocuments.length > 0 && (
        <div className="surface-card overflow-hidden">
          <ul className="divide-y divide-border">
            {filteredDocuments.map((doc) => (
              <li
                key={doc._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6 hover:bg-accent/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    <StampBadge status="approved" label="Approved" />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date unavailable"}
                    </span>
                  </div>

                  <h3 className="text-lg leading-snug">{doc.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground max-w-prose">
                    {doc.description || "No summary provided for this approved proposal."}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/documents/${doc._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDownloadingDoc(doc);
                    }}
                    title="Download research paper (PDF)"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && filteredDocuments.length === 0 && (
        <div className="surface-card py-16 text-center">
          <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
          <h3 className="text-lg">No documents match your search</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try different keywords or check back when new studies are approved.
          </p>
        </div>
      )}

      {downloadingDoc && (
        <div className="pointer-events-none fixed -left-[5000px] top-0 overflow-hidden opacity-0">
          <ResearchPaperView
            proposal={downloadingDoc}
            autoDownload={true}
            onDownloadComplete={() => setDownloadingDoc(null)}
          />
        </div>
      )}
    </div>
  );
}
