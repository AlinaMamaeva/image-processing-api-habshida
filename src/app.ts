import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import uploadRouter from "./routes/upload";
import processRouter from "./routes/process";
import fs from "fs";
import path from "path";

const app = express();

const uploadDir = process.env.UPLOAD_DIR || "uploads";

const uploadPath = path.join(process.cwd(), uploadDir);
const processedPath = path.join(process.cwd(), "processed");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
if (!fs.existsSync(processedPath)) {
  fs.mkdirSync(processedPath, { recursive: true });
}

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/processed", express.static(processedPath));
app.use("/api/upload", uploadRouter);
app.use("/api/process", processRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

const PORT = process.env.PORT || 3000;
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.status(400).json({
      message: err.message,
    });
  },
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
