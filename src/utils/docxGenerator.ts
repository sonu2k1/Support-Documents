import { Document, Paragraph, TextRun, HeadingLevel, Packer } from "docx";
import { CompanyInfo, getDefaultSampleMessagesList } from "../types/document";

export function generatePrivacyPolicyDocx(info: CompanyInfo): Document {
  const customChildren = (info.customFields || []).map(
    (f) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${f.label}: `, bold: true }),
          new TextRun(f.value),
        ],
        spacing: { after: 60 },
      })
  );

  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Privacy Policy",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Effective Date: ", bold: true }),
              new TextRun(info.effectiveDate || "July 2026"),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Contact Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Legal Company: ", bold: true }),
              new TextRun(info.legalCompany),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Website: ", bold: true }),
              new TextRun(info.website),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Business Address: ", bold: true }),
              new TextRun(info.businessAddress),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Phone number: ", bold: true }),
              new TextRun(info.phoneNumber),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(info.email),
            ],
            spacing: { after: 60 },
          }),
          ...customChildren,
          new Paragraph({
            text: "Information We Collect",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We may collect your name, mobile phone number, email address, mailing address, employment or application information, communication preferences, and any information you voluntarily provide through our website, forms, phone calls, SMS conversations, or in-person interactions.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "How We Use Your Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We use your information to:",
            spacing: { after: 80 },
          }),
          new Paragraph({ text: "• Respond to customer inquiries and provide customer support.", spacing: { after: 40 } }),
          new Paragraph({ text: "• Send account notifications and service-related updates.", spacing: { after: 40 } }),
          new Paragraph({ text: "• Schedule interviews, appointments, and onboarding activities.", spacing: { after: 40 } }),
          new Paragraph({ text: "• Share job opportunities, hiring events, career resources, and other marketing communications when you have consented.", spacing: { after: 40 } }),
          new Paragraph({ text: "• Send public service announcements, including office closures, weather-related updates, emergency notifications, or other important service announcements.", spacing: { after: 40 } }),
          new Paragraph({ text: "• Maintain our records, improve our services, and comply with applicable laws.", spacing: { after: 200 } }),

          new Paragraph({
            text: "SMS Communications",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "If you opt in to receive text messages, you may receive Customer Care, Account Notification, Marketing, and Public Service Announcement messages. Message frequency varies based on your interactions with us. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Consent",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "Your consent to receive SMS messages is voluntary and is not a condition of employment or receiving our services. You may withdraw your consent at any time by replying STOP.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Sharing of Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We do not sell, rent, or trade your personal information. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as necessary to provide messaging services.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Data Security",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We maintain reasonable administrative, technical, and physical safeguards designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Your Rights",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "You may request to update or correct your personal information or ask questions regarding this Privacy Policy by contacting us using the information above.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Changes to this Policy",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We may update this Privacy Policy periodically. Any changes will be posted on our website with a revised effective date.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Contact Us",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Website: ", bold: true }),
              new TextRun(info.website),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Phone: ", bold: true }),
              new TextRun(info.phoneNumber),
              new TextRun(" | "),
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(info.email),
            ],
            spacing: { after: 60 },
          }),
          ...customChildren,
        ],
      },
    ],
  });
}

export function generateTermsDocx(info: CompanyInfo): Document {
  const brand = info.dba.trim() || info.legalCompany;
  const customChildren = (info.customFields || []).map(
    (f) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${f.label}: `, bold: true }),
          new TextRun(f.value),
        ],
        spacing: { after: 60 },
      })
  );

  const samples = info.sampleMessages?.length ? info.sampleMessages : getDefaultSampleMessagesList(brand, info.website);
  const sampleParas: Paragraph[] = [];
  samples.forEach((s) => {
    sampleParas.push(
      new Paragraph({
        children: [
          new TextRun({ text: `• ${s.title} - `, bold: true }),
          new TextRun(s.message),
        ],
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Reply STOP to opt out or HELP for assistance.", italics: true })],
        spacing: { after: 120 },
      })
    );
  });

  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "SMS Terms and Conditions",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Effective Date: ", bold: true }),
              new TextRun(info.effectiveDate || "July 2026"),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Acceptance of SMS Terms",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: `By providing your mobile phone number and opting in to receive SMS messages from ${brand}, you agree to these SMS Terms and Conditions. These terms govern all SMS communications sent by ${info.legalCompany}.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Business Information",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Legal Company: ", bold: true }),
              new TextRun(info.legalCompany),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "DBA: ", bold: true }),
              new TextRun(brand),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Website: ", bold: true }),
              new TextRun(info.website),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Business Address: ", bold: true }),
              new TextRun(info.businessAddress),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Phone: ", bold: true }),
              new TextRun(info.phoneNumber),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(info.email),
            ],
            spacing: { after: 60 },
          }),
          ...customChildren,
          new Paragraph({
            text: "Types of SMS Messages",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "If you opt in to receive SMS communications, you may receive messages related to:",
            spacing: { after: 80 },
          }),
          new Paragraph({ text: "• Customer Care (customer support, interview scheduling, appointment reminders, onboarding assistance, follow-up communications)", spacing: { after: 40 } }),
          new Paragraph({ text: "• Account Notifications (application status, account alerts, documentation reminders, employment updates)", spacing: { after: 40 } }),
          new Paragraph({ text: "• Marketing (job opportunities, hiring events, recruiting campaigns, promotions, career resources)", spacing: { after: 200 } }),

          new Paragraph({
            text: "Sample Messages",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          ...sampleParas,

          new Paragraph({
            text: "Message Frequency",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: `Message frequency varies depending on your interactions with ${brand}, your status, and the services you have requested.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Message and Data Rates",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "Standard message and data rates may apply based on your wireless carrier's plan.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "How to Opt In",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "You may opt in to receive SMS messages by completing a website form, application, signing a written consent form, providing verbal consent where permitted, or otherwise giving express consent to receive text messages.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "How to Opt Out",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "You may opt out of receiving SMS messages at any time by replying STOP to any text message. After opting out, you will receive a final confirmation message and will no longer receive SMS communications unless you opt in again.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Help",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "Reply HELP to any SMS message for assistance, or contact us using the information listed above.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Privacy",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: `Your privacy is important to us. We do not sell, rent, or share your personal information with third parties for marketing purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as required to provide messaging services. For more information, please review our Privacy Policy: ${info.privacyPolicyUrl?.trim() || `${(info.website || "").replace(/\/+$/, "")}/privacy-policy`}.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Supported Carriers",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "Wireless carriers are not liable for delayed or undelivered messages.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Changes to These Terms",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "We reserve the right to modify these SMS Terms and Conditions at any time. Updated versions will be posted on our website with a revised effective date.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Contact Us",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Website: ", bold: true }),
              new TextRun(info.website),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Phone: ", bold: true }),
              new TextRun(info.phoneNumber),
              new TextRun(" | "),
              new TextRun({ text: "Email: ", bold: true }),
              new TextRun(info.email),
            ],
            spacing: { after: 60 },
          }),
          ...customChildren,
        ],
      },
    ],
  });
}

export async function downloadDocx(type: 'privacy' | 'terms', info: CompanyInfo) {
  const doc = type === 'privacy' ? generatePrivacyPolicyDocx(info) : generateTermsDocx(info);
  const blob = await Packer.toBlob(doc);
  const fileName = type === 'privacy' 
    ? `Privacy_Policy_${(info.dba || info.legalCompany).replace(/[^a-zA-Z0-9]/g, '_')}.docx`
    : `SMS_Terms_and_Conditions_${(info.dba || info.legalCompany).replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
