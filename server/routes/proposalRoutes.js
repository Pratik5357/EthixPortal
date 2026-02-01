import express from "express";
import {
  saveDraft,
  submitProposal,
  uploadDocument,
  resubmitProposal,
  getProposalById,
  updateProposal,
  getProposalForReview,
  addReviewComment,
  downloadDocuments,
} from "../controllers/proposalController.js";
import { authenticate, optionalAuthenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/draft",
  authenticate,
  authorizeRoles("researcher"),
  saveDraft
);

router.post(
  "/:proposalId/submit",
  authenticate,
  authorizeRoles("researcher"),
  submitProposal
);

router.post(
  "/:proposalId/upload",
  authenticate,
  authorizeRoles("researcher"),
  upload.single("file"),
  uploadDocument
);

router.get(
  "/:id",
  optionalAuthenticate,
  getProposalById
);

router.get(
  "/:id/download",
  authenticate,
  downloadDocuments
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("researcher"),
  updateProposal
);

router.post(
  "/:id/resubmit",
  authenticate,
  authorizeRoles("researcher"),
  resubmitProposal
);

router.get("/:proposalId/review", authenticate, authorizeRoles("reviewer"), getProposalForReview);
router.post("/:proposalId/review/comment", authenticate, authorizeRoles("reviewer"), addReviewComment);

export default router;