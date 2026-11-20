import { CompanyInfo, ActiveDocType, getDefaultSampleMessagesList } from "../types/document";

export function getCleanDocumentText(type: ActiveDocType, info: CompanyInfo): { title: string; content: string } {
  const brand = info.dba.trim() || info.legalCompany || "Company";

  if (type === "privacy") {
    const title = `Privacy Policy - ${brand}`;
    const lines = [
      "Privacy Policy",
      `Effective Date: ${info.effectiveDate || "July 2026"}`,
      "",
      "Contact Information",
      `Legal Company: ${info.legalCompany}`,
      `Website: ${info.website}`,
      `Business Address: ${info.businessAddress}`,
      `Phone number: ${info.phoneNumber}`,
      `Email: ${info.email}`,
      ...(info.customFields || []).map((f) => `${f.label}: ${f.value}`),
      "",
      "Information We Collect",
      "We may collect your name, mobile phone number, email address, mailing address, employment or application information, communication preferences, and any information you voluntarily provide through our website, forms, phone calls, SMS conversations, or in-person interactions.",
      "",
      "How We Use Your Information",
      "We use your information to:",
      "• Respond to customer inquiries and provide customer support.",
      "• Send account notifications and service-related updates.",
      "• Schedule interviews, appointments, and onboarding activities.",
      "• Share job opportunities, hiring events, career resources, and other marketing communications when you have consented.",
      "• Send public service announcements, including office closures, weather-related updates, emergency notifications, or other important service announcements.",
      "• Maintain our records, improve our services, and comply with applicable laws.",
      "",
      "SMS Communications",
      "If you opt in to receive text messages, you may receive Customer Care, Account Notification, Marketing, and Public Service Announcement messages. Message frequency varies based on your interactions with us. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance.",
      "",
      "Consent",
      "Your consent to receive SMS messages is voluntary and is not a condition of employment or receiving our services. You may withdraw your consent at any time by replying STOP.",
      "",
      "Sharing of Information",
      "We do not sell, rent, or trade your personal information. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as necessary to provide messaging services.",
      "",
      "Data Security",
      "We maintain reasonable administrative, technical, and physical safeguards designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction.",
      "",
      "Your Rights",
      "You may request to update or correct your personal information or ask questions regarding this Privacy Policy by contacting us using the information above.",
      "",
      "Changes to this Policy",
      "We may update this Privacy Policy periodically. Any changes will be posted on our website with a revised effective date.",
      "",
      "Contact Us",
      `Website: ${info.website}`,
      `Phone: ${info.phoneNumber} | Email: ${info.email}`,
    ];
    return { title, content: lines.join("\n") };
  } else if (type === "terms") {
    const title = `SMS Terms and Conditions - ${brand}`;
    const samples = info.sampleMessages?.length ? info.sampleMessages : getDefaultSampleMessagesList(brand, info.website);

    const sampleLines: string[] = [];
    samples.forEach((s) => {
      sampleLines.push(`• ${s.title} - ${s.message}`);
      sampleLines.push("Reply STOP to opt out or HELP for assistance.");
      sampleLines.push("");
    });

    const lines = [
      "SMS Terms and Conditions",
      `Effective Date: ${info.effectiveDate || "July 2026"}`,
      "",
      "Acceptance of SMS Terms",
      `By providing your mobile phone number and opting in to receive SMS messages from ${brand}, you agree to these SMS Terms and Conditions. These terms govern all SMS communications sent by ${info.legalCompany}.`,
      "",
      "Business Information",
      `Legal Company: ${info.legalCompany}`,
      `DBA: ${brand}`,
      `Website: ${info.website}`,
      `Business Address: ${info.businessAddress}`,
      `Phone: ${info.phoneNumber}`,
      `Email: ${info.email}`,
      ...(info.customFields || []).map((f) => `${f.label}: ${f.value}`),
      "",
      "Types of SMS Messages",
      "If you opt in to receive SMS communications, you may receive messages related to:",
      "• Customer Care (customer support, interview scheduling, appointment reminders, onboarding assistance, follow-up communications)",
      "• Account Notifications (application status, account alerts, documentation reminders, employment updates)",
      "• Marketing (job opportunities, hiring events, recruiting campaigns, promotions, career resources)",
      "",
      "Sample Message –",
      ...sampleLines,
      "Message Frequency",
      `Message frequency varies depending on your interactions with ${brand}, your employment status, and the services you have requested.`,
      "",
      "Message and Data Rates",
      "Standard message and data rates may apply based on your wireless carrier's plan.",
      "",
      "How to Opt In",
      "You may opt in to receive SMS messages by completing a website form, employment application, signing a written consent form, providing verbal consent where permitted, or otherwise giving express consent to receive text messages.",
      "",
      "How to Opt Out",
      "You may opt out of receiving SMS messages at any time by replying STOP to any text message. After opting out, you will receive a final confirmation message and will no longer receive SMS communications unless you opt in again.",
      "",
      "Help",
      "Reply HELP to any SMS message for assistance, or contact us using the information listed above.",
      "",
      "Privacy",
      `Your privacy is important to us. We do not sell, rent, or share your personal information with third parties for marketing purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as required to provide messaging services. For more information, please review our Privacy Policy - ${brand}.`,
      "",
      "Supported Carriers",
      "Wireless carriers are not liable for delayed or undelivered messages.",
      "",
      "Changes to These Terms",
      "We reserve the right to modify these SMS Terms and Conditions at any time. Updated versions will be posted on our website with a revised effective date.",
      "",
      "Contact Us",
      `Website: ${info.website}`,
      `Phone: ${info.phoneNumber} | Email: ${info.email}`,
    ];
    return { title, content: lines.join("\n") };
  } else {
    const title = `SMS Consent Authorization - ${brand}`;
    const lines = [
      "SMS Consent – Customer Care Opt-In Authorization",
      brand,
      "",
      `Legal Company: ${info.legalCompany}`,
      `Website: ${info.website}`,
      `Business Address: ${info.businessAddress}`,
      ...(info.customFields || []).map((f) => `${f.label}: ${f.value}`),
      "",
      `By providing your phone number and signing this form, you expressly consent to receive SMS/text messages from ${brand} for Customer Care purposes.`,
      "",
      "SMS Disclosure",
      "• Message and data rates may apply.",
      "• Message frequency may vary.",
      "• Reply HELP for assistance.",
      "• Reply STOP at any time to opt out.",
      "• Consent is not a condition of employment.",
      "• We do not share mobile numbers with third parties for marketing.",
      "",
      `Privacy Policy: ${info.privacyPolicyUrl || info.website + "/privacy-policy"}`,
      `Terms & Conditions: ${info.termsUrl || info.website + "/terms-and-conditions"}`,
    ];
    return { title, content: lines.join("\n") };
  }
}
