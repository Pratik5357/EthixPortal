import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalSchema } from "@/schemas/proposalSchema";
import {
    AdministrativeForm,
    ResearchForm,
    ParticipantForm,
    ConsentDataForm,
    DeclarationForm,
} from "./forms/Forms";
import api from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const steps = [
    { title: "Administrative Details", component: AdministrativeForm, stepNum: 1 },
    { title: "Investigator Information", component: AdministrativeForm, stepNum: 2 },
    { title: "Research Details", component: ResearchForm },
    { title: "Participant Information", component: ParticipantForm },
    { title: "Consent & Data Management", component: ConsentDataForm },
    { title: "Declaration & Checklist", component: DeclarationForm },
];

export default function ProposalWizard() {
    const { id: urlProposalId } = useParams();
    const navigate = useNavigate();

    const [proposalId, setProposalId] = useState(urlProposalId || null);
    const [proposalData, setProposalData] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const methods = useForm({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            administrative: {
                reviewType: "",
                organization: "",
                iecName: "",
                studyTitle: "",
                coInvestigators: []
            },
            research: {
                studyType: [],
                studyDesign: "",
                studySites: "",
                fundingSource: "",
                siteDetails: [],
                conflictOfInterest: false,
                insuranceCoverage: false
            },
            participant: {
                vulnerableGroups: [],
                riskAssessment: "",
                benefitAssessment: "",
            },
            consentData: {
                waiverRequest: false,
                avRecording: false,
                dataSharing: "",
                sampleStorage: "",
            },
            declaration: {
                agree: false
            }
        },
    });

    const { handleSubmit, setValue, getValues, reset } = methods;

    useEffect(() => {
        if (urlProposalId) {
            api
                .get(`/proposals/${urlProposalId}`)
                .then((res) => {
                    // Format date for input[type="date"]
                    if (res.data.administrative?.dateOfSubmission) {
                        res.data.administrative.dateOfSubmission = res.data.administrative.dateOfSubmission.split("T")[0];
                    }
                    setProposalData(res.data);
                    reset(res.data);
                    setProposalId(res.data._id);
                })
                .catch(() => toast.error("Failed to load proposal"));
        }
    }, [urlProposalId, reset]);

    const ensureProposalId = async (shouldRedirect = false) => {
        if (proposalId) return proposalId;

        const currentData = getValues();

        // Validation: Must have at least Study Title to create a draft
        if (!currentData.administrative?.studyTitle?.trim()) {
            const errorMsg = "Study Title is required to save a draft";
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        try {
            const res = await api.post("/proposals/draft", {
                ...currentData,
                status: "draft",
            });

            const newId = res.data._id;
            setProposalId(newId);

            if (shouldRedirect) {
                navigate(`/proposals/${newId}`, { replace: true });
            }

            return newId;
        } catch (err) {
            // If it's our own validation error, it's already toasted/handled
            if (err.message !== "Study Title is required to save a draft") {
                toast.error("Failed to create draft");
                console.error("Draft creation error:", err);
            }
            throw err;
        }
    };

    const saveOrUpdateDraft = async (shouldRedirect = false) => {
        try {
            // Trigger partial validation for studyTitle if it's not set
            const title = getValues("administrative.studyTitle");
            if (!title) {
                toast.error("Study Title is required");
                return false;
            }

            const data = getValues();
            const id = await ensureProposalId(shouldRedirect);

            await api.put(`/proposals/${id}`, data);
            toast.success(shouldRedirect ? "Draft saved & returning to dashboard" : "Draft auto-saved");
            return true;
        } catch (err) {
            // Validation errors are handled in ensureProposalId with toasts
            if (err.message !== "Study Title is required to save a draft") {
                console.error("Save error:", err);
            }
            return false;
        }
    };

    const handleFileUpload = async (e, fieldPath) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== "application/pdf") return toast.error("Only PDF allowed");

        try {
            const realId = await ensureProposalId();

            const formData = new FormData();
            formData.append("file", file);
            formData.append("field", fieldPath);

            const res = await api.post(`/proposals/${realId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setValue(fieldPath, res.data.fileUrl);
            toast.success("PDF uploaded as base64");
        } catch (err) {
            toast.error("Upload failed");
        }
    };

    const nextStep = async () => {
        const saved = await saveOrUpdateDraft(false);

        if (saved && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinalSubmit = () => {
        handleSubmit(
            async (data) => {
                try {
                    const realId = await ensureProposalId();
                    await api.post(`/proposals/${realId}/submit`);
                    toast.success("Proposal submitted successfully!");
                    navigate("/dashboard");
                } catch (err) {
                    toast.error("Submission failed - server error");
                }
            },
            (errors) => {
                toast.error("Please fix the highlighted errors before submitting", {
                    description: "Check the red messages in the form"
                });

                const firstError = Object.keys(errors)[0];
                if (firstError) {
                    const element = document.querySelector(`[name^="${firstError}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        element.focus();
                    }
                }
            }
        )();
    };

    const StepComponent = steps[currentStep].component;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
                {proposalId ? "Edit Proposal" : "New Proposal Submission"}
            </h1>

            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />

            {/* Revision Info Banner */}
            {proposalData?.status === "revision_required" && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 text-orange-800">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-bold text-lg">Revision Required</span>
                    </div>
                    <p className="text-orange-700 text-sm">
                        The reviewer has requested changes to your proposal. Please review the feedback below and update the necessary fields before resubmitting.
                    </p>

                    <div className="mt-4 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">Latest Feedback:</span>
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-md border border-orange-100 shadow-sm">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="h-4 w-4 text-orange-400 mt-1" />
                                <div>
                                    <p className="text-slate-800 text-sm italic">
                                        "{proposalData.comments?.[proposalData.comments.length - 1]?.text || "No specific comments provided."}"
                                    </p>
                                    <span className="text-[10px] text-slate-400 mt-2 block">
                                        — Feedback from {proposalData.comments?.[proposalData.comments.length - 1]?.reviewer?.name || "Reviewer"}
                                        on {new Date(proposalData.comments?.[proposalData.comments.length - 1]?.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
                {steps.map((s, i) => (
                    <Button
                        key={i}
                        variant={i === currentStep ? "default" : "outline"}
                        onClick={() => setCurrentStep(i)}
                        className="text-sm"
                    >
                        {s.title}
                    </Button>
                ))}
            </div>

            <FormProvider {...methods}>
                <StepComponent
                    step={steps[currentStep].stepNum}
                    onFileUpload={handleFileUpload}
                />
            </FormProvider>

            <div className="flex justify-between mt-8 gap-4 flex-wrap">
                <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
                    Previous
                </Button>

                {/* Save Draft with Confirmation Popup */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">Save Draft</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Save Draft & Exit?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will save your current progress as a draft and return you to the dashboard. You can continue editing later from "My Proposals".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    await saveOrUpdateDraft(true);
                                    navigate("/dashboard");
                                }}
                            >
                                Confirm & Exit
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Next / Submit Button */}
                {currentStep === steps.length - 1 ? (
                    <Button
                        onClick={handleFinalSubmit}
                        className={`${proposalData?.status === "revision_required" ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"} text-white px-8`}
                    >
                        {proposalData?.status === "revision_required" ? "Resubmit Proposal" : "Submit Proposal"}
                    </Button>
                ) : (
                    <Button onClick={nextStep} className="px-8">
                        Next
                    </Button>
                )}
            </div>

            {currentStep === steps.length - 1 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                    Please review all information before final submission
                </p>
            )}
        </div>
    );
}