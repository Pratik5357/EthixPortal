// src/feature/proposals/forms/Forms.jsx
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AdministrativeForm = ({ step, onFileUpload }) => {
    const { register, control, formState: { errors }, getValues } = useFormContext();

    const { fields: coInvestigators, append: addCoInvestigator, remove: removeCoInvestigator } = useFieldArray({
        control,
        name: "administrative.coInvestigators",
    });

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">
                {step === 1 ? "Administrative Details" : "Investigator Information"}
            </h3>

            {/* Step 1 - Administrative Details */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Organization Name *</Label>
                        <Input {...register("administrative.organization")} placeholder="Enter organization name" />
                        {errors.administrative?.organization && <p className="text-red-500 text-xs mt-1">{errors.administrative.organization.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">IEC Name *</Label>
                        <Input {...register("administrative.iecName")} placeholder="Enter IEC name" />
                        {errors.administrative?.iecName && <p className="text-red-500 text-xs mt-1">{errors.administrative.iecName.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Date of Submission *</Label>
                        <Input type="date" {...register("administrative.dateOfSubmission")} />
                        {errors.administrative?.dateOfSubmission && <p className="text-red-500 text-xs mt-1">{errors.administrative.dateOfSubmission.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Type of Review *</Label>
                        <Controller
                            name="administrative.reviewType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select review type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Exemption">Exemption from review</SelectItem>
                                        <SelectItem value="Expedited">Expedited review</SelectItem>
                                        <SelectItem value="Full Committee">Full committee review</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.administrative?.reviewType && <p className="text-red-500 text-xs mt-1">{errors.administrative.reviewType.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Study Title *</Label>
                        <Textarea {...register("administrative.studyTitle")} rows={3} placeholder="Enter complete study title" />
                        {errors.administrative?.studyTitle && <p className="text-red-500 text-xs mt-1">{errors.administrative.studyTitle.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Short Title / Acronym</Label>
                        <Input {...register("administrative.shortTitle")} placeholder="Optional short title" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">Protocol Number</Label>
                            <Input {...register("administrative.protocolNumber")} placeholder="Enter protocol number" />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">Protocol Version</Label>
                            <Input {...register("administrative.protocolVersion")} placeholder="Enter protocol version" />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2 - Investigator Information */}
            {step === 2 && (
                <div className="space-y-8">
                    <div className="border rounded-lg p-6 bg-gray-50">
                        <h4 className="text-lg font-medium mb-4 text-gray-900">Principal Investigator *</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Name *</Label>
                                <Input {...register("administrative.principalInvestigator.name")} placeholder="Full name" />
                                {errors.administrative?.principalInvestigator?.name && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.name.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Designation *</Label>
                                <Input {...register("administrative.principalInvestigator.designation")} placeholder="Designation" />
                                {errors.administrative?.principalInvestigator?.designation && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.designation.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Qualification *</Label>
                                <Input {...register("administrative.principalInvestigator.qualification")} placeholder="Qualification" />
                                {errors.administrative?.principalInvestigator?.qualification && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.qualification.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Department *</Label>
                                <Input {...register("administrative.principalInvestigator.department")} placeholder="Department" />
                                {errors.administrative?.principalInvestigator?.department && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.department.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Institution *</Label>
                                <Input {...register("administrative.principalInvestigator.institution")} placeholder="Institution" />
                                {errors.administrative?.principalInvestigator?.institution && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.institution.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number *</Label>
                                <Input {...register("administrative.principalInvestigator.contact")} placeholder="Contact number" />
                                {errors.administrative?.principalInvestigator?.contact && <p className="text-red-500 text-xs mt-1">{errors.administrative.principalInvestigator.contact.message}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Upload CV</Label>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => onFileUpload(e, "administrative.principalInvestigator.cvFile")}
                                />
                                {getValues("administrative.principalInvestigator.cvFile") && <p className="text-green-600 text-xs mt-1">✓ CV uploaded</p>}
                            </div>
                        </div>
                    </div>

                    {/* Co-Investigators */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">Co-Investigators</h4>
                            <Button type="button" size="sm" onClick={() => addCoInvestigator({ name: "", designation: "", qualification: "", department: "", institution: "", contact: "", cvFile: "" })}>
                                + Add Co-Investigator
                            </Button>
                        </div>

                        {coInvestigators.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-6 mb-6 bg-gray-50 relative">
                                <Button type="button" variant="ghost" size="sm" className="absolute top-4 right-4 text-red-600" onClick={() => removeCoInvestigator(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Name *</Label><Input {...register(`administrative.coInvestigators.${index}.name`)} placeholder="Full name" /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Designation *</Label><Input {...register(`administrative.coInvestigators.${index}.designation`)} placeholder="Designation" /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Qualification *</Label><Input {...register(`administrative.coInvestigators.${index}.qualification`)} placeholder="Qualification" /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Department *</Label><Input {...register(`administrative.coInvestigators.${index}.department`)} placeholder="Department" /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Institution *</Label><Input {...register(`administrative.coInvestigators.${index}.institution`)} placeholder="Institution" /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number *</Label><Input {...register(`administrative.coInvestigators.${index}.contact`)} placeholder="Contact number" /></div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Upload CV</Label>
                                        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onFileUpload(e, `administrative.coInvestigators.${index}.cvFile`)} />
                                        {getValues(`administrative.coInvestigators.${index}.cvFile`) && <p className="text-green-600 text-xs mt-1">✓ CV uploaded</p>}
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

const ResearchForm = ({ onFileUpload }) => { 
    const { register, control, formState: { errors }, watch } = useFormContext();

    const { fields: siteDetails, append: addSite, remove: removeSite } = useFieldArray({
        control,
        name: "research.siteDetails",
    });

    const studySites = watch("research.studySites");

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">Research Details</h3>

            {/* Study Type - Multi-checkbox */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Study Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Basic", "Applied", "Clinical", "Epidemiological", "Qualitative", "Others"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Controller
                                name="research.studyType"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value?.includes(type) || false}
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
                {errors.research?.studyType && <p className="text-red-500 text-xs mt-1">{errors.research.studyType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Study Design *</Label>
                    <Controller
                        name="research.studyDesign"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select design" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="interventional">Interventional</SelectItem>
                                    <SelectItem value="observational">Observational</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.research?.studyDesign && <p className="text-red-500 text-xs mt-1">{errors.research.studyDesign.message}</p>}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Study Duration (months) *</Label>
                    <Input type="number" {...register("research.studyDuration", { valueAsNumber: true })} min="1" placeholder="Enter duration" />
                    {errors.research?.studyDuration && <p className="text-red-500 text-xs mt-1">{errors.research.studyDuration.message}</p>}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Number of Study Sites *</Label>
                    <Controller
                        name="research.studySites"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Single-center</SelectItem>
                                    <SelectItem value="multi">Multi-center</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.research?.studySites && <p className="text-red-500 text-xs mt-1">{errors.research.studySites.message}</p>}
                </div>
            </div>

            {/* Multi-center site details */}
            {studySites === "multi" && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">Study Site Details</h4>
                        <Button type="button" size="sm" onClick={() => addSite({ name: "", piName: "", expectedParticipants: "" })}>
                            + Add Site
                        </Button>
                    </div>

                    {siteDetails.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-5 bg-gray-50 relative">
                            <Button type="button" variant="ghost" size="sm" className="absolute top-3 right-3 text-red-600" onClick={() => removeSite(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Site Name</Label>
                                    <Input {...register(`research.siteDetails.${index}.name`)} placeholder="Site name" />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">PI Name at Site</Label>
                                    <Input {...register(`research.siteDetails.${index}.piName`)} placeholder="Principal Investigator" />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Expected Participants</Label>
                                    <Input type="number" {...register(`research.siteDetails.${index}.expectedParticipants`, { valueAsNumber: true })} min="0" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Funding Source */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Funding Source *</Label>
                <Controller
                    name="research.fundingSource"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select funding source" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="self">Self-funded</SelectItem>
                                <SelectItem value="govt">Government</SelectItem>
                                <SelectItem value="industry">Industry/Sponsor</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.research?.fundingSource && <p className="text-red-500 text-xs mt-1">{errors.research.fundingSource.message}</p>}
            </div>

            {/* Sponsor / CRO Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Sponsor Details (if applicable)</Label>
                    <Input {...register("research.sponsorDetails")} placeholder="Sponsor name / organization" />
                </div>
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">CRO Details (if applicable)</Label>
                    <Input {...register("research.croDetails")} placeholder="Contract Research Organization" />
                </div>
            </div>

            {/* Conflict of Interest */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="research.conflictOfInterest"
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id="conflict" />}
                    />
                    <Label htmlFor="conflict" className="text-sm font-medium cursor-pointer">
                        Conflict of Interest exists *
                    </Label>
                </div>

                {watch("research.conflictOfInterest") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Details of Conflict</Label>
                        <Textarea {...register("research.conflictDetails")} rows={3} placeholder="Describe any conflict of interest" />
                    </div>
                )}
            </div>

            {/* Insurance Coverage */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="research.insuranceCoverage"
                        control={control}
                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} id="insurance" />}
                    />
                    <Label htmlFor="insurance" className="text-sm font-medium cursor-pointer">
                        Insurance coverage for participants *
                    </Label>
                </div>

                {watch("research.insuranceCoverage") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Insurance Details</Label>
                        <Textarea {...register("research.insuranceDetails")} rows={3} placeholder="Describe insurance coverage details" />
                    </div>
                )}
            </div>
        </div>
    );
};


const ParticipantForm = ({ onFileUpload }) => {  
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
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">
                Participant Information
            </h3>

            {/* Basic Counts & Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Total Number of Participants *
                    </Label>
                    <Input
                        type="number"
                        {...register("participant.participantCount", { valueAsNumber: true })}
                        min="1"
                        placeholder="Enter total expected participants"
                    />
                    {errors.participant?.participantCount && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.participantCount.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Recruitment Method *
                    </Label>
                    <Input
                        {...register("participant.recruitmentMethod")}
                        placeholder="e.g., Hospital database, advertisements, referrals"
                    />
                    {errors.participant?.recruitmentMethod && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.recruitmentMethod.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Vulnerable Groups - Multi-checkbox */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Vulnerable Groups (select all that apply)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vulnerableGroupsOptions.map((group) => (
                        <div key={group} className="flex items-center space-x-2">
                            <Controller
                                name="participant.vulnerableGroups"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value?.includes(group) || false}
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
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Inclusion Criteria *
                    </Label>
                    <Textarea
                        {...register("participant.inclusionCriteria")}
                        rows={4}
                        placeholder="Describe who will be included (e.g., age range, diagnosis, etc.)"
                    />
                    {errors.participant?.inclusionCriteria && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.inclusionCriteria.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Exclusion Criteria *
                    </Label>
                    <Textarea
                        {...register("participant.exclusionCriteria")}
                        rows={4}
                        placeholder="Describe who will be excluded (e.g., comorbidities, pregnancy, etc.)"
                    />
                    {errors.participant?.exclusionCriteria && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.exclusionCriteria.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Risk, Benefit & Privacy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Risk Assessment *
                    </Label>
                    <Controller
                        name="participant.riskAssessment"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.riskAssessment.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Benefit Assessment *
                    </Label>
                    <Controller
                        name="participant.benefitAssessment"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <p className="text-red-500 text-xs mt-1">
                            {errors.participant.benefitAssessment.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Privacy & Confidentiality Measures *
                </Label>
                <Textarea
                    {...register("participant.privacyMeasures")}
                    rows={3}
                    placeholder="Describe how participant data will be protected (anonymization, encryption, access control, etc.)"
                />
                {errors.participant?.privacyMeasures && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.participant.privacyMeasures.message}
                    </p>
                )}
            </div>

            {/* Optional: Intervention Details */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Intervention / Procedure Details (if applicable)
                </Label>
                <Textarea
                    {...register("participant.interventionDetails")}
                    rows={3}
                    placeholder="Describe any interventions, procedures, or tests participants will undergo"
                />
            </div>
        </div>
    );
};

const ConsentDataForm = ({ onFileUpload }) => {  
    const { register, control, formState: { errors }, watch } = useFormContext();

    const hasBiologicalSamples = watch("consentData.biologicalSamples");

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">
                Consent & Data Management
            </h3>

            {/* Consent Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Type of Consent *
                    </Label>
                    <Controller
                        name="consentData.consentType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select consent type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="written">Written</SelectItem>
                                    <SelectItem value="oral">Oral</SelectItem>
                                    <SelectItem value="waiver">Waiver of consent</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.consentData?.consentType && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.consentData.consentType.message}
                        </p>
                    )}
                </div>

                {/* Consent Languages - simple multi-select simulation with checkboxes */}
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Consent Languages (select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        {["English", "Hindi", "Marathi", "Tamil", "Telugu", "Other"].map((lang) => (
                            <div key={lang} className="flex items-center space-x-2">
                                <Controller
                                    name="consentData.consentLanguages"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value?.includes(lang) || false}
                                            onCheckedChange={(checked) => {
                                                const updated = checked
                                                    ? [...(field.value || []), lang]
                                                    : (field.value || []).filter((l) => l !== lang);
                                                field.onChange(updated);
                                            }}
                                            id={`lang-${lang}`}
                                        />
                                    )}
                                />
                                <Label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                                    {lang}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Assent & Re-consent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="consentData.assentForMinors"
                        control={control}
                        render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="assent-minors" />
                        )}
                    />
                    <Label htmlFor="assent-minors" className="text-sm font-medium cursor-pointer">
                        Assent planned for minors/children *
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Controller
                        name="consentData.reconsentPlan"
                        control={control}
                        render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="reconsent" />
                        )}
                    />
                    <Label htmlFor="reconsent" className="text-sm font-medium cursor-pointer">
                        Re-consent plan exists *
                    </Label>
                </div>
            </div>

            {watch("consentData.reconsentPlan") && (
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Re-consent Details
                    </Label>
                    <Textarea
                        {...register("consentData.reconsentDetails")}
                        rows={3}
                        placeholder="Describe when and how re-consent will be obtained"
                    />
                </div>
            )}

            {/* Data Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Type of Data Collected *
                    </Label>
                    <Controller
                        name="consentData.dataType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select data type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="primary">Primary</SelectItem>
                                    <SelectItem value="secondary">Secondary</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.consentData?.dataType && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.consentData.dataType.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Data Sources *
                    </Label>
                    <Input
                        {...register("consentData.dataSources")}
                        placeholder="e.g., Medical records, interviews, questionnaires"
                    />
                    {errors.consentData?.dataSources && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.consentData.dataSources.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Data Storage Duration (years) *
                    </Label>
                    <Input
                        type="number"
                        {...register("consentData.dataStorageDuration", { valueAsNumber: true })}
                        min="0"
                        placeholder="Number of years"
                    />
                    {errors.consentData?.dataStorageDuration && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.consentData.dataStorageDuration.message}
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Controller
                        name="consentData.dataSharing"
                        control={control}
                        render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="data-sharing" />
                        )}
                    />
                    <Label htmlFor="data-sharing" className="text-sm font-medium cursor-pointer">
                        Data will be shared with others *
                    </Label>
                </div>
            </div>

            {watch("consentData.dataSharing") && (
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Data Sharing Details
                    </Label>
                    <Textarea
                        {...register("consentData.dataSharingDetails")}
                        rows={3}
                        placeholder="Who will receive data, purpose, safeguards, etc."
                    />
                </div>
            )}

            {/* Biological Samples */}
            <div className="flex items-center space-x-2">
                <Controller
                    name="consentData.biologicalSamples"
                    control={control}
                    render={({ field }) => (
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id="bio-samples" />
                    )}
                />
                <Label htmlFor="bio-samples" className="text-sm font-medium cursor-pointer">
                    Biological samples will be collected *
                </Label>
            </div>

            {hasBiologicalSamples && (
                <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Biological Sample Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Type of Sample(s) *
                            </Label>
                            <Input
                                {...register("consentData.sampleDetails.type")}
                                placeholder="e.g., Blood, tissue, saliva"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Storage Location *
                            </Label>
                            <Input
                                {...register("consentData.sampleDetails.storageLocation")}
                                placeholder="e.g., Department lab, biobank"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Storage Duration (years) *
                            </Label>
                            <Input
                                type="number"
                                {...register("consentData.sampleDetails.duration", { valueAsNumber: true })}
                                min="0"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Disposal Method *
                            </Label>
                            <Input
                                {...register("consentData.sampleDetails.disposalMethod")}
                                placeholder="e.g., Incineration, autoclaving"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DeclarationForm = ({ onFileUpload }) => {
    const { register, control, watch, formState: { errors } } = useFormContext();

    const checklistItems = [
        { key: "protocol", label: "Study Protocol" },
        { key: "investigatorCVs", label: "Investigator CVs" },
        { key: "pisIcf", label: "Participant Information Sheet & Informed Consent Form" },
        { key: "gcpTraining", label: "GCP Training Certificates" },
        { key: "ecReviewFeeReceipt", label: "EC Review Fee Receipt" },
    ];

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">Declaration & Checklist</h3>

            <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Checklist of Enclosed Documents</h4>
                {checklistItems.map((item) => (
                    <div key={item.key} className="flex items-center">
                        <Controller
                            name={`declaration.checklist.${item.key}`}
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id={`check-${item.key}`}
                                />
                            )}
                        />
                        <Label htmlFor={`check-${item.key}`} className="ml-2 text-sm">
                            {item.label}
                        </Label>
                    </div>
                ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Label className="text-lg font-medium text-gray-900 block mb-4">Signed Declaration Page *</Label>
                <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onFileUpload(e, "declaration.signatureFile")}
                    className="mx-auto max-w-xs"
                />
                {watch("declaration.signatureFile") && (
                    <p className="text-green-600 mt-3">✓ Signed declaration uploaded</p>
                )}
                {errors.declaration?.signatureFile && (
                    <p className="text-red-500 text-sm mt-2">{errors.declaration.signatureFile.message}</p>
                )}
            </div>
        </div>
    );
};

export { AdministrativeForm, ResearchForm, ParticipantForm, ConsentDataForm, DeclarationForm };