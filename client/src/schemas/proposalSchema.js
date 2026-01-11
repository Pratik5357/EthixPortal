import { z } from "zod";

export const investigatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().min(1, "Qualification is required"),
  department: z.string().min(1, "Department is required"),
  institution: z.string().min(1, "Institution is required"),
  contact: z.string().min(1, "Contact is required"),
  cvFile: z.string().optional().or(z.literal("")),
});

export const siteDetailSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Site name required"),
  piName: z.string().min(1, "PI name required"),
  expectedParticipants: z.number().min(0, "Invalid number"),
});

export const fundingDetailSchema = z.object({
  sponsorName: z.string().min(1, "Sponsor name required"),
  amount: z.number().min(0, "Invalid amount"),
  duration: z.string().min(1, "Duration required"),
});

export const biologicalSampleSchema = z.object({
  type: z.string().min(1, "Type required"),
  storageLocation: z.string().min(1, "Location required"),
  duration: z.number().min(1, "Duration required"),
  disposalMethod: z.string().min(1, "Method required"),
});

export const checklistSchema = z.object({
  protocol: z.boolean(),
  investigatorCVs: z.boolean(),
  pisIcf: z.boolean(),
  gcpTraining: z.boolean(),
  ecReviewFeeReceipt: z.boolean(),
  insuranceCertificate: z.boolean().optional(),
  indemnityPolicy: z.boolean().optional(),
  cta: z.boolean().optional(),
  mta: z.boolean().optional(),
  mou: z.boolean().optional(),
  budget: z.boolean().optional(),
  regulatoryApprovals: z.boolean().optional(),
  collaboratorMou: z.boolean().optional(),
  ethicalApprovals: z.boolean().optional(),
  healthMinistryScreening: z.boolean().optional(),
  plagReport: z.boolean().optional(),
  otherDocuments: z.boolean().optional(),
});

export const proposalSchema = z.object({
  administrative: z.object({
    organization: z.string().min(1, "Organization required"),
    iecName: z.string().min(1, "IEC name required"),
    dateOfSubmission: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    reviewType: z.enum(["Exemption", "Expedited", "Full Committee"], { message: "Select review type" }),
    studyTitle: z.string().min(1, "Study title required"),
    shortTitle: z.string().optional(),
    protocolNumber: z.string().optional(),
    protocolVersion: z.string().optional(),
    principalInvestigator: investigatorSchema,
    coInvestigators: z.array(investigatorSchema).optional(),
  }),
  research: z.object({
    studyType: z.array(z.string()).min(1, "Select at least one study type"),
    studyDesign: z.enum(["interventional", "observational"], { message: "Select design" }),
    studyDuration: z.number().min(1, "Duration must be at least 1 month"),
    studySites: z.enum(["single", "multi"], { message: "Select sites" }),
    siteDetails: z.array(siteDetailSchema).optional(),
    fundingSource: z.enum(["self", "govt", "industry", "other"], { message: "Select funding" }),
    fundingDetails: fundingDetailSchema.optional(),
    sponsorDetails: z.string().optional(),
    croDetails: z.string().optional(),
    conflictOfInterest: z.boolean({ message: "Required" }),
    conflictDetails: z.string().optional(),
    insuranceCoverage: z.boolean({ message: "Required" }),
    insuranceDetails: z.string().optional(),
  }),
  participant: z.object({
    participantCount: z.number().min(1, "At least 1 participant"),
    vulnerableGroups: z.array(z.string()).optional(),
    inclusionCriteria: z.string().min(1, "Inclusion criteria required"),
    exclusionCriteria: z.string().min(1, "Exclusion criteria required"),
    recruitmentMethod: z.string().min(1, "Recruitment method required"),
    interventionDetails: z.string().optional(),
    dataCollectionMethods: z.array(z.string()).optional(),
    riskAssessment: z.enum(["minimal", "low", "high"], { message: "Select risk" }),
    benefitAssessment: z.enum(["direct", "indirect", "none"], { message: "Select benefit" }),
    privacyMeasures: z.string().min(1, "Privacy measures required"),
  }),
  consentData: z.object({
    consentType: z.enum(["written", "oral", "waiver"], { message: "Select consent type" }),
    consentLanguages: z.array(z.string()).min(1, "Select at least one language"),
    assentForMinors: z.boolean({ message: "Required" }),
    reconsentPlan: z.boolean({ message: "Required" }),
    reconsentDetails: z.string().optional(),
    dataType: z.enum(["primary", "secondary", "both"], { message: "Select data type" }),
    dataSources: z.string().min(1, "Data sources required"),
    dataStorageDuration: z.number().min(0, "Storage duration required"),
    dataSharing: z.boolean({ message: "Required" }),
    dataSharingDetails: z.string().optional(),
    biologicalSamples: z.boolean({ message: "Required" }),
    sampleDetails: biologicalSampleSchema.optional(),
  }),
  declaration: z.object({
    checklist: checklistSchema,
    signatureFile: z.string().min(1, "Signature file required"),
  }),
});