import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CompanyInfo, ActiveDocType, getDefaultSampleMessagesList } from "../types/document";

// Exact colors matching Word Office Theme from user image
const COLOR_TITLE = [54, 96, 145] as const;      // #366091 - Word Title Blue
const COLOR_HEADING = [79, 129, 189] as const;   // #4F81BD - Word Heading Blue
const COLOR_TEXT = [26, 26, 26] as const;        // #1a1a1a - Body text
const COLOR_LINK = [17, 85, 204] as const;       // #1155cc - Link blue

export function generatePrivacyPolicyPdf(info: CompanyInfo): jsPDF {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Centered Title (#366091, Times Bold)
  doc.setFont("times", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...COLOR_TITLE);
  doc.text("Privacy Policy", pageWidth / 2, y, { align: "center" });
  y += 24;

  // 2. Centered Effective Date
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(`Effective Date: ${info.effectiveDate || "July 2026"}`, pageWidth / 2, y, { align: "center" });
  y += 26;

  // Helper for Section Headings (#4F81BD, Times Bold)
  const addHeading = (title: string) => {
    checkPage(35);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_HEADING);
    doc.text(title, margin, y);
    y += 18;
  };

  // Helper for Key-Value
  const addKeyValue = (key: string, value: string, isLink: boolean = false) => {
    if (!value) return;
    checkPage(18);
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    doc.text(key, margin, y);
    const keyWidth = doc.getTextWidth(key);

    doc.setFont("times", "normal");
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const splitVal = doc.splitTextToSize(value, contentWidth - keyWidth);
    doc.text(splitVal, margin + keyWidth, y);
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(value), contentWidth - keyWidth);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + keyWidth, y + 1.5, margin + keyWidth + lineLen, y + 1.5);
    }
    y += splitVal.length * 15;
  };

  // Helper for Body Paragraph
  const addParagraph = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPage(lines.length * 15 + 10);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 10;
  };

  // Helper for Bullets
  const addBullet = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    const bullet = "• ";
    const bulletWidth = doc.getTextWidth(bullet);
    const lines = doc.splitTextToSize(text, contentWidth - bulletWidth - 4);
    checkPage(lines.length * 15 + 4);
    doc.text(bullet, margin + 4, y);
    doc.text(lines, margin + 4 + bulletWidth, y);
    y += lines.length * 15 + 4;
  };

  // Contact Information
  addHeading("Contact Information");
  addKeyValue("Legal Company: ", info.legalCompany);
  addKeyValue("Website: ", info.website, true);
  addKeyValue("Business Address: ", info.businessAddress);
  addKeyValue("Phone number: ", info.phoneNumber);
  addKeyValue("Email: ", info.email);
  // Custom Dynamic Fields
  info.customFields?.forEach((f) => {
    addKeyValue(`${f.label}: `, f.value, f.isLink);
  });
  y += 10;

  // Information We Collect
  addHeading("Information We Collect");
  addParagraph(
    "We may collect your name, mobile phone number, email address, mailing address, employment or application information, communication preferences, and any information you voluntarily provide through our website, forms, phone calls, SMS conversations, or in-person interactions."
  );

  // How We Use Your Information
  addHeading("How We Use Your Information");
  addParagraph("We use your information to:");
  addBullet("Respond to customer inquiries and provide customer support.");
  addBullet("Send account notifications and service-related updates.");
  addBullet("Schedule interviews, appointments, and onboarding activities.");
  addBullet("Share job opportunities, hiring events, career resources, and other marketing communications when you have consented.");
  addBullet("Send public service announcements, including office closures, weather-related updates, emergency notifications, or other important service announcements.");
  addBullet("Maintain our records, improve our services, and comply with applicable laws.");
  y += 10;

  // SMS Communications
  addHeading("SMS Communications");
  addParagraph(
    "If you opt in to receive text messages, you may receive Customer Care, Account Notification, Marketing, and Public Service Announcement messages. Message frequency varies based on your interactions with us. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance."
  );

  // Consent
  addHeading("Consent");
  addParagraph(
    "Your consent to receive SMS messages is voluntary and is not a condition of employment or receiving our services. You may withdraw your consent at any time by replying STOP."
  );

  // Sharing of Information
  addHeading("Sharing of Information");
  addParagraph(
    "We do not sell, rent, or trade your personal information. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as necessary to provide messaging services."
  );

  // Data Security
  addHeading("Data Security");
  addParagraph(
    "We maintain reasonable administrative, technical, and physical safeguards designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction."
  );

  // Your Rights
  addHeading("Your Rights");
  addParagraph(
    "You may request to update or correct your personal information or ask questions regarding this Privacy Policy by contacting us using the information above."
  );

  // Changes to this Policy
  addHeading("Changes to this Policy");
  addParagraph(
    "We may update this Privacy Policy periodically. Any changes will be posted on our website with a revised effective date."
  );

  // Contact Us
  addHeading("Contact Us");
  addKeyValue("Website: ", info.website, true);
  addKeyValue("Phone: ", `${info.phoneNumber} | Email: ${info.email}`);
  info.customFields?.forEach((f) => {
    addKeyValue(`${f.label}: `, f.value, f.isLink);
  });

  return doc;
}

