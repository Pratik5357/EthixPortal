import React from "react";
import {
    Calendar,
    Building2,
    FileQuestion,
    Target,
    FlaskConical,
    ClipboardList,
    Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import * as htmlToImage from 'html-to-image';
import { toast } from "sonner";

const ResearchPaperView = ({ proposal, autoDownload = false, onDownloadComplete = () => { } }) => {
    if (!proposal) return null;

    const paperId = `research-paper-content-${proposal._id}`;

    React.useEffect(() => {
        if (autoDownload) {
            const timer = setTimeout(() => {
                downloadPaper();
            }, 1500); // Wait a bit longer for all styles/fonts
            return () => clearTimeout(timer);
        }
    }, [autoDownload, proposal]);

    const { administrative, research, participant, consentData, createdAt } = proposal;

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const downloadPaper = async () => {
        const element = document.getElementById(paperId);
        if (!element) {
            onDownloadComplete();
            return;
        }

        const downloadToast = toast.loading("Generating professional A4 document...");

        try {
            await document.fonts.ready;

            // Generate image at 2x density for crispness
            const dataUrl = await htmlToImage.toJpeg(element, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            // Initialize A4 Portrait PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => { img.onload = resolve; });

            // Calculate height in mm relative to A4 width
            const imgWidth = img.width;
            const imgHeight = img.height;
            const imgMmHeight = (imgHeight * pageWidth) / imgWidth;

            // Simple vertical slicing pagination
            let heightLeft = imgMmHeight;
            let position = 0;

            // Page 1
            pdf.addImage(dataUrl, 'JPEG', 0, position, pageWidth, imgMmHeight);
            heightLeft -= pageHeight;

            // Subsequent pages
            while (heightLeft > 0) {
                position = heightLeft - imgMmHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, 'JPEG', 0, position, pageWidth, imgMmHeight);
                heightLeft -= pageHeight;
            }

            const fileName = (proposal.title || "Research_Paper")
                .replace(/[^a-z0-9]/gi, '_')
                .substring(0, 50);

            pdf.save(`${fileName}.pdf`);

            toast.success("A4 PDF generated successfully", { id: downloadToast });
            onDownloadComplete();
        } catch (err) {
            console.error("PDF generation failed:", err);
            toast.error("Generation error. Use Browser Print for manual save.", { id: downloadToast });
            onDownloadComplete();
        }
    };

    return (
        <div className="relative group w-full flex flex-col items-center">
            {/* Action Bar (Only visible in viewer, not PDF) */}
            <button
                id="document-pdf-download-btn"
                onClick={downloadPaper}
                className="fixed bottom-10 right-10 bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:bg-black transition-all z-50 flex items-center gap-3 hover:scale-105 active:scale-95"
                title="Download as Official PDF"
            >
                <Download className="h-6 w-6" />
                <span className="font-sans font-bold uppercase text-xs tracking-widest whitespace-nowrap pr-2">
                    Download Official Copy
                </span>
            </button>

            {/* The actual paper content */}
            <div
                id={paperId}
                className="bg-white max-w-[1200px] w-full my-4 p-10 border border-slate-100"
                style={{
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    fontFamily: 'serif',
                    fontSize: '10px',
                    lineHeight: '1.4'
                }}
            >
                {/* Journal Header */}
                <div className="text-center mb-8 border-b border-slate-900 pb-6">
                    <div className="uppercase tracking-[.4em] text-[8px] font-sans text-slate-400 mb-4 font-bold">
                        Institutional Ethics Committee • official Document
                    </div>
                    <h1 className="text-lg font-bold text-slate-900 mb-4 px-2">
                        {proposal.title || administrative?.studyTitle || "RESEARCH PROPOSAL"}
                    </h1>

                    <div className="flex justify-center gap-x-6 text-[9px] font-sans text-slate-600">
                        {administrative?.organization && <span>{administrative.organization}</span>}
                        <span>CERTIFIED: {formatDate(createdAt)}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {proposal.summary && (
                        <section>
                            <h4 className="font-sans font-bold text-[8px] uppercase tracking-widest text-slate-400 mb-2">Abstract</h4>
                            <div className="text-[10px] leading-relaxed text-slate-800 italic">{proposal.summary}</div>
                        </section>
                    )}

                    {/* Taxonomy / Parameters */}
                    <div className="flex flex-wrap gap-2 py-4 border-y border-slate-50">
                        {["IEC_APPROVED", research?.studyDesign, research?.fundingSource, participant?.riskAssessment && `${participant.riskAssessment}_RISK`]
                            .filter(Boolean)
                            .map(label => (
                                <span key={label} className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider">
                                    {label}
                                </span>
                            ))
                        }
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {proposal.objectives && (
                            <section>
                                <h4 className="font-sans font-bold text-[9px] uppercase tracking-wider text-slate-900 mb-1">Objectives</h4>
                                <div className="text-[10px] text-slate-700 whitespace-pre-wrap">{proposal.objectives}</div>
                            </section>
                        )}

                        <section>
                            <h4 className="font-sans font-bold text-[9px] uppercase tracking-wider text-slate-900 mb-1">Methodology</h4>
                            <div className="text-[10px] text-slate-700">
                                {research?.studyDesign && <p className="font-bold italic">Design: {research.studyDesign}</p>}
                                {proposal.methodology && <div className="whitespace-pre-wrap">{proposal.methodology}</div>}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <ClipboardList className="h-5 w-5 text-slate-900" />
                                <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">Ethical Framework</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7 font-sans">
                                <div className="p-4 bg-slate-50 rounded border border-slate-100">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Risk Profile</span>
                                    <span className="text-slate-900 font-medium">{participant?.riskAssessment || "Low"} Risk Level</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded border border-slate-100">
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Participant Consent</span>
                                    <span className="text-slate-900 font-medium">{consentData?.waiverRequest ? "Exempt / Waiver" : "Direct Participation"}</span>
                                </div>
                            </div>
                        </section>

                        {proposal.expectedOutcome && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <FileQuestion className="h-5 w-5 text-slate-900" />
                                    <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">Potential Impact</h4>
                                </div>
                                <div className="text-[12px] text-slate-700 italic pl-7 whitespace-pre-wrap">
                                    {proposal.expectedOutcome}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 text-center flex flex-col items-center">
                    <div className="text-[8px] font-sans text-slate-300 uppercase tracking-widest font-medium">
                        Official Archive copy • IEC APPROVED • Reference: {proposal._id.toString().toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchPaperView;
