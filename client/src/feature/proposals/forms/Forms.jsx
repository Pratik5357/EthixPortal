// src/feature/proposals/forms/Forms.jsx
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AdministrativeForm = ({ step, onFileUpload, readOnly }) => {
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
                        <Input {...register("administrative.organization")} placeholder={readOnly ? "" : "Enter organization name"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                        {errors.administrative?.organization && <p className="text-red-500 text-xs mt-1">{errors.administrative.organization.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">IEC Name *</Label>
                        <Input {...register("administrative.iecName")} placeholder={readOnly ? "" : "Enter IEC name"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                        {errors.administrative?.iecName && <p className="text-red-500 text-xs mt-1">{errors.administrative.iecName.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Date of Submission *</Label>
                        <Input type="date" {...register("administrative.dateOfSubmission")} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                        {errors.administrative?.dateOfSubmission && <p className="text-red-500 text-xs mt-1">{errors.administrative.dateOfSubmission.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Type of Review *</Label>
                        <Controller
                            name="administrative.reviewType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                    <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}><SelectValue placeholder="Select review type" /></SelectTrigger>
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
                        <Textarea {...register("administrative.studyTitle")} rows={3} placeholder={readOnly ? "" : "Enter complete study title"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                        {errors.administrative?.studyTitle && <p className="text-red-500 text-xs mt-1">{errors.administrative.studyTitle.message}</p>}
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Short Title / Acronym</Label>
                        <Input {...register("administrative.shortTitle")} placeholder={readOnly ? "" : "Optional short title"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">Protocol Number</Label>
                            <Input {...register("administrative.protocolNumber")} placeholder={readOnly ? "" : "Enter protocol number"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">Protocol Version</Label>
                            <Input {...register("administrative.protocolVersion")} placeholder={readOnly ? "" : "Enter protocol version"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
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
                                <Input {...register("administrative.principalInvestigator.name")} placeholder="Full name" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Designation *</Label>
                                <Input {...register("administrative.principalInvestigator.designation")} placeholder="Designation" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Qualification *</Label>
                                <Input {...register("administrative.principalInvestigator.qualification")} placeholder="Qualification" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Department *</Label>
                                <Input {...register("administrative.principalInvestigator.department")} placeholder="Department" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Institution *</Label>
                                <Input {...register("administrative.principalInvestigator.institution")} placeholder="Institution" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number *</Label>
                                <Input {...register("administrative.principalInvestigator.contact")} placeholder="Contact number" className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-sm font-medium text-gray-700 mb-1 block">CV</Label>
                                {!readOnly && (
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => onFileUpload(e, "administrative.principalInvestigator.cvFile")}
                                    />
                                )}
                                {getValues("administrative.principalInvestigator.cvFile") && (
                                    <div className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                        ✓ CV Uploaded
                                        {readOnly && <span className="text-gray-400 text-[10px]">(Download available)</span>}
                                    </div>
                                )}
                                {!getValues("administrative.principalInvestigator.cvFile") && readOnly && (
                                    <span className="text-sm text-gray-400 italic">No CV uploaded</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Co-Investigators */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">Co-Investigators</h4>
                            {!readOnly && (
                                <Button type="button" size="sm" onClick={() => addCoInvestigator({ name: "", designation: "", qualification: "", department: "", institution: "", contact: "", cvFile: "" })}>
                                    + Add Co-Investigator
                                </Button>
                            )}
                        </div>

                        {coInvestigators.length === 0 && readOnly && (
                            <p className="text-sm text-gray-500 italic">No Co-Investigators listed.</p>
                        )}

                        {coInvestigators.map((field, index) => (
                            <div key={field.id} className="border rounded-lg p-6 mb-6 bg-gray-50 relative">
                                {!readOnly && (
                                    <Button type="button" variant="ghost" size="sm" className="absolute top-4 right-4 text-red-600" onClick={() => removeCoInvestigator(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Name *</Label><Input {...register(`administrative.coInvestigators.${index}.name`)} placeholder="Full name" className={readOnly ? "bg-white" : ""} /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Designation *</Label><Input {...register(`administrative.coInvestigators.${index}.designation`)} placeholder="Designation" className={readOnly ? "bg-white" : ""} /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Qualification *</Label><Input {...register(`administrative.coInvestigators.${index}.qualification`)} placeholder="Qualification" className={readOnly ? "bg-white" : ""} /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Department *</Label><Input {...register(`administrative.coInvestigators.${index}.department`)} placeholder="Department" className={readOnly ? "bg-white" : ""} /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Institution *</Label><Input {...register(`administrative.coInvestigators.${index}.institution`)} placeholder="Institution" className={readOnly ? "bg-white" : ""} /></div>
                                    <div><Label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number *</Label><Input {...register(`administrative.coInvestigators.${index}.contact`)} placeholder="Contact number" className={readOnly ? "bg-white" : ""} /></div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">CV</Label>
                                        {!readOnly && <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => onFileUpload(e, `administrative.coInvestigators.${index}.cvFile`)} />}
                                        {getValues(`administrative.coInvestigators.${index}.cvFile`) ?
                                            <p className="text-green-600 text-xs mt-1">✓ CV uploaded</p> :
                                            (readOnly && <span className="text-sm text-gray-400 italic">No CV uploaded</span>)
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

const ResearchForm = ({ onFileUpload, readOnly }) => {
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
                {errors.research?.studyType && <p className="text-red-500 text-xs mt-1">{errors.research.studyType.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Study Design *</Label>
                    <Controller
                        name="research.studyDesign"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}><SelectValue placeholder="Select design" /></SelectTrigger>
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
                    <Input type="number" {...register("research.studyDuration", { valueAsNumber: true })} min="1" placeholder={readOnly ? "" : "Enter duration"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                    {errors.research?.studyDuration && <p className="text-red-500 text-xs mt-1">{errors.research.studyDuration.message}</p>}
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Number of Study Sites *</Label>
                    <Controller
                        name="research.studySites"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                                <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}><SelectValue placeholder="Select" /></SelectTrigger>
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
                        {!readOnly && (
                            <Button type="button" size="sm" onClick={() => addSite({ name: "", piName: "", expectedParticipants: "" })}>
                                + Add Site
                            </Button>
                        )}
                    </div>

                    {siteDetails.length === 0 && readOnly && <p className="text-sm text-gray-500 italic">No additional sites listed.</p>}

                    {siteDetails.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-5 bg-gray-50 relative">
                            {!readOnly && (
                                <Button type="button" variant="ghost" size="sm" className="absolute top-3 right-3 text-red-600" onClick={() => removeSite(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Site Name</Label>
                                    <Input {...register(`research.siteDetails.${index}.name`)} placeholder="Site name" className={readOnly ? "bg-white" : ""} />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">PI Name at Site</Label>
                                    <Input {...register(`research.siteDetails.${index}.piName`)} placeholder="Principal Investigator" className={readOnly ? "bg-white" : ""} />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Expected Participants</Label>
                                    <Input type="number" {...register(`research.siteDetails.${index}.expectedParticipants`, { valueAsNumber: true })} min="0" className={readOnly ? "bg-white" : ""} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}><SelectValue placeholder="Select funding source" /></SelectTrigger>
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
                    <Input {...register("research.sponsorDetails")} placeholder={readOnly ? "" : "Sponsor name / organization"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
                </div>
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1 block">CRO Details (if applicable)</Label>
                    <Input {...register("research.croDetails")} placeholder={readOnly ? "" : "Contract Research Organization"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
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
                    <Label htmlFor="conflict" className="text-sm font-medium cursor-pointer">
                        Conflict of Interest exists *
                    </Label>
                </div>

                {watch("research.conflictOfInterest") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Details of Conflict</Label>
                        <Textarea {...register("research.conflictDetails")} rows={3} placeholder={readOnly ? "" : "Describe any conflict of interest"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
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
                    <Label htmlFor="insurance" className="text-sm font-medium cursor-pointer">
                        Insurance coverage for participants *
                    </Label>
                </div>

                {watch("research.insuranceCoverage") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">Insurance Details</Label>
                        <Textarea {...register("research.insuranceDetails")} rows={3} placeholder={readOnly ? "" : "Describe insurance coverage details"} className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""} />
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

const ConsentDataForm = ({ onFileUpload, readOnly }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">
                Informed Consent & Data Management
            </h3>

            {/* Waiver Request */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="consent.waiverRequest"
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
                    <Label htmlFor="waiver" className="text-sm font-medium cursor-pointer">
                        Requesting Waiver of Consent *
                    </Label>
                </div>

                {watch("consent.waiverRequest") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            Justification for Waiver
                        </Label>
                        <Textarea
                            {...register("consent.waiverJustification")}
                            rows={3}
                            placeholder={readOnly ? "" : "Explain why consent waiver is needed"}
                            className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""}
                        />
                        {errors.consent?.waiverJustification && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.consent.waiverJustification.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Consent Process */}
            {!watch("consent.waiverRequest") && (
                <div className="space-y-6">
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            Consent Process Description *
                        </Label>
                        <Textarea
                            {...register("consent.consentProcess")}
                            rows={4}
                            placeholder={readOnly ? "" : "Describe who will obtain consent, where, and how"}
                            className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""}
                        />
                        {errors.consent?.consentProcess && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.consent.consentProcess.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Consent Form (English)
                            </Label>
                            {!readOnly && (
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => onFileUpload(e, "consent.consentFormEnglish")}
                                />
                            )}
                            {watch("consent.consentFormEnglish") ? (
                                <p className="text-green-600 text-xs mt-1">
                                    ✓ English form uploaded
                                </p>
                            ) : (
                                readOnly && <span className="text-sm text-gray-400 italic">No file uploaded</span>
                            )}
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                Consent Form (Local Language)
                            </Label>
                            {!readOnly && (
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => onFileUpload(e, "consent.consentFormLocal")}
                                />
                            )}
                            {watch("consent.consentFormLocal") ? (
                                <p className="text-green-600 text-xs mt-1">
                                    ✓ Local form uploaded
                                </p>
                            ) : (
                                readOnly && <span className="text-sm text-gray-400 italic">No file uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AV Recording */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="consent.avRecording"
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

                {watch("consent.avRecording") && (
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                            Justification for AV Recording
                        </Label>
                        <Textarea
                            {...register("consent.avJustification")}
                            rows={3}
                            placeholder={readOnly ? "" : "Explain why AV recording is necessary"}
                            className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200" : ""}
                        />
                    </div>
                )}
            </div>

            {/* Data Management */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Data Sharing Plan *
                </Label>
                <Controller
                    name="consent.dataSharing"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}>
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
                {errors.consent?.dataSharing && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.consent.dataSharing.message}
                    </p>
                )}
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                    Biological Sample Storage
                </Label>
                <Controller
                    name="consent.sampleStorage"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                            <SelectTrigger className={readOnly ? "bg-slate-50 text-slate-700 border-slate-200 opacity-100" : ""}>
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

const DeclarationForm = ({ onFileUpload, readOnly }) => {
    const { register, control, formState: { errors }, watch } = useFormContext();

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-3">
                Investigator's Declaration
            </h3>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-sm text-gray-700 leading-relaxed space-y-4">
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
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="declare"
                                disabled={readOnly}
                            />
                        )}
                    />
                    <Label htmlFor="declare" className="text-sm font-medium cursor-pointer leading-none mt-0.5">
                        I agree to the above terms and conditions *
                    </Label>
                </div>
                {errors.declaration?.agree && (
                    <p className="text-red-500 text-xs mt-1 pl-7">
                        {errors.declaration.agree.message}
                    </p>
                )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                <Label className="text-lg font-medium text-gray-900 block mb-4">
                    Signed Declaration Page *
                </Label>
                {!readOnly && (
                    <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onFileUpload(e, "declaration.signatureFile")}
                        className="mx-auto max-w-xs"
                    />
                )}
                {watch("declaration.signatureFile") ? (
                    <p className="text-green-600 mt-3">
                        ✓ Signed declaration uploaded
                    </p>
                ) : (
                    readOnly && <span className="text-sm text-gray-400 italic">No signature file uploaded</span>
                )}
                {errors.declaration?.signatureFile && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.declaration.signatureFile.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export { AdministrativeForm, ResearchForm, ParticipantForm, ConsentDataForm, DeclarationForm };