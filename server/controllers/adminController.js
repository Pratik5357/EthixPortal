import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ================= GET ALL REVIEWERS ================= */
export const getAllReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: "reviewer" })
      .select("_id name email shortCode");

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
      assignedTo: { $size: 0 }
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

/* ================= ADMIN VERIFY & FORWARD TO SCRUTINY ================= */
export const verifyProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);

    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    //    if (proposal.status !== "submitted") {
    //      // Allow re-verification if needed, or strict check?
    //      return res.status(400).json({ message: "Proposal is not in submitted state" });
    //    }

    // Find Scrutiny User
    const scrutinyUsers = await User.find({ role: "scrutiny" });
    if (scrutinyUsers.length === 0) {
      return res.status(400).json({ message: "No Scrutiny Member found to assign." });
    }

    // Assign to ALL scrutiny members (conceptually one)
    proposal.assignedTo = scrutinyUsers.map(u => u._id);
    proposal.status = "admin_verified"; // Ready for Scrutiny

    await proposal.save();

    res.json({ message: "Proposal verified and forwarded to Scrutiny", proposal });

  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

/* ================= ASSIGN REVIEWERS (LEGACY / MANUAL OVERRIDE) ================= */
export const assignReviewers = async (req, res) => {
  // ... (keep existing logic if admin wants to force assign reviewers later?)
  // But in new flow, Scrutiny assigns to Reviewer.
  // Let's leave this for manual override or skip.
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
    proposal.assignedTo = reviewers;
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