# Image Processing API

A TypeScript and Express API for uploading and processing images with Multer and Sharp.

## Features

- Upload images
- Resize images
- Convert JPEG, PNG, and WebP
- Image quality and sharpening
- Responsive images (320px, 640px, 1024px)
- Image metadata
- Watermarks
- File validation

## Technologies

- Node.js
- TypeScript
- Express
- Multer
- Sharp

## Run

```bash
npm install
npm run dev
```

Server:

```text
http://localhost:3000
```

## Main Endpoints

```text
POST /api/upload/single
POST /api/upload/responsive

POST /api/process/:filename
POST /api/process/convert/:filename
POST /api/process/watermark/:filename

GET /api/process/metadata/:filename
GET /health
```

## Test

Run the server first:

```bash
npm run dev
```

Then in another terminal:

```bash
npm run test-api
```

Successful result:

```text
🎉 All API tests passed!
```