import { Router } from "express";
import { PagesController } from "../controllers/pages.controller.js";
import { upload } from "../utils/multier.utils.js";
export const router = Router();
const pages = new PagesController();
router.get("/pages", pages.page);
router.get("/pages/:id", pages.pages);
router.post("/upload", upload.single("file"), pages.file);
