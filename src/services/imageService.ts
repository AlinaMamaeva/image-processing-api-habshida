import sharp from "sharp";
import path from "path";
import { responsiveSizes, defaultImageQuality } from "../config/sharp";

export const resizeImage = async (
  filename: string,
  width: number,
  height: number,
  format: "jpeg" | "png" | "webp" = "jpeg",
  quality: number = defaultImageQuality,
  shouldSharpen: boolean = false,
  fit: "cover" | "contain" | "fill" | "inside" | "outside" = "cover",
) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const nameWithoutExtension = path.parse(filename).name;
  const outputFilename = `resized-${nameWithoutExtension}.${format}`;

  const outputPath = path.join(process.cwd(), "processed", outputFilename);

  let image = sharp(inputPath).resize(width, height, {
    fit,
  });

  if (shouldSharpen) {
    image = image.sharpen();
  }

  if (format === "webp") {
    image = image.webp({ quality });
  } else if (format === "png") {
    image = image.png({ quality });
  } else {
    image = image.jpeg({ quality });
  }

  await image.toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
  };
};

export const createResponsiveImages = async (filename: string) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const results = [];

  for (const width of responsiveSizes) {
    const nameWithoutExtension = path.parse(filename).name;

    const outputFilename = `${nameWithoutExtension}-${width}.webp`;

    const outputPath = path.join(process.cwd(), "processed", outputFilename);

    await sharp(inputPath)
      .resize({ width })
      .webp({ quality: defaultImageQuality })
      .toFile(outputPath);

    results.push({
      width,
      filename: outputFilename,
      path: outputPath,
    });
  }

  return results;
};

export const getImageMetadata = async (filename: string) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const metadata = await sharp(inputPath).metadata();

  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    space: metadata.space,
    channels: metadata.channels,
    size: metadata.size,
  };
};
export const addWatermark = async (filename: string, text: string) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const nameWithoutExtension = path.parse(filename).name;

  const outputFilename = `watermarked-${nameWithoutExtension}.png`;

  const outputPath = path.join(process.cwd(), "processed", outputFilename);

  const watermark = Buffer.from(`
    <svg width="500" height="100">
      <text
        x="20"
        y="60"
        font-size="40"
        fill="white"
      >
        ${text}
      </text>
    </svg>
  `);

  await sharp(inputPath)
    .composite([
      {
        input: watermark,
        gravity: "southeast",
      },
    ])
    .png()
    .toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
  };
};

export const convertImage = async (
  filename: string,
  format: "jpeg" | "png" | "webp",
  quality: number = defaultImageQuality,
) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const nameWithoutExtension = path.parse(filename).name;

  const outputFilename = `converted-${nameWithoutExtension}.${format}`;

  const outputPath = path.join(process.cwd(), "processed", outputFilename);

  let image = sharp(inputPath);

  if (format === "webp") {
    image = image.webp({ quality });
  } else if (format === "png") {
    image = image.png({ quality });
  } else {
    image = image.jpeg({ quality });
  }

  await image.toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
  };
};
export const createThumbnail = async (filename: string) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";

  const inputPath = path.join(process.cwd(), uploadDir, filename);

  const nameWithoutExtension = path.parse(filename).name;

  const outputFilename = `thumbnail-${nameWithoutExtension}.webp`;

  const outputPath = path.join(
    process.cwd(),
    "processed",
    outputFilename,
  );

  await sharp(inputPath)
    .resize(150, 150, {
      fit: "cover",
    })
    .webp({ quality: defaultImageQuality })
    .toFile(outputPath);

  return {
    filename: outputFilename,
    path: outputPath,
    width: 150,
    height: 150,
  };
};