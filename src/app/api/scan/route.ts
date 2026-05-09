import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

import credentials from "@/lib/google/vision-key.json";

const client = new vision.ImageAnnotatorClient({
  credentials,
});

function extractAmount(text: string) {
  const matches = text.match(/(?:₦|NGN)?\s?(\d+[.,]?\d{0,2})/g);

  if (!matches) return "";

  const nums = matches
    .map((m) => Number(m.replace(/[^\d.]/g, "")))
    .filter((n) => !isNaN(n));

  return nums.length ? String(Math.max(...nums)) : "";
}

function extractDate(text: string) {
  const match = text.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/);

  if (!match) {
    return new Date().toISOString().split("T")[0];
  }

  return match[0];
}

function extractMerchant(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines[0] || "Unknown Merchant";
}

function detectCategory(name: string) {
  const lower = name.toLowerCase();

  if (
    lower.includes("shoprite") ||
    lower.includes("market")
  ) {
    return "Groceries";
  }

  if (
    lower.includes("uber") ||
    lower.includes("bolt")
  ) {
    return "Transport";
  }

  if (
    lower.includes("kfc") ||
    lower.includes("restaurant")
  ) {
    return "Dining";
  }

  return "Other";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();

    const [result] = await client.textDetection({
      image: {
        content: Buffer.from(bytes),
      },
    });

    const text =
      result.fullTextAnnotation?.text || "";

    const name = extractMerchant(text);
    const amount = extractAmount(text);
    const date = extractDate(text);
    const category = detectCategory(name);

    return NextResponse.json({
      success: true,
      data: {
        name,
        amount,
        date,
        category,
        rawText: text,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "OCR failed" },
      { status: 500 },
    );
  }
}