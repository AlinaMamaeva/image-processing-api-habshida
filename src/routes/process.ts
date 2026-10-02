import { Router } from "express";
import {
  processImage,
  imageMetadata,
  watermarkImage,
  convertImageFormat,
} from "../controllers/processController";
import { validateProcessingOptions } from "../middleware/validation";

const router = Router();
router.post("/convert/:filename", convertImageFormat);
router.post("/:filename", validateProcessingOptions, processImage);
router.get("/metadata/:filename", imageMetadata);
router.post("/watermark/:filename", watermarkImage);
export default router;
