import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ================= RESEARCHER ================= */

export const researcherDashboard = async (req, res) => {
  const researcherId = req.user.id;

  const proposals = await Proposal.find({ researcher: researcherId })
    .sort({ createdAt: -1 })
    .limit(5);

  const stats = {
    total: await Proposal.countDocuments({ researcher: researcherId }),
    underReview: await Proposal.countDocuments({
      researcher: researcherId,
      status: "under_review"
    }),
    approved: await Proposal.countDocuments({
      researcher: researcherId,
      status: "approved"
    }),
    actionRequired: await Proposal.countDocuments({
      researcher: researcherId,
      status: "revision_required"
    })
  };

  res.json({ stats, recentProposals: proposals });
};

/* ================= REVIEWER ================= */

export const reviewerDashboard = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    // Assigned proposals
    const assignedProposals = await Proposal.find({
      reviewers: reviewerId
    })
      .select("title status createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Stats
    const stats = {
      totalAssigned: await Proposal.countDocuments({
        reviewers: reviewerId
      }),
      pending: await Proposal.countDocuments({
        reviewers: reviewerId,
        status: "under_review"
      }),
      completed: await Proposal.countDocuments({
        reviewers: reviewerId,
        status: { $in: ["approved", "rejected"] }
      })
    };

    res.json({
      stats,
      assignedProposals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load reviewer dashboard data"
    });
  }
};

/* ================= ADMIN ================= */

export const adminDashboard = async (req, res) => {
  try {
    const [
      totalProposals,
      approved,
      underReview,
      revisionRequired,
      rejected,
      totalUsers,
      totalResearchers,
      totalReviewers
    ] = await Promise.all([
      Proposal.countDocuments(),
      Proposal.countDocuments({ status: "approved" }),
      Proposal.countDocuments({ status: "under_review" }),
      Proposal.countDocuments({ status: "revision_required" }),
      Proposal.countDocuments({ status: "rejected" }),
      User.countDocuments(),
      User.countDocuments({ role: "researcher" }),
      User.countDocuments({ role: "reviewer" })
    ]);

    res.json({
      proposals: {
        total: totalProposals,
        approved,
        underReview,
        revisionRequired,
        rejected
      },
      users: {
        total: totalUsers,
        researchers: totalResearchers,
        reviewers: totalReviewers
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load admin dashboard data"
    });
  }
};