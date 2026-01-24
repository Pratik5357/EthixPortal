// File: models/Proposal.js
import mongoose from "mongoose";

const investigatorSchema = new mongoose.Schema({
    name: { type: String },
    designation: { type: String },
    qualification: { type: String },
    department: { type: String },
    institution: { type: String },
    contact: { type: String },
    cvFile: { type: String } // path/URL to uploaded CV
});

const siteDetailSchema = new mongoose.Schema({
    name: { type: String },
    piName: { type: String },
    expectedParticipants: { type: Number }
});

const fundingDetailSchema = new mongoose.Schema({
    sponsorName: { type: String },
    amount: { type: Number },
    duration: { type: String }
});

const biologicalSampleSchema = new mongoose.Schema({
    type: { type: String },
    storageLocation: { type: String },
    duration: { type: String },
    disposalMethod: { type: String }
});

const checklistSchema = new mongoose.Schema({
    protocol: { type: Boolean, default: false },
    investigatorCVs: { type: Boolean, default: false },
    pisIcf: { type: Boolean, default: false },
    gcpTraining: { type: Boolean, default: false },
    ecReviewFeeReceipt: { type: Boolean, default: false },
    insuranceCertificate: { type: Boolean, default: false },
    indemnityPolicy: { type: Boolean, default: false },
    cta: { type: Boolean, default: false },
    mta: { type: Boolean, default: false },
    mou: { type: Boolean, default: false },
    budget: { type: Boolean, default: false },
    regulatoryApprovals: { type: Boolean, default: false },
    collaboratorMou: { type: Boolean, default: false },
    ethicalApprovals: { type: Boolean, default: false },
    healthMinistryScreening: { type: Boolean, default: false },
    plagReport: { type: Boolean, default: false },
    otherDocuments: { type: Boolean, default: false }
}, { _id: false });

const proposalSchema = new mongoose.Schema(
    {
        title: { type: String },
        researcher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: [
                "draft",
                "submitted",
                "under_review",
                "revision_required",
                "approved",
                "rejected"
            ],
            default: "draft",
            required: true
        },
        comments: [
            {
                reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                text: { type: String, required: true },
                decision: { type: String, enum: ["approved", "revision_required", "rejected"], required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        administrative: {
            organization: { type: String },
            iecName: { type: String },
            dateOfSubmission: { type: Date },
            reviewType: {
                type: String,
                enum: ["Exemption", "Expedited", "Full Committee"]
            },
            studyTitle: { type: String },
            shortTitle: { type: String },
            protocolNumber: { type: String },
            protocolVersion: { type: String },
            principalInvestigator: investigatorSchema,
            coInvestigators: [investigatorSchema]
        },

        research: {
            studyType: [{ type: String }],
            studyDesign: {
                type: String,
                enum: ["", "interventional", "observational"]
            },
            studyDuration: { type: Number },
            studySites: {
                type: String,
                enum: ["", "single", "multi"]
            },
            siteDetails: [siteDetailSchema],
            fundingSource: {
                type: String,
                enum: ["", "self", "govt", "industry", "other"]
            },
            fundingDetails: fundingDetailSchema,
            sponsorDetails: { type: String },
            croDetails: { type: String },
            conflictOfInterest: { type: Boolean },
            conflictDetails: { type: String },
            insuranceCoverage: { type: Boolean },
            insuranceDetails: { type: String }
        },

        participant: {
            participantCount: { type: Number },
            vulnerableGroups: [{ type: String }],
            inclusionCriteria: { type: String },
            exclusionCriteria: { type: String },
            recruitmentMethod: { type: String },
            interventionDetails: { type: String },
            dataCollectionMethods: [{ type: String }],
            riskAssessment: {
                type: String,
                enum: ["", "minimal", "low", "high"]
            },
            benefitAssessment: {
                type: String,
                enum: ["", "direct", "indirect", "none"]
            },
            privacyMeasures: { type: String }
        },

        consentData: {
            waiverRequest: { type: Boolean, default: false },
            waiverJustification: { type: String },
            consentProcess: { type: String },
            consentFormEnglish: { type: String },
            consentFormLocal: { type: String },
            avRecording: { type: Boolean, default: false },
            avJustification: { type: String },
            dataSharing: {
                type: String,
                enum: ["", "none", "anonymized", "full"]
            },
            sampleStorage: {
                type: String,
                enum: ["", "none", "short_term", "long_term", "biobank"]
            }
        },

        declaration: {
            agree: { type: Boolean, default: false },
            signatureFile: { type: String }
        },

        summary: { type: String },
        objectives: { type: String },
        methodology: { type: String },
        expectedOutcome: { type: String },

        reviewers: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        ],
        documents: [
            {
                fileName: { type: String },
                fileContent: { type: String },
                contentType: { type: String },
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        comments: [
            {
                reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: String,
                decision: {
                    type: String,
                    enum: ["approved", "revision_required", "rejected"]
                },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        responses: [
            {
                researcher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                text: String,
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);