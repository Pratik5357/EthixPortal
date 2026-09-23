// src/feature/proposals/forms/Forms.jsx
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FormFieldLabel } from "./FormFieldLabel";

const AdministrativeForm = ({ step, onFileUpload, readOnly, hideTitle = false }) => {
    const { register, control, formState: { errors }, getValues } = useFormContext();

    const { fields: coInvestigators, append: addCoInvestigator, remove: removeCoInvestigator } = useFieldArray({
        control,
        name: "administrative.coInvestigators",
    });

    return (
        <div className="space-y-8">
            {!hideTitle && (
                <h3 className="form-section-title">
                    {step === 1 ? "Administrative Details" : "Investigator Information"}
                </h3>
            )}

            {/* Step 1 - Administrative Details */}
            {step === 1 && (
                <div className="form-field-grid">
                    <div>
                        <FormFieldLabel required>Organization / institution name</FormFieldLabel>
                        <Input {...register("administrative.organization")} placeholder={readOnly ? "" : "Enter organization name"} className={readOnly ? "form-readonly" : ""} />
                        {errors.administrative?.organization && <p className="form-error">{errors.administrative.organization.message}</p>}
                    </div>

                    <div>
                        <FormFieldLabel required>IEC / IRB name</FormFieldLabel>
                        <Input {...register("administrative.iecName")} placeholder={readOnly ? "" : "Enter IEC name"} className={readOnly ? "form-readonly" : ""} />
                        {errors.administrative?.iecName && <p className="form-error">{errors.administrative.iecName.message}</p>}
                    </div>

                    <div>
                        <FormFieldLabel required>Date of submission</FormFieldLabel>
                        <Input type="date" {...register("administrative.dateOfSubmission")} className={readOnly ? "form-readonly" : ""} />
                        {errors.administrative?.dateOfSubmission && <p className="form-error">{errors.administrative.dateOfSubmission.message}</p>}
                    </div>

                    <div>
                        <FormFieldLabel required>Type of review</FormFieldLabel>
                        <Controller
                            name="administrative.reviewType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                                    <SelectTrigger className={readOnly ? "form-readonly" : ""}><SelectValue placeholder="Select review type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Exemption">Exemption from review</SelectItem>
                                        <SelectItem value="Expedited">Expedited review</SelectItem>
                                        <SelectItem value="Full Committee">Full committee review</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.administrative?.reviewType && <p className="form-error">{errors.administrative.reviewType.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <FormFieldLabel required>Full study title</FormFieldLabel>
                        <Textarea {...register("administrative.studyTitle")} rows={3} placeholder={readOnly ? "" : "Enter complete study title"} className={readOnly ? "form-readonly" : ""} />
                        {errors.administrative?.studyTitle && <p className="form-error">{errors.administrative.studyTitle.message}</p>}
                    </div>

                    <div>
                        <FormFieldLabel>Short title or acronym</FormFieldLabel>
                        <Input {...register("administrative.shortTitle")} placeholder={readOnly ? "" : "Optional short title"} className={readOnly ? "form-readonly" : ""} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FormFieldLabel>Protocol number</FormFieldLabel>
                            <Input {...register("administrative.protocolNumber")} placeholder={readOnly ? "" : "Enter protocol number"} className={readOnly ? "form-readonly" : ""} />
                        </div>
                        <div>
                            <FormFieldLabel>Protocol version</FormFieldLabel>
                            <Input {...register("administrative.protocolVersion")} placeholder={readOnly ? "" : "Enter protocol version"} className={readOnly ? "form-readonly" : ""} />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2 - Investigator Information */}
            {step === 2 && (
                <div className="space-y-8">
                    <div className="form-subsection">
                        <h4 className="form-subsection-title">Principal investigator</h4>
                        <div className="form-field-grid">
                            <div>
                                <FormFieldLabel required>Full name</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.name")} placeholder="Full name" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div>
                                <FormFieldLabel required>Designation</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.designation")} placeholder="Designation" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div>
                                <FormFieldLabel required>Qualification</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.qualification")} placeholder="Qualification" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div>
                                <FormFieldLabel required>Department</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.department")} placeholder="Department" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div>
                                <FormFieldLabel required>Institution</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.institution")} placeholder="Institution" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div>
                                <FormFieldLabel required>Contact number</FormFieldLabel>
                                <Input {...register("administrative.principalInvestigator.contact")} placeholder="Contact number" className={readOnly ? "form-readonly" : ""} />
                            </div>
                            <div className="md:col-span-2">
                                <FormFieldLabel hint="Upload a PDF before final submission">Curriculum vitae (CV)</FormFieldLabel>
                                {!readOnly && (
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        multiple={false}
                                        onChange={(e) => onFileUpload(e, "administrative.principalInvestigator.cvFile")}
                                    />
                                )}
                                {getValues("administrative.principalInvestigator.cvFile") && (
                                    <div className="form-upload-success text-xs mt-1 flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            ✓ CV Uploaded
                                        </div>
                                        {readOnly && (
                                            <a
                                                href={getValues("administrative.principalInvestigator.cvFile")}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="form-link inline-flex items-center gap-1"
                                            >
                                                View PDF
                                            </a>
                                        )}
                                    </div>
                                )}
                                {!getValues("administrative.principalInvestigator.cvFile") && readOnly && (
                                    <span className="text-sm italic text-muted-foreground">No CV uploaded</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Co-Investigators */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="form-subsection-title mb-0">Co-investigators</h4>
                                <p className="mt-1 text-xs text-muted-foreground">Optional — add only if others are involved in the study.</p>
                            </div>
                            {!readOnly && (
                                <Button type="button" size="sm" onClick={() => addCoInvestigator({ name: "", designation: "", qualification: "", department: "", institution: "", contact: "", cvFile: "" })}>
                                    + Add Co-Investigator
                                </Button>
                            )}
                        </div>

                        {coInvestigators.length === 0 && readOnly && (
                            <p className="text-sm italic text-muted-foreground">No Co-Investigators listed.</p>
                        )}

                        {coInvestigators.map((field, index) => (
                            <div key={field.id} className="form-subsection relative mb-6">
                                {!readOnly && (
                                    <Button type="button" variant="ghost" size="sm" className="absolute top-4 right-4 text-destructive" onClick={() => removeCoInvestigator(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <div className="form-field-grid">
                                    <div><FormFieldLabel required>Name</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.name`)} placeholder="Full name" className={readOnly ? "bg-card" : ""} /></div>
                                    <div><FormFieldLabel required>Designation</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.designation`)} placeholder="Designation" className={readOnly ? "bg-card" : ""} /></div>
                                    <div><FormFieldLabel required>Qualification</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.qualification`)} placeholder="Qualification" className={readOnly ? "bg-card" : ""} /></div>
                                    <div><FormFieldLabel required>Department</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.department`)} placeholder="Department" className={readOnly ? "bg-card" : ""} /></div>
                                    <div><FormFieldLabel required>Institution</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.institution`)} placeholder="Institution" className={readOnly ? "bg-card" : ""} /></div>
                                    <div><FormFieldLabel required>Contact number</FormFieldLabel><Input {...register(`administrative.coInvestigators.${index}.contact`)} placeholder="Contact number" className={readOnly ? "bg-card" : ""} /></div>
                                    <div className="md:col-span-2">
                                        <FormFieldLabel>CV</FormFieldLabel>
                                        {!readOnly && <Input type="file" accept=".pdf,.doc,.docx" multiple={false} onChange={(e) => onFileUpload(e, `administrative.coInvestigators.${index}.cvFile`)} />}
                                        {getValues(`administrative.coInvestigators.${index}.cvFile`) ?
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="form-upload-success text-xs font-medium">✓ CV uploaded</span>
                                                {readOnly && (
                                                    <a
                                                        href={getValues(`administrative.coInvestigators.${index}.cvFile`)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="form-link"
                                                    >
                                                        View PDF
                                                    </a>
                                                )}
                                            </div> :
                                            (readOnly && <span className="text-sm italic text-muted-foreground">No CV uploaded</span>)
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ResearchForm = ({ onFileUpload, readOnly, hideTitle = false }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    const { fields: siteDetails, append: addSite, remove: removeSite } = useFieldArray({
        control,
        name: "research.siteDetails",
    });

    const studySites = watch("research.studySites");

    return (
        <div className="space-y-8">
            {!hideTitle && <h3 className="form-section-title">Research Details</h3>}

            {/* Study Type - Multi-checkbox */}
            <div>
                <FormFieldLabel required className="mb-2">Study type</FormFieldLabel>
                <div className="form-checkbox-grid">
                    {["Basic", "Applied", "Clinical", "Epidemiological", "Qualitative", "Others"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Controller
                                name="research.studyType"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value?.includes(type) || false}
                                        disabled={readOnly}
                                        onCheckedChange={(checked) => {
                                            const updated = checked
                                                ? [...(field.value || []), type]
                                                : (field.value || []).filter(t => t !== type);
                                            field.onChange(updated);
                                        }}
                                        id={`studyType-${type}`}
                                    />
                                )}
                            />
                            <Label htmlFor={`studyType-${type}`} className="text-sm cursor-pointer">{type}</Label>
                        </div>
                    ))}
                </div>
                {errors.research?.studyType && <p className="form-error">{errors.research.studyType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <FormFieldLabel required>Study design</FormFieldLabel>
                    <Controller
                        name="research.studyDesign"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                                <SelectTrigger className={readOnly ? "form-readonly" : ""}><SelectValue placeholder="Select design" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="interventional">Interventional</SelectItem>
                                    <SelectItem value="observational">Observational</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.research?.studyDesign && <p className="form-error">{errors.research.studyDesign.message}</p>}
                </div>

                <div>
                    <FormFieldLabel required>Study duration (months)</FormFieldLabel>
                    <Input type="number" {...register("research.studyDuration", { valueAsNumber: true })} min="1" placeholder={readOnly ? "" : "Enter duration"} className={readOnly ? "form-readonly" : ""} />
                    {errors.research?.studyDuration && <p className="form-error">{errors.research.studyDuration.message}</p>}
                </div>

                <div>
                    <FormFieldLabel required>Number of study sites</FormFieldLabel>
                    <Controller
                        name="research.studySites"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                                <SelectTrigger className={readOnly ? "form-readonly" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Single-center</SelectItem>
                                    <SelectItem value="multi">Multi-center</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.research?.studySites && <p className="form-error">{errors.research.studySites.message}</p>}
                </div>
            </div>

            {/* Multi-center site details */}
            {studySites === "multi" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="form-subsection-title mb-0">Study Site Details</h4>
                        {!readOnly && (
                            <Button type="button" size="sm" onClick={() => addSite({ name: "", piName: "", expectedParticipants: "" })}>
                                + Add Site
                            </Button>
                        )}
                    </div>

                    {siteDetails.length === 0 && readOnly && <p className="text-sm italic text-muted-foreground">No additional sites listed.</p>}

                    {siteDetails.map((field, index) => (
                        <div key={field.id} className="form-subsection relative p-5">
                            {!readOnly && (
                                <Button type="button" variant="ghost" size="sm" className="absolute top-3 right-3 text-destructive" onClick={() => removeSite(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <FormFieldLabel required>Site name</FormFieldLabel>
                                    <Input {...register(`research.siteDetails.${index}.name`)} placeholder="Site name" className={readOnly ? "bg-card" : ""} />
                                </div>
                                <div>
                                    <FormFieldLabel required>PI name at site</FormFieldLabel>
                                    <Input {...register(`research.siteDetails.${index}.piName`)} placeholder="Principal Investigator" className={readOnly ? "bg-card" : ""} />
                                </div>
                                <div>
                                    <FormFieldLabel required>Expected participants</FormFieldLabel>
                                    <Input type="number" {...register(`research.siteDetails.${index}.expectedParticipants`, { valueAsNumber: true })} min="0" className={readOnly ? "bg-card" : ""} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Funding Source */}
            <div>
                <FormFieldLabel required>Funding source</FormFieldLabel>
                <Controller
                    name="research.fundingSource"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "form-readonly" : ""}><SelectValue placeholder="Select funding source" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="self">Self-funded</SelectItem>
                                <SelectItem value="govt">Government</SelectItem>
                                <SelectItem value="industry">Industry/Sponsor</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.research?.fundingSource && <p className="form-error">{errors.research.fundingSource.message}</p>}
            </div>

            {/* Sponsor / CRO Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <FormFieldLabel>Sponsor details</FormFieldLabel>
                    <Input {...register("research.sponsorDetails")} placeholder={readOnly ? "" : "Sponsor name / organization"} className={readOnly ? "form-readonly" : ""} />
                </div>
                <div>
                    <FormFieldLabel>CRO details</FormFieldLabel>
                    <Input {...register("research.croDetails")} placeholder={readOnly ? "" : "Contract Research Organization"} className={readOnly ? "form-readonly" : ""} />
                </div>
            </div>

            {/* Conflict of Interest */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="research.conflictOfInterest"
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id="conflict" disabled={readOnly} />}
                    />
                    <Label htmlFor="conflict" className="cursor-pointer text-sm font-medium">
                        A conflict of interest exists
                    </Label>
                </div>

                {watch("research.conflictOfInterest") && (
                    <div>
                        <FormFieldLabel required>Details of conflict</FormFieldLabel>
                        <Textarea {...register("research.conflictDetails")} rows={3} placeholder={readOnly ? "" : "Describe any conflict of interest"} className={readOnly ? "form-readonly" : ""} />
                    </div>
                )}
            </div>

            {/* Insurance Coverage */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="research.insuranceCoverage"
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id="insurance" disabled={readOnly} />}
                    />
                    <Label htmlFor="insurance" className="cursor-pointer text-sm font-medium">
                        Insurance coverage is available for participants
                    </Label>
                </div>

                {watch("research.insuranceCoverage") && (
                    <div>
                        <FormFieldLabel required>Insurance details</FormFieldLabel>
                        <Textarea {...register("research.insuranceDetails")} rows={3} placeholder={readOnly ? "" : "Describe insurance coverage details"} className={readOnly ? "form-readonly" : ""} />
                    </div>
                )}
            </div>
        </div>
    );
};


const ParticipantForm = ({ onFileUpload, readOnly, hideTitle = false }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    const vulnerableGroupsOptions = [
        "Children",
        "Pregnant women",
        "Prisoners",
        "Elderly",
        "Mentally challenged",
        "Economically/socially disadvantaged",
        "Tribal populations",
        "Others"
    ];

    return (
        <div className="space-y-8">
            {!hideTitle && <h3 className="form-section-title">Participant Information</h3>}

            {/* Basic Counts & Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <FormFieldLabel required>Total number of participants</FormFieldLabel>
                    <Input
                        type="number"
                        {...register("participant.participantCount", { valueAsNumber: true })}
                        min="1"
                        placeholder="Enter total expected participants"
                    />
                    {errors.participant?.participantCount && (
                        <p className="form-error">
                            {errors.participant.participantCount.message}
                        </p>
                    )}
                </div>

                <div>
                    <FormFieldLabel required>Recruitment method</FormFieldLabel>
                    <Input
                        {...register("participant.recruitmentMethod")}
                        placeholder="e.g., Hospital database, advertisements, referrals"
                    />
                    {errors.participant?.recruitmentMethod && (
                        <p className="form-error">
                            {errors.participant.recruitmentMethod.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Vulnerable Groups - Multi-checkbox */}
            <div>
                <FormFieldLabel className="mb-2">Vulnerable groups</FormFieldLabel>
                <div className="form-checkbox-grid">
                    {vulnerableGroupsOptions.map((group) => (
                        <div key={group} className="flex items-center space-x-2">
                            <Controller
                                name="participant.vulnerableGroups"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value?.includes(group) || false}
                                        disabled={readOnly}
                                        onCheckedChange={(checked) => {
                                            const updated = checked
                                                ? [...(field.value || []), group]
                                                : (field.value || []).filter((g) => g !== group);
                                            field.onChange(updated);
                                        }}
                                        id={`vuln-${group.replace(/\s+/g, '-')}`}
                                    />
                                )}
                            />
                            <Label
                                htmlFor={`vuln-${group.replace(/\s+/g, '-')}`}
                                className="text-sm cursor-pointer"
                            >
                                {group}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inclusion & Exclusion Criteria */}
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <FormFieldLabel required>Inclusion criteria</FormFieldLabel>
                    <Textarea
                        {...register("participant.inclusionCriteria")}
                        rows={4}
                        placeholder="Describe who will be included (e.g., age range, diagnosis, etc.)"
                    />
                    {errors.participant?.inclusionCriteria && (
                        <p className="form-error">
                            {errors.participant.inclusionCriteria.message}
                        </p>
                    )}
                </div>

                <div>
                    <FormFieldLabel required>Exclusion criteria</FormFieldLabel>
                    <Textarea
                        {...register("participant.exclusionCriteria")}
                        rows={4}
                        placeholder="Describe who will be excluded (e.g., comorbidities, pregnancy, etc.)"
                    />
                    {errors.participant?.exclusionCriteria && (
                        <p className="form-error">
                            {errors.participant.exclusionCriteria.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Risk, Benefit & Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <FormFieldLabel required>Risk assessment</FormFieldLabel>
                    <Controller
                        name="participant.riskAssessment"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minimal">Minimal</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.participant?.riskAssessment && (
                        <p className="form-error">
                            {errors.participant.riskAssessment.message}
                        </p>
                    )}
                </div>

                <div>
                    <FormFieldLabel required>Benefit assessment</FormFieldLabel>
                    <Controller
                        name="participant.benefitAssessment"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select benefit type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="direct">Direct</SelectItem>
                                    <SelectItem value="indirect">Indirect</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.participant?.benefitAssessment && (
                        <p className="form-error">
                            {errors.participant.benefitAssessment.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <FormFieldLabel required>Privacy and confidentiality measures</FormFieldLabel>
                <Textarea
                    {...register("participant.privacyMeasures")}
                    rows={3}
                    placeholder="Describe how participant data will be protected (anonymization, encryption, access control, etc.)"
                />
                {errors.participant?.privacyMeasures && (
                    <p className="form-error">
                        {errors.participant.privacyMeasures.message}
                    </p>
                )}
            </div>

            {/* Optional: Intervention Details */}
            <div>
                <FormFieldLabel>Intervention or procedure details</FormFieldLabel>
                <Textarea
                    {...register("participant.interventionDetails")}
                    rows={3}
                    placeholder="Describe any interventions, procedures, or tests participants will undergo"
                />
            </div>
        </div>
    );
};

const ConsentDataForm = ({ onFileUpload, readOnly, hideTitle = false }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    return (
        <div className="space-y-8">
            {!hideTitle && (
                <h3 className="form-section-title">Informed Consent & Data Management</h3>
            )}

            {/* Waiver Request */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="consentData.waiverRequest"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="waiver"
                                disabled={readOnly}
                            />
                        )}
                    />
                    <Label htmlFor="waiver" className="cursor-pointer text-sm font-medium">
                        Requesting waiver of informed consent
                    </Label>
                </div>

                {watch("consentData.waiverRequest") && (
                    <div>
                        <FormFieldLabel required>Justification for waiver</FormFieldLabel>
                        <Textarea
                            {...register("consentData.waiverJustification")}
                            rows={3}
                            placeholder={readOnly ? "" : "Explain why consent waiver is needed"}
                            className={readOnly ? "form-readonly" : ""}
                        />
                        {errors.consentData?.waiverJustification && (
                            <p className="form-error">
                                {errors.consentData.waiverJustification.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Consent Process */}
            {!watch("consentData.waiverRequest") && (
                <div className="space-y-6">
                    <div>
                        <FormFieldLabel required>Consent process description</FormFieldLabel>
                        <Textarea
                            {...register("consentData.consentProcess")}
                            rows={4}
                            placeholder={readOnly ? "" : "Describe who will obtain consent, where, and how"}
                            className={readOnly ? "form-readonly" : ""}
                        />
                        {errors.consentData?.consentProcess && (
                            <p className="form-error">
                                {errors.consentData.consentProcess.message}
                            </p>
                        )}
                    </div>

                    <div className="form-field-grid">
                        <div>
                            <FormFieldLabel>Consent form (English)</FormFieldLabel>
                            {!readOnly && (
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple={false}
                                    onChange={(e) => onFileUpload(e, "consentData.consentFormEnglish")}
                                />
                            )}
                            {watch("consentData.consentFormEnglish") ? (
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="form-upload-success text-xs font-medium">✓ English form uploaded</span>
                                    {readOnly && (
                                        <a
                                            href={watch("consentData.consentFormEnglish")}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="form-link"
                                        >
                                            View PDF
                                        </a>
                                    )}
                                </div>
                            ) : (
                                readOnly && <span className="text-sm italic text-muted-foreground">No file uploaded</span>
                            )}
                        </div>
                        <div>
                            <FormFieldLabel>Consent form (local language)</FormFieldLabel>
                            {!readOnly && (
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple={false}
                                    onChange={(e) => onFileUpload(e, "consentData.consentFormLocal")}
                                />
                            )}
                            {watch("consentData.consentFormLocal") ? (
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="form-upload-success text-xs font-medium">✓ Local form uploaded</span>
                                    {readOnly && (
                                        <a
                                            href={watch("consentData.consentFormLocal")}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="form-link"
                                        >
                                            View PDF
                                        </a>
                                    )}
                                </div>
                            ) : (
                                readOnly && <span className="text-sm italic text-muted-foreground">No file uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AV Recording */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="consentData.avRecording"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="av"
                                disabled={readOnly}
                            />
                        )}
                    />
                    <Label htmlFor="av" className="text-sm font-medium cursor-pointer">
                        Audiovisual Recording Required
                    </Label>
                </div>

                {watch("consentData.avRecording") && (
                    <div>
                        <FormFieldLabel required>Justification for AV recording</FormFieldLabel>
                        <Textarea
                            {...register("consentData.avJustification")}
                            rows={3}
                            placeholder={readOnly ? "" : "Explain why AV recording is necessary"}
                            className={readOnly ? "form-readonly" : ""}
                        />
                    </div>
                )}
            </div>

            {/* Data Management */}
            <div>
                <FormFieldLabel required>Data sharing plan</FormFieldLabel>
                <Controller
                    name="consentData.dataSharing"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "form-readonly" : ""}>
                                <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No sharing</SelectItem>
                                <SelectItem value="anonymized">Anonymized sharing</SelectItem>
                                <SelectItem value="full">Full sharing (with consent)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.consentData?.dataSharing && (
                    <p className="form-error">
                        {errors.consentData.dataSharing.message}
                    </p>
                )}
            </div>

            <div>
                <FormFieldLabel>Biological sample storage</FormFieldLabel>
                <Controller
                    name="consentData.sampleStorage"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "form-readonly" : ""}>
                                <SelectValue placeholder="Select storage plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">samples destroyed after study</SelectItem>
                                <SelectItem value="short_term">Storage &lt; 5 years</SelectItem>
                                <SelectItem value="long_term">Storage &gt; 5 years</SelectItem>
                                <SelectItem value="biobank">Biobanking</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
};

const DeclarationForm = ({ onFileUpload, readOnly, hideTitle = false }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    return (
        <div className="space-y-8">
            {!hideTitle && <h3 className="form-section-title">Investigator&apos;s Declaration</h3>}

            <div className="form-subsection space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                    I hereby declare that:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>The information provided in this application is true and correct to the best of my knowledge.</li>
                    <li>I will conduct the study in accordance with the protocol and ethical guidelines (ICMR/GCP).</li>
                    <li>I will inform the IEC of any serious adverse events or protocol deviations immediately.</li>
                    <li>I will maintain confidentiality of study participants.</li>
                </ul>

                <div className="flex items-start space-x-3 mt-6">
                    <Controller
                        name="declaration.agree"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value === true}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                id="declare"
                                disabled={readOnly}
                            />
                        )}
                    />
                    <Label htmlFor="declare" className="mt-0.5 cursor-pointer text-sm font-medium leading-none">
                        I agree to the above terms and conditions
                        <span className="text-destructive"> *</span>
                    </Label>
                </div>
                {errors.declaration?.agree && (
                    <p className="form-error pl-7">
                        {errors.declaration.agree.message}
                    </p>
                )}
            </div>

            <div className="form-upload-zone">
                <FormFieldLabel required className="form-subsection-title mb-4 block text-center">
                    Signed declaration page
                </FormFieldLabel>
                {!readOnly && (
                    <Input
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple={false}
                        onChange={(e) => onFileUpload(e, "declaration.signatureFile")}
                        className="mx-auto max-w-xs"
                    />
                )}
                {watch("declaration.signatureFile") ? (
                    <div className="mt-3 flex flex-col items-center gap-2">
                        <span className="form-upload-success text-sm font-medium">Signed declaration uploaded</span>
                        {readOnly && (
                            <a
                                href={watch("declaration.signatureFile")}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-muted/60"
                            >
                                View / Download Document
                            </a>
                        )}
                    </div>
                ) : (
                    readOnly && <span className="text-sm italic text-muted-foreground">No signature file uploaded</span>
                )}
                {errors.declaration?.signatureFile && (
                    <p className="form-error text-sm">
                        {errors.declaration.signatureFile.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export { AdministrativeForm, ResearchForm, ParticipantForm, ConsentDataForm, DeclarationForm };