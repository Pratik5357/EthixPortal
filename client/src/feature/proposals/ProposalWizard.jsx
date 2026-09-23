import { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalSchema } from "@/schemas/proposalSchema";
import {
    AdministrativeForm,
    ResearchForm,
    ParticipantForm,
    ConsentDataForm,
    DeclarationForm,
} from "./forms/Forms";
import ProposalSectionNav from "./ProposalSectionNav";
import api from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getProposalProgressSummary } from "@/lib/proposalProgress";
import PageHeader from "@/components/common/PageHeader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

function todayDateInputValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const steps = [
    {
        title: "Administrative details",
        short: "Administration",
        description: "Institution, IEC committee, and study identification",
        component: AdministrativeForm,
        stepNum: 1,
        sectionId: "administrative",
    },
    {
        title: "Investigator information",
        short: "Investigators",
        description: "Principal investigator and co-investigator details",
        component: AdministrativeForm,
        stepNum: 2,
        sectionId: "investigator",
    },
    {
        title: "Research details",
        short: "Research",
        description: "Study design, sites, funding, and conflicts",
        component: ResearchForm,
        sectionId: "research",
    },
    {
        title: "Participant information",
        short: "Participants",
        description: "Recruitment, criteria, risks, and privacy",
        component: ParticipantForm,
        sectionId: "participant",
    },
    {
        title: "Consent and data",
        short: "Consent",
        description: "Informed consent process and data management",
        component: ConsentDataForm,
        sectionId: "consent",
    },
    {
        title: "Declaration",
        short: "Declaration",
        description: "Investigator attestation and signed declaration",
        component: DeclarationForm,
        sectionId: "declaration",
    },
];

