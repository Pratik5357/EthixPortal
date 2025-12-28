import express from "express";
import {
  saveDraft,
  submitProposal,
  uploadDocument,
  resubmitProposal,
  getProposalById, 
  updateProposal,
} from "../controllers/proposalController.js";
import { authenticate } from "../middleware/authMiddleware.js";
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
  authenticate,
  getProposalById
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

export default router;