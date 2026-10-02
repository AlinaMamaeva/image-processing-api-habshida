import { Router } from "express";
import upload from "../config/multer";
import {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadFields,
  getFiles,
  getFile,
  deleteFile,
  uploadResponsiveImage,
} from "../controllers/uploadController";

const router = Router();

router.post("/single", upload.single("file"), uploadSingleFile);
router.post("/multiple", upload.array("files", 5), uploadMultipleFiles);
router.post(
  "/fields",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  uploadFields,
);
router.get("/files", getFiles);
router.get("/file/:filename", getFile);
router.delete("/file/:filename", deleteFile);
router.post("/responsive", upload.single("image"), uploadResponsiveImage);

export default router;
