/**
 * Section-based submission readiness for the IEC proposal wizard.
 * Progress reflects completed sections, not individual field counts.
 */

function isFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFilledNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

function isFilledArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function isInvestigatorComplete(investigator) {
  if (!investigator) return false;
  return (
    isFilledString(investigator.name) &&
    isFilledString(investigator.designation) &&
    isFilledString(investigator.qualification) &&
    isFilledString(investigator.department) &&
    isFilledString(investigator.institution) &&
    isFilledString(investigator.contact)
  );
}

function isSiteComplete(site) {
  return (
    isFilledString(site?.name) &&
    isFilledString(site?.piName) &&
    typeof site?.expectedParticipants === "number" &&
    !Number.isNaN(site.expectedParticipants)
  );
}

function isAdministrativeComplete(admin) {
  return (
    isFilledString(admin?.organization) &&
    isFilledString(admin?.iecName) &&
    isFilledString(admin?.dateOfSubmission) &&
    isFilledString(admin?.reviewType) &&
    isFilledString(admin?.studyTitle)
  );
}

function isInvestigatorSectionComplete(admin) {
  if (!isInvestigatorComplete(admin?.principalInvestigator)) return false;
  const coInvestigators = admin?.coInvestigators ?? [];
  return coInvestigators.every((co) => isInvestigatorComplete(co));
}

function isResearchComplete(research) {
  if (
    !isFilledArray(research?.studyType) ||
    !isFilledString(research?.studyDesign) ||
    !isFilledNumber(research?.studyDuration) ||
    !isFilledString(research?.studySites) ||
    !isFilledString(research?.fundingSource)
  ) {
    return false;
  }

  if (research.studySites === "multi") {
    const sites = research.siteDetails ?? [];
    if (sites.length === 0 || !sites.every(isSiteComplete)) return false;
  }

  if (research.conflictOfInterest && !isFilledString(research.conflictDetails)) {
    return false;
  }

  if (research.insuranceCoverage && !isFilledString(research.insuranceDetails)) {
    return false;
  }

  return true;
}

function isParticipantComplete(participant) {
  return (
    isFilledNumber(participant?.participantCount) &&
    isFilledString(participant?.recruitmentMethod) &&
    isFilledString(participant?.inclusionCriteria) &&
    isFilledString(participant?.exclusionCriteria) &&
    isFilledString(participant?.riskAssessment) &&
    isFilledString(participant?.benefitAssessment) &&
    isFilledString(participant?.privacyMeasures)
  );
}

function isConsentComplete(consent) {
  if (!isFilledString(consent?.dataSharing)) return false;

  if (consent.waiverRequest) {
    if (!isFilledString(consent.waiverJustification)) return false;
  } else if (!isFilledString(consent.consentProcess)) {
    return false;
  }

  if (consent.avRecording && !isFilledString(consent.avJustification)) {
    return false;
  }

  return true;
}

function isDeclarationComplete(declaration) {
  return declaration?.agree === true && isFilledString(declaration?.signatureFile);
}

export const PROPOSAL_SECTION_IDS = [
  "administrative",
  "investigator",
  "research",
  "participant",
  "consent",
  "declaration",
];

function getReadinessLabel(sectionsComplete, sectionsTotal) {
  if (sectionsComplete === 0) return "Not started";
  if (sectionsComplete === sectionsTotal) return "Ready to submit";
  if (sectionsComplete >= sectionsTotal - 1) return "Almost ready";
  if (sectionsComplete >= 2) return "In progress";
  return "Early draft";
}

export function getProposalProgressSummary(values) {
  if (!values) {
    return {
      percent: 0,
      sectionsComplete: 0,
      sectionsTotal: PROPOSAL_SECTION_IDS.length,
      readinessLabel: "Not started",
      sectionComplete: {},
    };
  }

  const admin = values.administrative ?? {};
  const sectionComplete = {
    administrative: isAdministrativeComplete(admin),
    investigator: isInvestigatorSectionComplete(admin),
    research: isResearchComplete(values.research),
    participant: isParticipantComplete(values.participant),
    consent: isConsentComplete(values.consentData),
    declaration: isDeclarationComplete(values.declaration),
  };

  const sectionsComplete = Object.values(sectionComplete).filter(Boolean).length;
  const sectionsTotal = PROPOSAL_SECTION_IDS.length;
  const percent = Math.round((sectionsComplete / sectionsTotal) * 100);

  return {
    percent,
    sectionsComplete,
    sectionsTotal,
    readinessLabel: getReadinessLabel(sectionsComplete, sectionsTotal),
    sectionComplete,
  };
}

/** @deprecated Use getProposalProgressSummary */
export function calculateProposalProgress(values) {
  return getProposalProgressSummary(values).percent;
}
