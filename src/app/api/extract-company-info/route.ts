import { NextRequest, NextResponse } from "next/server";

export interface ExtractedCompanyInfo {
  legalCompany?: string;
  dba?: string;
  website?: string;
  businessAddress?: string;
  phoneNumber?: string;
  email?: string;
}

const EXTRACTION_PROMPT = `You are an expert data extractor for A2P 10DLC brand registration forms and company profiles.
Extract the following company and contact details from the provided image.
Look carefully for light-grey text inside form input fields as well as multi-column layouts.
If the address is split across "Business Address", "City", "State", and "Zipcode" (or similar fields), combine them into one clean single-line string like: "2736 Maple Ave., Downers Grove, Illinois 60515".
For phoneNumber, keep only digits and an optional leading "+" (e.g. "+16309630080").
For website, include "https://" if a domain is present without a scheme.
Return ONLY a valid JSON object with these exact keys (use "" for any field not visible in the image):
{
  "legalCompany": "",
  "dba": "",
  "website": "",
  "businessAddress": "",
  "phoneNumber": "",
  "email": ""
}`;

function sanitizePhone(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return digits ? (hasPlus ? "+" : "") + digits : "";
}

function sanitizeWebsite(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, apiKey } = body as {
      imageBase64?: string;
      mimeType?: string;
      apiKey?: string;
    };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image data is required." },
        { status: 400 }
      );
    }

    const geminiKey = (apiKey && apiKey.trim()) || process.env.GEMINI_API_KEY;

    // If no Gemini API key is configured, signal client to use free Offline OCR
    if (!geminiKey) {
      return NextResponse.json({
        fallbackToOcr: true,
        reason: "No Gemini API key configured",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
    const resolvedMime = mimeType || "image/png";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        geminiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: EXTRACTION_PROMPT },
                {
                  inlineData: {
                    mimeType: resolvedMime,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({
        fallbackToOcr: true,
        geminiError: `Gemini API returned ${response.status}: ${errText.slice(0, 200)}`,
      });
    }

    const result = await response.json();
    const rawText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return NextResponse.json({
        fallbackToOcr: true,
        geminiError: "Empty response from Gemini",
      });
    }

    // Parse JSON (strip markdown fences if present)
    const cleanedJson = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedJson) as ExtractedCompanyInfo;

    const data: ExtractedCompanyInfo = {
      legalCompany: (parsed.legalCompany || "").trim(),
      dba: (parsed.dba || "").trim(),
      website: sanitizeWebsite(parsed.website || ""),
      businessAddress: (parsed.businessAddress || "").trim(),
      phoneNumber: sanitizePhone(parsed.phoneNumber || ""),
      email: (parsed.email || "").trim(),
    };

    return NextResponse.json({
      source: "gemini",
      data,
    });
  } catch (error) {
    console.error("Extract company info error:", error);
    return NextResponse.json({
      fallbackToOcr: true,
      geminiError: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
