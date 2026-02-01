import express from "express";
import {
  getAllReviewers,
  getProposalsForAssignment,
  assignReviewers,
  verifyProposal
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/reviewers",
  authenticate,
  authorizeRoles("admin"),
  getAllReviewers
);

router.get(
  "/proposals",
  authenticate,
  authorizeRoles("admin"),
  getProposalsForAssignment
);

router.post(
  "/proposals/:id/verify",
  authenticate,
  authorizeRoles("admin"),
  verifyProposal
);

router.post(
  "/proposals/:id/assign-reviewers",
  authenticate,
  authorizeRoles("admin"),
  assignReviewers
);

export default router;