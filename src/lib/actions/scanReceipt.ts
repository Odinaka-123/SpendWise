"use server";

import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function scanReceipt(imageBuffer: Buffer) {
  const [result] = await client.textDetection({
    image: {
      content: imageBuffer,
    },
  });

  const text = result.fullTextAnnotation?.text || "";

  return {
    rawText: text,
  };
}