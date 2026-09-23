import Proposal from "../models/Proposal.js";

function buildDescription(proposal) {
  return (
    proposal.summary ||
    proposal.methodology ||
    proposal.administrative?.studyTitle ||
    proposal.title ||
    ""
  );
}

export const approvedProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: "approved" })
      .populate({ path: "researcher", select: "name institution", model: "User" })
      .sort({ updatedAt: -1 })
      .select("title summary methodology administrative createdAt updatedAt researcher status");

    const approvedProposals = proposals.map((proposal) => ({
      ...proposal.toObject(),
      description: buildDescription(proposal),
    }));

    res.status(200).json({ approvedProposals });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load approved proposals",
    });
  }
};