export function generateTermsPdf(info: CompanyInfo): jsPDF {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;
  const brand = info.dba.trim() || info.legalCompany;

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Centered Title (#366091, Times Bold)
  doc.setFont("times", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...COLOR_TITLE);
  doc.text("SMS Terms and Conditions", pageWidth / 2, y, { align: "center" });
  y += 24;

  // 2. Centered Effective Date
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(`Effective Date: ${info.effectiveDate || "July 2026"}`, pageWidth / 2, y, { align: "center" });
  y += 26;

  const addHeading = (title: string) => {
    checkPage(35);
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLOR_HEADING);
    doc.text(title, margin, y);
    y += 18;
  };

  const addKeyValue = (key: string, value: string, isLink: boolean = false) => {
    if (!value) return;
    checkPage(18);
    doc.setFont("times", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    doc.text(key, margin, y);
    const keyWidth = doc.getTextWidth(key);

    doc.setFont("times", "normal");
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const splitVal = doc.splitTextToSize(value, contentWidth - keyWidth);
    doc.text(splitVal, margin + keyWidth, y);
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(value), contentWidth - keyWidth);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + keyWidth, y + 1.5, margin + keyWidth + lineLen, y + 1.5);
    }
    y += splitVal.length * 15;
  };

  const addParagraph = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPage(lines.length * 15 + 10);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 10;
  };

  const addBullet = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_TEXT);
    const bullet = "• ";
    const bulletWidth = doc.getTextWidth(bullet);
    const lines = doc.splitTextToSize(text, contentWidth - bulletWidth - 4);
    checkPage(lines.length * 15 + 4);
    doc.text(bullet, margin + 4, y);
    doc.text(lines, margin + 4 + bulletWidth, y);
    y += lines.length * 15 + 4;
  };

  // Acceptance of SMS Terms
  addHeading("Acceptance of SMS Terms");
  addParagraph(
    `By providing your mobile phone number and opting in to receive SMS messages from ${brand}, you agree to these SMS Terms and Conditions. These terms govern all SMS communications sent by ${info.legalCompany}.`
  );

  // Business Information
  addHeading("Business Information");
  addKeyValue("Legal Company: ", info.legalCompany);
  addKeyValue("DBA: ", brand);
  addKeyValue("Website: ", info.website, true);
  addKeyValue("Business Address: ", info.businessAddress);
  addKeyValue("Phone: ", info.phoneNumber);
  addKeyValue("Email: ", info.email);
  info.customFields?.forEach((f) => {
    addKeyValue(`${f.label}: `, f.value, f.isLink);
  });
  y += 10;

  // Types of SMS Messages
  addHeading("Types of SMS Messages");
  addParagraph("If you opt in to receive SMS communications, you may receive messages related to:");
  addBullet("Customer Care (customer support, interview scheduling, appointment reminders, onboarding assistance, follow-up communications)");
  addBullet("Account Notifications (application status, account alerts, documentation reminders, employment updates)");
  addBullet("Marketing (job opportunities, hiring events, recruiting campaigns, promotions, career resources)");
  y += 10;

  // Sample Message – (Render all dynamic sample messages)
  checkPage(40);
  doc.setFont("times", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(...COLOR_TEXT);
  doc.text("Sample Message –", margin, y);
  y += 18;

  const samples = info.sampleMessages?.length ? info.sampleMessages : getDefaultSampleMessagesList(brand, info.website);

  samples.forEach((sample) => {
    checkPage(60);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.text("•", margin + 12, y);

    doc.setFont("times", "bold");
    const label = `${sample.title} - `;
    doc.text(label, margin + 26, y);
    const labelWidth = doc.getTextWidth(label);

    doc.setFont("times", "normal");
    const msgLines = doc.splitTextToSize(sample.message, contentWidth - 26 - labelWidth);
    doc.text(msgLines, margin + 26 + labelWidth, y);
    y += msgLines.length * 15 + 6;

    doc.text("Reply STOP to opt out or HELP for assistance.", margin + 4, y);
    y += 20;
  });

  // Message Frequency
  addHeading("Message Frequency");
  addParagraph(
    `Message frequency varies depending on your interactions with ${brand}, your employment status, and the services you have requested.`
  );

  // Message and Data Rates
  addHeading("Message and Data Rates");
  addParagraph("Standard message and data rates may apply based on your wireless carrier's plan.");

  // How to Opt In
  addHeading("How to Opt In");
  addParagraph(
    "You may opt in to receive SMS messages by completing a website form, employment application, signing a written consent form, providing verbal consent where permitted, or otherwise giving express consent to receive text messages."
  );

  // How to Opt Out
  addHeading("How to Opt Out");
  addParagraph(
    "You may opt out of receiving SMS messages at any time by replying STOP to any text message. After opting out, you will receive a final confirmation message and will no longer receive SMS communications unless you opt in again."
  );

  // Help
  addHeading("Help");
  addParagraph("Reply HELP to any SMS message for assistance, or contact us using the information listed above.");

  // Privacy
  addHeading("Privacy");
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_TEXT);
  const privText = `Your privacy is important to us. We do not sell, rent, or share your personal information with third parties for marketing purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as required to provide messaging services. For more information, please review our`;
  const plines = doc.splitTextToSize(privText, contentWidth);
  checkPage(plines.length * 15 + 24);
  doc.text(plines, margin, y);
  y += plines.length * 15 + 4;

  doc.setTextColor(...COLOR_LINK);
  doc.setFont("times", "bold");
  const privacyUrl =
    info.privacyPolicyUrl?.trim() ||
    `${(info.website || "").replace(/\/+$/, "")}/privacy-policy`;
  const policyLines = doc.splitTextToSize(privacyUrl, contentWidth - 12);
  checkPage(policyLines.length * 15 + 10);
  doc.text(policyLines, margin + 6, y);
  policyLines.forEach((line: string, idx: number) => {
    doc.setDrawColor(...COLOR_LINK);
    doc.setLineWidth(0.7);
    doc.line(margin + 6, y + idx * 15 + 1.5, margin + 6 + doc.getTextWidth(line), y + idx * 15 + 1.5);
  });
  y += policyLines.length * 15 + 6;

  // Supported Carriers
  addHeading("Supported Carriers");
  addParagraph("Wireless carriers are not liable for delayed or undelivered messages.");

  // Changes to These Terms
  addHeading("Changes to These Terms");
  addParagraph(
    "We reserve the right to modify these SMS Terms and Conditions at any time. Updated versions will be posted on our website with a revised effective date."
  );

  // Contact Us
  addHeading("Contact Us");
  addKeyValue("Website: ", info.website, true);
  addKeyValue("Phone: ", info.phoneNumber);
  addKeyValue("Email: ", info.email);
  info.customFields?.forEach((f) => {
    addKeyValue(`${f.label}: `, f.value, f.isLink);
  });

  return doc;
}

