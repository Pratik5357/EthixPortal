import Proposal from "../models/Proposal.js";

/* ================= CREATE PROPOSAL ================= */

export const createProposal = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const proposal = new Proposal({
      title,
      description,
      researcher: req.user.id // from JWT
    });

    await proposal.save();

    res.status(201).json({
      message: "Proposal submitted successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create proposal"
    });
  }
};

export const saveDraft = async (req, res) => {
  try {
    const proposal = new Proposal({
      ...req.body,
      researcher: req.user.id,
      status: "draft"
    });

    await proposal.save();

    res.status(201).json({
      message: "Draft saved",
      proposal
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save draft" });
  }
};

/* ================= SUBMIT PROPOSAL ================= */
export const submitProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findOne({
      _id: proposalId,
      researcher: req.user.id
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.status !== "draft") {
      return res
        .status(400)
        .json({ message: "Only drafts can be submitted" });
    }

    proposal.status = "submitted";
    await proposal.save();

    res.json({
      message: "Proposal submitted successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({ message: "Submission failed" });
  }
};

/* ================= UPLOAD DOCUMENT ================= */
export const uploadDocument = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const proposal = await Proposal.findOne({
      _id: proposalId,
      researcher: req.user.id
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.documents.push({
      fileName: req.file.originalname,
      fileUrl: `/uploads/proposals/${req.file.filename}`
    });

    await proposal.save();

    res.json({
      message: "Document uploaded",
      documents: proposal.documents
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("researcher", "name email")
      .populate("reviewers", "name email");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // 🔐 Authorization rules
    const user = req.user;

    const isResearcher =
      user.role === "researcher" &&
      proposal.researcher._id.toString() === user.id;

    const isReviewer =
      user.role === "reviewer" &&
      proposal.reviewers.some(r => r._id.toString() === user.id);

    const isAdmin = user.role === "admin";

    if (!isResearcher && !isReviewer && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to load proposal" });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // 🔐 Only researcher can update
    if (
      req.user.role !== "researcher" ||
      proposal.researcher.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 🚫 Cannot edit after submission
    if (!["draft", "revision_required"].includes(proposal.status)) {
      return res
        .status(400)
        .json({ message: "Proposal cannot be edited at this stage" });
    }

    Object.assign(proposal, req.body);
    await proposal.save();

    res.json({
      message: "Proposal updated",
      proposal
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= RESUBMIT PROPOSAL ================= */
export const resubmitProposal = async (req, res) => {
  try {
    const { responseText } = req.body;

    const proposal = await Proposal.findOne({
      _id: req.params.id,
      researcher: req.user.id
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.status !== "revision_required") {
      return res.status(400).json({
        message: "Proposal is not eligible for resubmission"
      });
    }

    if (responseText?.trim()) {
      proposal.responses.push({
        researcher: req.user.id,
        text: responseText
      });
    }

    proposal.status = "submitted";
    await proposal.save();

    res.json({
      message: "Proposal resubmitted successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to resubmit proposal"
    });
  }
};