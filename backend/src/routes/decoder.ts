import express from "express";
import { getDecodedReport } from "../controllers/decoder";

const router = express.Router();

router.get("/:reportCode", getDecodedReport);

// module.exports = router;
export default router;
