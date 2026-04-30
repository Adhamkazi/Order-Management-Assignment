import { Router } from "express";
import { getMenu } from "../controllers/menu.controller";

const router = Router();

// GET /api/menu
router.get("/", getMenu);

export default router;
