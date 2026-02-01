import Proposal from "../models/Proposal.js";

export const saveDraft = async (req, res) => {
  try {
    const proposalData = {
      ...req.body,
      researcher: req.user.id,
      status: "draft"
    };

    // Auto-populate root level title from administrative.studyTitle if present
    if (proposalData.administrative && proposalData.administrative.studyTitle) {
      proposalData.title = proposalData.administrative.studyTitle;
    }

    let proposal;
    if (req.body._id) {
      proposal = await Proposal.findByIdAndUpdate(req.body._id, proposalData, {
        new: true,
        runValidators: false
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
  console.log("submitProposal called with ID:", req.params.proposalId);

  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      console.log("Proposal not found");
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Sync title
    if (proposal.administrative && proposal.administrative.studyTitle) {
      proposal.title = proposal.administrative.studyTitle;
    }

    console.log("Before update - current status:", proposal.status);

    // Auto-transition to under_review if reviewers are already assigned
    if (proposal.reviewers && proposal.reviewers.length > 0) {
      proposal.status = "under_review";
    } else {
      proposal.status = "submitted";
    }

    await proposal.save();
    console.log("After save - new status:", proposal.status);

    res.json({ message: "Proposal submitted", proposal });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    console.log("req.file:", req.file ? "present" : "MISSING");
    console.log("req.body:", req.body);
    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const base64Content = req.file.buffer.toString("base64");

    const fieldPath = req.body.field || "documents";

    const parts = fieldPath.split(".");
    let current = proposal;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = `data:application/pdf;base64,${base64Content}`;

    proposal.documents.push({
      fileName: req.file.originalname,
      fileContent: base64Content,
      contentType: req.file.mimetype,
      uploadedAt: new Date(),
    });

    await proposal.save();

    res.json({
      message: "PDF uploaded and stored as base64",
      fileUrl: `data:application/pdf;base64,${base64Content}`,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate("researcher", "name email");
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Auto-update root title
    if (updateData.administrative && updateData.administrative.studyTitle) {
      updateData.title = updateData.administrative.studyTitle;
    }

    const proposal = await Proposal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });
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

    proposal.responses.push({
      researcher: req.user.id,
      text: responseText,
      createdAt: new Date()
    });
    proposal.status = "submitted";
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

    if (!proposal.reviewers.includes(req.user.id)) {
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

    const proposal = await Proposal.findById(req.params.proposalId);

    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (!proposal.reviewers.includes(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to comment" });
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
      proposal.status = "approved";
    }

    await proposal.save();

    res.json({ message: "Comment added", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};