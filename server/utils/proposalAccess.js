export function toIdString(value) {
  if (!value) return null;
  return value._id ? value._id.toString() : value.toString();
}

export function isProposalOwner(proposal, userId) {
  return toIdString(proposal.researcher) === toIdString(userId);
}

export function isReviewerOnProposal(proposal, userId) {
  const id = toIdString(userId);
  const inReviewers = proposal.reviewers?.some((r) => toIdString(r) === id);
  const inAssigned = proposal.assignedTo?.some((r) => toIdString(r) === id);
  return Boolean(inReviewers || inAssigned);
}

export function isStaffRole(role) {
  return ["admin", "scrutiny", "reviewer"].includes(role);
}

export function syncProposalDerivedFields(data) {
  if (data.administrative?.studyTitle) {
    data.title = data.administrative.studyTitle;
  }

  const design = data.research?.studyDesign;
  const type = data.research?.studyType;

  if (design && !data.methodology) {
    data.methodology = design;
  }

  if (!data.summary) {
    data.summary =
      data.administrative?.studyTitle ||
      data.title ||
      [type, design].filter(Boolean).join(" — ");
  }

  if (!data.objectives && data.research?.primaryObjective) {
    data.objectives = data.research.primaryObjective;
  }

  return data;
}