export function generateConsentPdf(info: CompanyInfo): jsPDF {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;
  const brand = info.dba.trim() || info.legalCompany;

  // Main Title (#366091, Times Bold)
  doc.setFont("times", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...COLOR_TITLE);
  const titleLines = doc.splitTextToSize("SMS Consent – Customer Care Opt-In Authorization", contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 25 + 6;

  // Subtitle / Brand
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(brand, margin, y);
  y += 24;

  // Information Block
  const addInfoLine = (label: string, value: string, isLink: boolean = false) => {
    if (!value) return;
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_TEXT);
    doc.text(label, margin, y);
    const lw = doc.getTextWidth(label);
    
    doc.setFont("times", "normal");
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const valLines = doc.splitTextToSize(value, contentWidth - lw);
    doc.text(valLines, margin + lw, y);
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(value), contentWidth - lw);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + lw, y + 1.5, margin + lw + lineLen, y + 1.5);
    }
    y += valLines.length * 16 + 4;
  };

  addInfoLine("Legal Company: ", info.legalCompany);
  addInfoLine("Website: ", info.website, true);
  addInfoLine("Business Address: ", info.businessAddress);
  info.customFields?.forEach((f) => {
    addInfoLine(`${f.label}: `, f.value, f.isLink);
  });
  y += 14;

  // Body text
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_TEXT);
  const intro = `By providing your phone number and signing this form, you expressly consent to receive SMS/text messages from ${brand} for Customer Care purposes. You may receive:`;
  const introLines = doc.splitTextToSize(intro, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 16 + 10;

  // Bullets
  const bulletItems = [
    "Customer support communications",
    "Application updates",
    "Interview scheduling",
    "Appointment reminders",
    "Employment onboarding assistance",
    "Account notifications",
    "Follow-up communications",
  ];

  bulletItems.forEach((b) => {
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_TEXT);
    doc.text("•  " + b, margin + 8, y);
    y += 18;
  });
  y += 12;

  // SMS Disclosure Section
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...COLOR_HEADING);
  doc.text("SMS Disclosure", margin, y);
  y += 20;

  const disclosureItems = [
    "Message and data rates may apply.",
    "Message frequency may vary.",
    "Reply HELP for assistance.",
    "Reply STOP at any time to opt out.",
    "Consent is not a condition of employment.",
    "We do not share mobile numbers with third parties for marketing.",
  ];

  disclosureItems.forEach((item) => {
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_TEXT);
    doc.text("•  " + item, margin + 8, y);
    y += 18;
  });
  y += 14;

  // Privacy Policy Link
  const privacyUrl = info.privacyPolicyUrl || `${info.website}/privacy-policy`;
  const termsUrl = info.termsUrl || `${info.website}/terms-and-conditions`;

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_TEXT);
  doc.text("Privacy Policy: ", margin, y);
  const privW = doc.getTextWidth("Privacy Policy: ");
  doc.setFont("times", "normal");
  doc.setTextColor(...COLOR_LINK);
  const pLines = doc.splitTextToSize(privacyUrl, contentWidth - privW);
  doc.text(pLines, margin + privW, y);
  doc.setDrawColor(...COLOR_LINK);
  doc.setLineWidth(0.7);
  doc.line(margin + privW, y + 1.5, margin + privW + Math.min(doc.getTextWidth(privacyUrl), contentWidth - privW), y + 1.5);

  // PAGE 2
  doc.addPage();
  y = margin + 15;

  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_TEXT);
  doc.text("Terms & Conditions: ", margin, y);
  const termW = doc.getTextWidth("Terms & Conditions: ");
  doc.setFont("times", "normal");
  doc.setTextColor(...COLOR_LINK);
  const tLines = doc.splitTextToSize(termsUrl, contentWidth - termW);
  doc.text(tLines, margin + termW, y);
  doc.setDrawColor(...COLOR_LINK);
  doc.setLineWidth(0.7);
  doc.line(margin + termW, y + 1.5, margin + termW + Math.min(doc.getTextWidth(termsUrl), contentWidth - termW), y + 1.5);
  y += tLines.length * 16 + 24;

  // Checkboxes
  doc.setTextColor(...COLOR_TEXT);
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(1);

  doc.rect(margin, y - 9, 12, 12);
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text("I have read and accept.", margin + 22, y);
  y += 24;

  doc.rect(margin, y - 9, 12, 12);
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text("I have read and decline.", margin + 22, y);
  y += 40;

  // Signature lines
  const fields = [
    "Customer Name:",
    "Best Phone Number:",
    "Email Address:",
    "Customer Signature:",
    "Today's Date:",
  ];

  fields.forEach((field) => {
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_TEXT);
    doc.text(field, margin, y);
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.8);
    doc.line(margin + 140, y, margin + contentWidth, y);
    y += 34;
  });

  return doc;
}

