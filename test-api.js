const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

const API_URL = "http://localhost:3000";
const TEST_IMAGE = `${process.env.HOME}/Desktop/cat.jpg`;

async function testUpload() {
  const form = new FormData();

  form.append(
    "file",
    fs.createReadStream(TEST_IMAGE),
  );

  const response = await axios.post(
    `${API_URL}/api/upload/single`,
    form,
    {
      headers: form.getHeaders(),
    },
  );

  console.log("✅ Upload:", response.data);

  return response.data.file.filename;
}

async function testProcess(filename) {
  const response = await axios.post(
    `${API_URL}/api/process/${filename}`,
    {
      width: 800,
      height: 600,
      format: "webp",
      quality: 85,
      sharpen: true,
      fit: "contain",
    },
  );

  console.log("✅ Process:", response.data);
}

async function testResponsive() {
  const form = new FormData();

  form.append(
    "image",
    fs.createReadStream(TEST_IMAGE),
  );

  const response = await axios.post(
    `${API_URL}/api/upload/responsive`,
    form,
    {
      headers: form.getHeaders(),
    },
  );

  console.log("✅ Responsive:", response.data);
}

async function runTests() {
  try {
    const filename = await testUpload();

    await testProcess(filename);
    await testResponsive();

    console.log("\n🎉 All API tests passed!");
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data || error.message,
    );
  }
}

runTests();