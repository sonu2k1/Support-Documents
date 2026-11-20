import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, webhookUrl } = body;

    const targetUrl = webhookUrl || "https://script.google.com/a/macros/emitrr.com/s/AKfycbxwWOIA3j-zT097hVF3pUHqigm5e6b9AHurtxSSmk1rU2F_7xY_6zGJIQvigSCzxWlmTw/exec";

    // Call Google Apps Script Web App
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title || "Compliance Document",
        content: content || "",
      }),
      redirect: "follow",
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If it returned HTML or redirect
      if (text.includes("ServiceLogin") || text.includes("accounts.google.com")) {
        return NextResponse.json({
          success: false,
          error: "AUTH_REQUIRED",
          message: "The Google Apps Script requires authorization. Please ensure 'Who has access' is set to 'Anyone' in deployment settings.",
        }, { status: 401 });
      }
      return NextResponse.json({
        success: false,
        error: "INVALID_RESPONSE",
        raw: text.slice(0, 300),
      }, { status: 500 });
    }

    if (data && data.url) {
      return NextResponse.json({
        success: true,
        url: data.url,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating Google Doc:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to call Google Apps Script",
    }, { status: 500 });
  }
}
