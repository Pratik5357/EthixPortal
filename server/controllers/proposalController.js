import Proposal from "../models/Proposal.js";
import {
  isProposalOwner,
  isReviewerOnProposal,
  isStaffRole,
  syncProposalDerivedFields,
} from "../utils/proposalAccess.js";

export const saveDraft = async (req, res) => {
  try {
    const proposalData = syncProposalDerivedFields({
      ...req.body,
      researcher: req.user.id,
      status: "draft",
    });

    let proposal;

    if (req.body._id) {
      const existing = await Proposal.findById(req.body._id);
      if (!existing) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      if (!isProposalOwner(existing, req.user.id)) {
        return res.status(403).json({ message: "Not authorized to edit this proposal" });
      }

      proposal = await Proposal.findByIdAndUpdate(req.body._id, proposalData, {
        new: true,
        runValidators: false,
      });
    } else {
      proposal = new Proposal(proposalData);
      await proposal.save({ validateBeforeSave: false });
    }

    res.json(proposal);
  } catch (error) {
    res.status(400).json({ message: "Failed to save draft", error: error.message });
  }
};

export const submitProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (!isProposalOwner(proposal, req.user.id)) {
      return res.status(403).json({ message: "Not authorized to submit this proposal" });
    }

    if (!["draft", "revision_required"].includes(proposal.status)) {
      return res.status(400).json({
        message: "Only draft or revision-required proposals can be submitted",
      });
    }

    syncProposalDerivedFields(proposal);

    proposal.status = "submitted";
    proposal.assignedTo = [];
    proposal.reviewers = [];

    await proposal.save();

    res.json({ message: "Proposal submitted", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (!isProposalOwner(proposal, req.user.id)) {
      return res.status(403).json({ message: "Not authorized to upload to this proposal" });
    }

    const base64Content = req.file.buffer.toString("base64");
    const fieldPath = req.body.field || "documents";
    const fileUrl = `data:application/pdf;base64,${base64Content}`;

    proposal.set(fieldPath, fileUrl);
    const rootField = fieldPath.split(".")[0];
    if (rootField && proposal.get(rootField) !== undefined) {
      proposal.markModified(rootField);
    }

    proposal.documents.push({
      fileName: req.file.originalname,
      fileContent: base64Content,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
    });

    await proposal.save();

    res.json({
      message: "PDF uploaded successfully",
      fileUrl,
      fileName: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate(
      "researcher",
      "name email"
    );
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    const isPublic = proposal.status === "approved";
    const isOwner = req.user && isProposalOwner(proposal, req.user.id);
    const isStaff = req.user && isStaffRole(req.user.role);
    const isAssignedReviewer =
      req.user && req.user.role === "reviewer" && isReviewerOnProposal(proposal, req.user.id);

    if (!isPublic && !isOwner && !isStaff && !isAssignedReviewer) {
      return res.status(403).json({ message: "Unauthorized access to this proposal" });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const downloadDocuments = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal || !proposal.documents?.length) {
      return res.status(404).json({ message: "No documents found" });
    }

    const isApproved = proposal.status === "approved";
    const isOwner = req.user && isProposalOwner(proposal, req.user.id);
    const isStaff = req.user && isStaffRole(req.user.role);

    if (!isApproved && !isOwner && !isStaff) {
      return res.status(403).json({ message: "Not authorized to download this document" });
    }

    const doc = proposal.documents[0];
    const buffer = Buffer.from(doc.fileContent, "base64");

    res.setHeader("Content-Type", doc.contentType || "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${doc.fileName}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Download failed", error: error.message });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const existing = await Proposal.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Proposal not found" });

    if (!isProposalOwner(existing, req.user.id)) {
      return res.status(403).json({ message: "Not authorized to update this proposal" });
    }

    const updateData = syncProposalDerivedFields({ ...req.body });
    delete updateData._id;
    delete updateData.comments;
    delete updateData.researcher;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    if (updateData.declaration) {
      updateData.declaration = {
        agree: Boolean(updateData.declaration.agree),
        signatureFile:
          updateData.declaration.signatureFile ||
          existing.declaration?.signatureFile ||
          "",
      };
    }

    const proposal = await Proposal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(proposal);
  } catch (error) {
    res.status(400).json({ message: "Failed to update", error: error.message });
  }
};

export const resubmitProposal = async (req, res) => {
  try {
    const { responseText } = req.body;
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (!isProposalOwner(proposal, req.user.id)) {
      return res.status(403).json({ message: "Not authorized to resubmit this proposal" });
    }

    if (proposal.status !== "revision_required") {
      return res.status(400).json({ message: "Proposal is not awaiting revision" });
    }

    proposal.responses.push({
      researcher: req.user.id,
      text: responseText || "Revised per committee feedback",
      createdAt: new Date(),
    });

    syncProposalDerivedFields(proposal);
    proposal.status = "submitted";
    proposal.assignedTo = [];
    proposal.reviewers = [];

    await proposal.save();
    res.json({ message: "Proposal resubmitted", proposal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProposalForReview = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId)
      .populate("researcher", "name email")
      .populate("reviewers", "name email")
      .populate("comments.reviewer", "name");

    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (!isReviewerOnProposal(proposal, req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to review this proposal" });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch proposal", error: error.message });
  }
};

export const addReviewComment = async (req, res) => {
  try {
    const { text, decision } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Review comment is required" });
    }

    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (!isReviewerOnProposal(proposal, req.user.id)) {
      return res.status(403).json({ message: "Not authorized to comment" });
    }

    if (proposal.status !== "under_review") {
      return res.status(400).json({ message: "Proposal is not under review" });
    }

    proposal.comments.push({
      reviewer: req.user.id,
      text,
      decision,
    });

    if (decision === "revision_required") {
      proposal.status = "revision_required";
    } else if (decision === "rejected") {
      proposal.status = "rejected";
    } else if (decision === "approved") {
      const approvedCount = proposal.comments.filter((c) => c.decision === "approved").length + 1;
      const requiredApprovals = Math.max(proposal.reviewers.length, 1);
      if (approvedCount >= requiredApprovals) {
        proposal.status = "approved";
      }
    }

    await proposal.save();

    res.json({ message: "Comment added", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};