export default function ProposalWizard() {
    const { id: urlProposalId } = useParams();
    const navigate = useNavigate();

    const [proposalId, setProposalId] = useState(urlProposalId || null);
    const [proposalData, setProposalData] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [saveState, setSaveState] = useState("idle");

    const methods = useForm({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            administrative: {
                reviewType: "",
                organization: "",
                iecName: "",
                dateOfSubmission: todayDateInputValue(),
                studyTitle: "",
                coInvestigators: [],
                principalInvestigator: {
                    name: "",
                    designation: "",
                    qualification: "",
                    department: "",
                    institution: "",
                    contact: "",
                    cvFile: "",
                },
            },
            research: {
                studyType: [],
                studyDesign: "",
                studySites: "",
                fundingSource: "",
                siteDetails: [],
                conflictOfInterest: false,
                insuranceCoverage: false,
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
                agree: false,
                signatureFile: "",
            },
        },
    });

    const { handleSubmit, setValue, getValues, reset, control } = methods;
    const formValues = useWatch({ control });
    const progress = getProposalProgressSummary(formValues);
    const studyTitle = formValues?.administrative?.studyTitle?.trim() || "";

    useEffect(() => {
        if (urlProposalId) {
            api
                .get(`/proposals/${urlProposalId}`)
                .then((res) => {
                    if (res.data.administrative?.dateOfSubmission) {
                        res.data.administrative.dateOfSubmission =
                            res.data.administrative.dateOfSubmission.split("T")[0];
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

        if (!currentData.administrative?.studyTitle?.trim()) {
            const errorMsg = "Study title is required to save a draft";
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
            if (err.message !== "Study title is required to save a draft") {
                toast.error("Failed to create draft");
                console.error("Draft creation error:", err);
            }
            throw err;
        }
    };

    const saveOrUpdateDraft = async (shouldRedirect = false, quiet = false) => {
        try {
            const title = getValues("administrative.studyTitle");
            if (!title?.trim()) {
                if (!quiet) toast.error("Add a study title in Administration before saving");
                return false;
            }

            setSaveState("saving");
            const data = getValues();
            const id = await ensureProposalId(shouldRedirect);

            await api.put(`/proposals/${id}`, data);
            setSaveState("saved");
            if (!quiet) {
                toast.success(
                    shouldRedirect ? "Draft saved — returning to dashboard" : "Draft saved"
                );
            }
            return true;
        } catch (err) {
            setSaveState("idle");
            if (err.message !== "Study title is required to save a draft") {
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

            setValue(fieldPath, res.data.fileUrl, {
                shouldDirty: true,
                shouldValidate: true,
            });
            toast.success("Document uploaded");
        } catch {
            toast.error("Upload failed");
        }
    };

    const goToStep = (index) => {
        if (index < 0 || index >= steps.length || index === currentStep) return;

        if (studyTitle) {
            saveOrUpdateDraft(false, true);
        }

        setCurrentStep(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            goToStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    const handleFinalSubmit = () => {
        handleSubmit(
            async (data) => {
                try {
                    const realId = await ensureProposalId();
                    await api.put(`/proposals/${realId}`, data);
                    const isResubmit = proposalData?.status === "revision_required";
                    const endpoint = isResubmit
                        ? `/proposals/${realId}/resubmit`
                        : `/proposals/${realId}/submit`;
                    await api.post(endpoint);
                    toast.success(
                        isResubmit
                            ? "Proposal resubmitted for review"
                            : "Proposal submitted successfully"
                    );
                    navigate("/dashboard");
                } catch (err) {
                    toast.error(
                        err.response?.data?.message || "Submission failed — please try again"
                    );
                }
            },
            (errors) => {
                toast.error("Complete all required sections before submitting", {
                    description: "Check each section for highlighted errors",
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
    const latestComment = proposalData?.comments?.[proposalData.comments.length - 1];
    const activeStep = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const saveStatusLabel =
        saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "All changes saved"
              : studyTitle
                ? "Changes not yet saved"
                : "Add a study title to enable saving";

    return (
        <div className="proposal-workspace page-section">
            <PageHeader
                title={proposalId ? "Edit proposal" : "New proposal"}
                description="Work through each section in any order. Required fields are marked; optional fields can be completed later."
                actions={
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                Save and exit
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Save draft and exit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Your progress is saved to My Proposals. You can return and
                                    continue from any section.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        const saved = await saveOrUpdateDraft(true);
                                        if (saved) navigate("/dashboard");
                                    }}
                                >
                                    Save and exit
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                }
            />

            {proposalData?.status === "revision_required" && (
                <div className="surface-card proposal-revision-banner">
                    <div className="flex items-center gap-2 text-stamp">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="font-display text-lg font-semibold">Revision required</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Update the sections noted in reviewer feedback, then resubmit from the
                        Declaration section.
                    </p>

                    <div className="mt-4 space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Latest feedback
                        </span>
                        <div className="rounded-lg border border-border bg-background/80 p-4">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0">
                                    <p className="text-sm italic leading-relaxed text-foreground/90">
                                        &ldquo;{latestComment?.text || "No specific comments provided."}&rdquo;
                                    </p>
                                    <span className="mt-2 block text-[0.6875rem] text-muted-foreground">
                                        — {latestComment?.reviewer?.name || "Reviewer"}
                                        {latestComment?.createdAt
                                            ? ` · ${new Date(latestComment.createdAt).toLocaleDateString()}`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="proposal-workspace__mobile-nav lg:hidden">
                <label className="sr-only" htmlFor="proposal-section-select">
                    Jump to section
                </label>
                <Select
                    value={String(currentStep)}
                    onValueChange={(value) => goToStep(Number(value))}
                >
                    <SelectTrigger id="proposal-section-select" className="w-full">
                        <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                        {steps.map((step, index) => (
                            <SelectItem key={step.sectionId} value={String(index)}>
                                {step.short}
                                {progress.sectionComplete[step.sectionId] ? " ✓" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="proposal-workspace__grid">
                <aside className="proposal-workspace__aside hidden lg:block">
                    <div className="surface-card proposal-workspace__nav-card">
                        <ProposalSectionNav
                            steps={steps}
                            currentStep={currentStep}
                            progress={progress}
                            studyTitle={studyTitle}
                            onSelectStep={goToStep}
                        />
                    </div>
                </aside>

                <div className="proposal-workspace__main">
                    <div className="surface-card proposal-workspace__editor">
                        <header className="proposal-workspace__section-header">
                            <p className="proposal-workspace__section-index">
                                Section {currentStep + 1} of {steps.length}
                            </p>
                            <h2 className="proposal-workspace__section-title">{activeStep.title}</h2>
                            <p className="proposal-workspace__section-desc">{activeStep.description}</p>
                        </header>

                        <div className="proposal-workspace__form">
                            <FormProvider {...methods}>
                                <StepComponent
                                    step={activeStep.stepNum}
                                    hideTitle
                                    onFileUpload={handleFileUpload}
                                />
                            </FormProvider>
                        </div>
                    </div>

                    <footer className="proposal-workspace__footer surface-card">
                        <div className="proposal-workspace__footer-meta">
                            <span
                                className={cn(
                                    "proposal-workspace__save-status",
                                    saveState === "saving" && "proposal-workspace__save-status--saving"
                                )}
                            >
                                {saveState === "saving" && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                )}
                                {saveStatusLabel}
                            </span>
                        </div>

                        <div className="proposal-workspace__footer-actions">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                                Previous
                            </Button>

                            {isLastStep ? (
                                <Button type="button" onClick={handleFinalSubmit} className="min-w-[9.5rem]">
                                    {proposalData?.status === "revision_required"
                                        ? "Resubmit proposal"
                                        : "Submit proposal"}
                                </Button>
                            ) : (
                                <Button type="button" onClick={nextStep} className="min-w-[9.5rem]">
                                    Next section
                                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
