import { Request, Response, NextFunction } from "express";

const allowedMimeTypes = (
  process.env.ALLOWED_FILE_TYPES ||
  "image/jpeg,image/png,image/webp"
).split(",");

export const isAllowedFileType = (
  mimetype: string,
  originalname?: string,
): boolean => {
  return allowedMimeTypes.includes(mimetype);
};

export const validateProcessingOptions = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { width, height, format, quality, fit } = req.body;
  const widthNumber = Number(width);
  const heightNumber = Number(height);

  if (
    !Number.isFinite(widthNumber) ||
    !Number.isFinite(heightNumber) ||
    widthNumber <= 0 ||
    heightNumber <= 0
  ) {
    return res.status(400).json({
      message: "Width and height must be positive numbers",
    });
  }

  const allowedFormats = ["jpeg", "png", "webp"];

  if (format && !allowedFormats.includes(format)) {
    return res.status(400).json({
      message: "Invalid image format",
    });
  }
  const allowedFits = ["cover", "contain", "fill", "inside", "outside"];

  if (fit && !allowedFits.includes(fit)) {
    return res.status(400).json({
      message: "Invalid fit option",
    });
  }
  const qualityNumber = Number(quality);

  if (
    quality !== undefined &&
    (!Number.isFinite(qualityNumber) ||
      qualityNumber < 1 ||
      qualityNumber > 100)
  ) {
    return res.status(400).json({
      message: "Quality must be between 1 and 100",
    });
  }

  next();
};
