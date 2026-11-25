import { createWorker } from "tesseract.js";

export interface ExtractedCompanyInfo {
  legalCompany?: string;
  dba?: string;
  website?: string;
  businessAddress?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ExtractionResult {
  data: ExtractedCompanyInfo;
  source: "gemini" | "ocr";
  filledCount: number;
  note?: string;
}

interface OcrSegment {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Convert a File/Blob into a base64 data URL.
 */
export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Preprocess image on an offscreen canvas:
 * - Upscale screenshots so small 10DLC form fonts become crisp
 * - Stretch contrast on light-grey form text so muted input values become dark & readable
 */
function preprocessImageForOcr(
  dataUrl: string
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale =
        img.width < 2200 ? Math.min(2.6, 2400 / Math.max(img.width, 1)) : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;

      // Boost contrast for light-grey text on light backgrounds
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        let v: number;
        if (lum >= 242) {
          v = 255;
        } else if (lum <= 105) {
          v = 0;
        } else {
          const norm = (lum - 105) / (242 - 105);
          v = Math.round(Math.pow(norm, 2.0) * 255);
        }
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve({ canvas, width: w, height: h });
    };
    img.onerror = () => reject(new Error("Failed to load image for OCR"));
    img.src = dataUrl;
  });
}

function cleanPhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 ? (hasPlus ? "+" : "") + digits : "";
}

function cleanWebsite(raw: string): string {
  const trimmed = raw.trim().replace(/[|,;]+$/, "").replace(/\s+/g, "");
  if (!trimmed) return "";
  // Fix common OCR scheme typos like hetps:// or http;//
  const fixedScheme = trimmed
    .replace(/^h[a-z]{2,4}ps?:[\/;]+/i, "https://")
    .replace(/^https?:\/\/+/i, "https://");
  if (/^https?:\/\//i.test(fixedScheme)) return fixedScheme;
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(fixedScheme)) {
    return `https://${fixedScheme}`;
  }
  return fixedScheme;
}

function isHelperOrLabelNoise(text: string): boolean {
  const t = text.toLowerCase().trim();
  // Ignore tiny 1-2 char OCR artifacts / sidebar icons (e.g. '2]', '"', '8')
  if (t.replace(/[^a-z0-9]/g, "").length < 2) return true;
  // Ignore common left-sidebar navigation labels
  if (
    /^(®\s*)?(support|settings|contacts|forms|reputation|ai agents|workflows|text campaigns|metrics|texting|phone|all conversations|scheduled messages|profile settings)$/i.test(
      t
    )
  ) {
    return true;
  }
  return (
    t.startsWith("make sure") ||
    t.startsWith("provide a") ||
    t.startsWith("enter the") ||
    t.startsWith("please select") ||
    t.startsWith("please provide") ||
    t.startsWith("this email") ||
    t.startsWith("valid phone") ||
    t.includes("tax id") ||
    t.includes("doing business") ||
    t.includes("online presence") ||
    t.includes("10dlc registration") ||
    t.includes("legal suffix") ||
    t.includes("associated with")
  );
}

/**
 * Split a Tesseract line's words into separate column segments wherever there is a wide horizontal gap.
 */
function splitLineIntoSegments(
  words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>
): OcrSegment[] {
  if (!words || words.length === 0) return [];

  const sorted = [...words]
    .filter((w) => w.text && w.text.trim())
    .sort((a, b) => a.bbox.x0 - b.bbox.x0);
  if (sorted.length === 0) return [];

  const segments: OcrSegment[] = [];
  let group = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const h = Math.max(prev.bbox.y1 - prev.bbox.y0, curr.bbox.y1 - curr.bbox.y0, 12);
    const gap = curr.bbox.x0 - prev.bbox.x1;

    // Wide horizontal gap indicates a separate column/field on the same row
    if (gap > Math.max(36, h * 2.6)) {
      segments.push({
        text: group.map((w) => w.text.trim()).join(" "),
        x0: Math.min(...group.map((w) => w.bbox.x0)),
        y0: Math.min(...group.map((w) => w.bbox.y0)),
        x1: Math.max(...group.map((w) => w.bbox.x1)),
        y1: Math.max(...group.map((w) => w.bbox.y1)),
      });
      group = [curr];
    } else {
      group.push(curr);
    }
  }

  segments.push({
    text: group.map((w) => w.text.trim()).join(" "),
    x0: Math.min(...group.map((w) => w.bbox.x0)),
    y0: Math.min(...group.map((w) => w.bbox.y0)),
    x1: Math.max(...group.map((w) => w.bbox.x1)),
    y1: Math.max(...group.map((w) => w.bbox.y1)),
  });

  return segments;
}

/**
 * Find the input value segment visually positioned below a given label segment
 * within the same horizontal column.
 */
