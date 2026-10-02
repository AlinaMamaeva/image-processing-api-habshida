import { Request, Response } from "express";
import {
  resizeImage,
  getImageMetadata,
  addWatermark,
    convertImage,
} from "../services/imageService";

export const processImage = async (
  req: Request<{ filename: string }>,
  res: Response,
) => {
  try {
    const { filename } = req.params;

    const { width, height, format, quality, sharpen, fit } = req.body;

    const result = await resizeImage(
      filename,
      Number(width),
      Number(height),
      format,
      Number(quality),
      Boolean(sharpen),
      fit,
    );

    return res.status(200).json({
      message: "Image processed successfully",
      file: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Image processing failed",
    });
  }
};
export const imageMetadata = async (
  req: Request<{ filename: string }>,
  res: Response,
) => {
  try {
    const { filename } = req.params;

    const metadata = await getImageMetadata(filename);

    return res.status(200).json({
      message: "Image metadata retrieved successfully",
      metadata,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get image metadata",
    });
  }
};

export const watermarkImage = async (
  req: Request<{ filename: string }>,
  res: Response,
) => {
  try {
    const { filename } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Watermark text is required",
      });
    }

    const result = await addWatermark(filename, text);

    return res.status(200).json({
      message: "Watermark added successfully",
      file: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add watermark",
    });
  }
};
export const convertImageFormat = async (
  req: Request<{ filename: string }>,
  res: Response,
) => {
  try {
    const { filename } = req.params;
    const { format, quality } = req.body;

    if (!["jpeg", "png", "webp"].includes(format)) {
      return res.status(400).json({
        message: "Invalid image format",
      });
    }

    const qualityNumber =
      quality === undefined ? 80 : Number(quality);

    if (
      !Number.isFinite(qualityNumber) ||
      qualityNumber < 1 ||
      qualityNumber > 100
    ) {
      return res.status(400).json({
        message: "Quality must be between 1 and 100",
      });
    }

    const result = await convertImage(
      filename,
      format,
      qualityNumber,
    );

    return res.status(200).json({
      message: "Image converted successfully",
      file: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Image conversion failed",
    });
  }
};