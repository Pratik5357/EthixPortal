import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { approvedProposals } from "../controllers/documentController.js";

const router = express.Router();

router.get("/approved", authenticate, approvedProposals);

export default router;