function findValueBelowLabel(
  segments: OcrSegment[],
  labelRegex: RegExp,
  pageWidth: number
): string {
  const label = segments.find((s) => labelRegex.test(s.text));
  if (!label) return "";

  const labelHeight = Math.max(label.y1 - label.y0, 14);
  const maxY = label.y1 + labelHeight * 8.5;

  const candidates = segments
    .filter((s) => {
      if (s === label) return false;
      if (s.y0 <= label.y1 - 2 || s.y0 > maxY) return false;
      // Must be horizontally aligned with the label's column (left edge near label.x0)
      if (Math.abs(s.x0 - label.x0) > pageWidth * 0.18 && s.x0 < label.x0 - 30) {
        return false;
      }
      // Also avoid picking up the adjacent column on the right
      if (s.x0 > label.x0 + pageWidth * 0.25) return false;

      const txt = s.text.trim();
      if (!txt || isHelperOrLabelNoise(txt)) return false;
      return true;
    })
    .sort((a, b) => a.y0 - b.y0);

  return candidates.length > 0 ? candidates[0].text.trim() : "";
}

/**
 * Run free offline Tesseract OCR and parse 10DLC Brand Registration & general company screenshots.
 */
async function extractWithOfflineOcr(
  dataUrl: string
): Promise<ExtractedCompanyInfo> {
  const { canvas, width } = await preprocessImageForOcr(dataUrl);

  const worker = await createWorker("eng");
  let rawText = "";
  const segments: OcrSegment[] = [];

  try {
    const result = await worker.recognize(
      canvas,
      {},
      { blocks: true, text: true }
    );
    rawText = result.data.text || "";

    const blocks = result.data.blocks || [];
    for (const block of blocks) {
      for (const para of block.paragraphs || []) {
        for (const line of para.lines || []) {
          const lineSegs = splitLineIntoSegments(line.words || []);
          segments.push(...lineSegs);
        }
      }
    }
  } finally {
    await worker.terminate();
  }

  const legalCompany = findValueBelowLabel(
    segments,
    /legal\s*company\s*name/i,
    width
  );
  const dba = findValueBelowLabel(
    segments,
    /dba\s*(or|\/)?\s*brand\s*nam[ea]/i,
    width
  );

  let website = findValueBelowLabel(segments, /^webs[il1]te\b/i, width);
  if (!website) {
    const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) website = urlMatch[0];
  }
  website = cleanWebsite(website);

  let email = findValueBelowLabel(
    segments,
    /(business|contact)\s*ema[il1]/i,
    width
  );
  const normalizeEmailStr = (s: string) =>
    s.replace(/(@[a-zA-Z0-9-]+)\s+(com|org|net|io|co|us|edu|gov)\b/gi, "$1.$2");
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatchFromLabel = normalizeEmailStr(email).match(emailRegex);
  const emailMatchFromRaw = normalizeEmailStr(rawText).match(emailRegex);
  email = emailMatchFromLabel
    ? emailMatchFromLabel[0]
    : emailMatchFromRaw
      ? emailMatchFromRaw[0]
      : "";

  let phoneNumber = findValueBelowLabel(
    segments,
    /(contact\s*)?phone\s*number/i,
    width
  );
  if (!cleanPhone(phoneNumber)) {
    const phoneMatch = rawText.match(/\+?\d[\d\s\-()]{8,16}\d/);
    if (phoneMatch) phoneNumber = phoneMatch[0];
  }
  phoneNumber = cleanPhone(phoneNumber);

  // Address components (10DLC form has Business Address, City, State, Zipcode)
  const street = findValueBelowLabel(segments, /business\s*address/i, width);
  const city = findValueBelowLabel(segments, /^c[il1]ty\b/i, width);
  const state = findValueBelowLabel(segments, /^state\b/i, width);
  let zipcode = findValueBelowLabel(segments, /z[il1]p\s*code/i, width);
  if (zipcode) {
    const zipMatch = zipcode.match(/\b\d{4,5}(?:-\d{4})?\b/);
    if (zipMatch) zipcode = zipMatch[0];
  }

  const addressParts = [street, city, state]
    .map((s) => s.trim())
    .filter(Boolean);
  let businessAddress = addressParts.join(", ");
  if (zipcode.trim()) {
    businessAddress = businessAddress
      ? `${businessAddress} ${zipcode.trim()}`
      : zipcode.trim();
  }

  return {
    legalCompany: legalCompany.trim(),
    dba: dba.trim(),
    website,
    businessAddress,
    phoneNumber,
    email: email.trim(),
  };
}

/**
 * Hybrid extractor:
 * 1. Tries Gemini Vision API via /api/extract-company-info if an API key is configured.
 * 2. Automatically falls back to free offline Tesseract OCR if no key is set or API fails.
 */
export async function extractCompanyInfoFromImage(
  file: Blob,
  geminiApiKey?: string
): Promise<ExtractionResult> {
  const dataUrl = await fileToDataUrl(file);
  const mimeType = file.type || "image/png";

  try {
    const res = await fetch("/api/extract-company-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: dataUrl,
        mimeType,
        apiKey: geminiApiKey || undefined,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.source === "gemini" && json.data) {
        const filledCount = Object.values(
          json.data as ExtractedCompanyInfo
        ).filter((v) => typeof v === "string" && v.trim().length > 0).length;
        return {
          data: json.data,
          source: "gemini",
          filledCount,
        };
      }
    }
  } catch (err) {
    console.warn("Gemini API unreachable, falling back to Offline OCR:", err);
  }

  // Fallback: 100% Free Offline OCR
  const ocrData = await extractWithOfflineOcr(dataUrl);
  const filledCount = Object.values(ocrData).filter(
    (v) => typeof v === "string" && v.trim().length > 0
  ).length;

  return {
    data: ocrData,
    source: "ocr",
    filledCount,
  };
}
