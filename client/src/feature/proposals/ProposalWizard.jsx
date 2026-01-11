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
    const [currentStep, setCurrentStep] = useState(0);

    const methods = useForm({
        resolver: zodResolver(proposalSchema),
        defaultValues: {},
    });

    const { handleSubmit, setValue, getValues, reset } = methods;

    useEffect(() => {
        if (urlProposalId) {
            api
                .get(`/proposals/${urlProposalId}`)
                .then((res) => {
                    reset(res.data);
                    setProposalId(res.data._id);
                })
                .catch(() => toast.error("Failed to load proposal"));
        }
    }, [urlProposalId, reset]);

    const ensureProposalId = async (shouldRedirect = false) => {
        if (proposalId) return proposalId;

        try {
            const currentData = getValues();
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
            toast.error("Failed to create draft");
            console.error("Draft creation error:", err);
            throw err;
        }
    };

    const saveOrUpdateDraft = async (shouldRedirect = false) => {
        try {
            const data = getValues();
            const id = await ensureProposalId(shouldRedirect);

            await api.put(`/proposals/${id}`, data);
            toast.success(shouldRedirect ? "Draft saved & returning to dashboard" : "Draft auto-saved");
        } catch (err) {
            toast.error("Failed to save draft");
            console.error("Save error:", err);
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
        await saveOrUpdateDraft(false);

        if (currentStep < steps.length - 1) {
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
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        Submit Proposal
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