export function downloadPdfFromEditedElement(
  type: ActiveDocType,
  info: CompanyInfo,
  rootEl: HTMLElement
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const blocks = rootEl.querySelectorAll("h1, h2, h3, p, li");
  blocks.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) return;

    if (tag === "h1") {
      checkPage(34);
      doc.setFont("times", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...COLOR_TITLE);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, pageWidth / 2, y, { align: "center" });
      y += lines.length * 24 + 4;
    } else if (tag === "h2" || tag === "h3") {
      y += 4;
      checkPage(26);
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...COLOR_HEADING);
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 17 + 4;
    } else if (tag === "li") {
      doc.setFont("times", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...COLOR_TEXT);
      const lines = doc.splitTextToSize(text, contentWidth - 16);
      checkPage(lines.length * 15 + 4);
      doc.text("•", margin + 4, y);
      doc.text(lines, margin + 16, y);
      y += lines.length * 15 + 3;
    } else {
      const isCentered =
        el.classList.contains("text-center") ||
        text.toLowerCase().startsWith("effective date:");
      doc.setFont("times", isCentered ? "bold" : "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...COLOR_TEXT);
      const lines = doc.splitTextToSize(text, contentWidth);
      checkPage(lines.length * 15 + 4);
      if (isCentered) {
        doc.text(lines, pageWidth / 2, y, { align: "center" });
      } else {
        doc.text(lines, margin, y);
      }
      y += lines.length * 15 + 4;
    }
  });

  const cleanName = (info.dba || info.legalCompany).replace(/[^a-zA-Z0-9]/g, "_");
  const prefix =
    type === "privacy"
      ? "Privacy_Policy"
      : type === "terms"
        ? "SMS_Terms_and_Conditions"
        : "SMS_Consent_Authorization";
  doc.save(`${prefix}_${cleanName}.pdf`);
}

