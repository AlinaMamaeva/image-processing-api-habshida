import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createResponsiveImages } from "../services/imageService";

export const uploadSingleFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  return res.status(201).json({
    message: "File uploaded successfully",
    file: req.file,
  });
};

export const uploadMultipleFiles = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "No files uploaded",
    });
  }

  return res.status(201).json({
    message: "Files uploaded successfully",
    files: files,
  });
};
export const uploadFields = (req: Request, res: Response) => {
  const files = req.files;

  if (!files) {
    return res.status(400).json({
      message: "No files uploaded",
    });
  }

  return res.status(201).json({
    message: "Files uploaded successfully",
    files: files,
  });
};

export const getFiles = (req: Request, res: Response) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({
        message: "Unable to read files",
      });
    }

    return res.status(200).json({
      files: files,
    });
  });
};

export const getFile = (req: Request<{ filename: string }>, res: Response) => {
  const { filename } = req.params;
  if (filename !== path.basename(filename)) {
    return res.status(400).json({
      message: "Invalid filename",
    });
  }
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const filePath = path.join(process.cwd(), uploadDir, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).json({
        message: "File not found",
      });
    }
  });
};
export const deleteFile = (
  req: Request<{ filename: string }>,
  res: Response,
) => {
  const { filename } = req.params;
  if (filename !== path.basename(filename)) {
    return res.status(400).json({
      message: "Invalid filename",
    });
  }
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const filePath = path.join(process.cwd(), uploadDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.status(200).json({
      message: "File deleted successfully",
    });
  });
};

export const uploadResponsiveImage = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const responsive = await createResponsiveImages(
      req.file.filename,
    );

    return res.status(201).json({
      message: "Responsive images created successfully",
      original: req.file.filename,
      responsive,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create responsive images",
    });
  }
};