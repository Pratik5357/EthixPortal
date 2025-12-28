import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        summary: { type: String },
        objectives: { type: String },
        methodology: { type: String },
        expectedOutcome: { type: String },

        researcher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        reviewers: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        ],

        documents: [
            {
                fileName: String,
                fileUrl: String,
                uploadedAt: { type: Date, default: Date.now }
            }
        ],

        comments: [
            {
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                decision: {
                    type: String,
                    enum: ["approved", "revision_required", "rejected"],
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        responses: [
            {
                researcher: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

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
            default: "draft"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Proposal", proposalSchema);