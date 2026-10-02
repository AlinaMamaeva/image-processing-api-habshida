import multer from "multer";
import path from "path";
import { isAllowedFileType } from "../middleware/validation";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || "uploads";
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, uniqueName + extension);
  },
});

const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES || 5 * 1024 * 1024);
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (isAllowedFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

export default upload;