export function downloadPdf(type: ActiveDocType, info: CompanyInfo) {
  let doc: jsPDF;
  let filename = "";
  const cleanName = (info.dba || info.legalCompany).replace(/[^a-zA-Z0-9]/g, "_");

  switch (type) {
    case "privacy":
      doc = generatePrivacyPolicyPdf(info);
      filename = `Privacy_Policy_${cleanName}.pdf`;
      break;
    case "terms":
      doc = generateTermsPdf(info);
      filename = `SMS_Terms_and_Conditions_${cleanName}.pdf`;
      break;
    case "consent":
      doc = generateConsentPdf(info);
      filename = `SMS_Consent_Authorization_${cleanName}.pdf`;
      break;
  }

  doc.save(filename);
}

export async function downloadAllPdfsZip(info: CompanyInfo) {
  const zip = new JSZip();
  const cleanName = (info.dba || info.legalCompany).replace(/[^a-zA-Z0-9]/g, "_");

  const pDoc = generatePrivacyPolicyPdf(info);
  const tDoc = generateTermsPdf(info);
  const cDoc = generateConsentPdf(info);

  zip.file(`1_Privacy_Policy_${cleanName}.pdf`, pDoc.output("blob"));
  zip.file(`2_SMS_Terms_and_Conditions_${cleanName}.pdf`, tDoc.output("blob"));
  zip.file(`3_SMS_Consent_Authorization_${cleanName}.pdf`, cDoc.output("blob"));

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `Compliance_Documents_${cleanName}.zip`);
}
