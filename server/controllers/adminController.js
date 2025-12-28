import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ================= GET ALL REVIEWERS ================= */
export const getAllReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: "reviewer" })
      .select("_id name email");

    res.json(reviewers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviewers"
    });
  }
};

/* ================= PROPOSALS AWAITING ASSIGNMENT ================= */
export const getProposalsForAssignment = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      status: "submitted",
      reviewers: { $size: 0 }
    })
      .select("_id title status createdAt")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch proposals"
    });
  }
};

/* ================= ASSIGN REVIEWERS ================= */
export const assignReviewers = async (req, res) => {
  try {
    const { reviewers } = req.body;

    if (!Array.isArray(reviewers) || reviewers.length === 0) {
      return res.status(400).json({
        message: "At least one reviewer must be assigned"
      });
    }

    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }

    if (proposal.status !== "submitted") {
      return res.status(400).json({
        message: "Proposal is not eligible for assignment"
      });
    }

    proposal.reviewers = reviewers;
    proposal.status = "under_review";

    await proposal.save();

    res.json({
      message: "Reviewers assigned successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign reviewers"
    });
  }
};