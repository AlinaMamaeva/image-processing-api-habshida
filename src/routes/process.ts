import { Router } from "express";
import {
  processImage,
  imageMetadata,
  watermarkImage,
  convertImageFormat,
  thumbnailImage,
} from "../controllers/processController";
import { validateProcessingOptions } from "../middleware/validation";

const router = Router();

router.post("/convert/:filename", convertImageFormat);
router.post("/thumbnail/:filename", thumbnailImage);
router.post("/:filename", validateProcessingOptions, processImage);
router.get("/metadata/:filename", imageMetadata);
router.post("/watermark/:filename", watermarkImage);
export default router;
