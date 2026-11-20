const { jsPDF } = require("jspdf");
const fs = require("fs");

const info = {
  legalCompany: "LJC & COMPANY HEALTHCARE LLC",
  dba: "BrightStar Care",
  website: "https://www.brightstarcare.com/west-portland",
  businessAddress: "1675 SW Marlow ave, Portland Oregon 97225",
  phoneNumber: "+15036206011",
  email: "staffing-westptld@brightstarcare.com",
  effectiveDate: "July 2026",
  privacyPolicyUrl: "https://www.brightstarcare.com/west-portland/privacy-policy",
  termsUrl: "https://www.brightstarcare.com/west-portland/terms-and-conditions"
};

// Exact Office Theme Colors from Image
const COLOR_TITLE = [54, 96, 145];      // #366091 - Word Title Blue
const COLOR_HEADING = [79, 129, 189];   // #4F81BD - Word Heading Blue
const COLOR_TEXT = [26, 26, 26];        // #1a1a1a - Body text
const COLOR_LINK = [17, 85, 204];       // #1155cc - Link blue

// 1. Privacy Policy PDF
function makePrivacyPolicy() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 54;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin + 10;
  const check = (n) => { 
    if (y + n > doc.internal.pageSize.getHeight() - margin) { 
      doc.addPage(); 
      y = margin; 
    } 
  };

  // Centered Title (#366091)
  doc.setFont("times", "bold"); 
  doc.setFontSize(21); 
  doc.setTextColor(...COLOR_TITLE);
  doc.text("Privacy Policy", pageWidth / 2, y, { align: "center" }); 
  y += 24;

  // Centered Effective Date
  doc.setFont("times", "bold"); 
  doc.setFontSize(12); 
  doc.setTextColor(30, 30, 30);
  doc.text("Effective Date: " + (info.effectiveDate || "July 2026"), pageWidth / 2, y, { align: "center" }); 
  y += 26;

  const head = (t) => { 
    check(35); 
    doc.setFont("times", "bold"); 
    doc.setFontSize(13); 
    doc.setTextColor(...COLOR_HEADING); 
    doc.text(t, margin, y); 
    y += 18; 
  };
  const kv = (k, v, isLink = false) => { 
    check(18); 
    doc.setFont("times", "bold"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    doc.text(k, margin, y); 
    const kw = doc.getTextWidth(k); 
    doc.setFont("times", "normal"); 
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const sl = doc.splitTextToSize(v, contentWidth - kw); 
    doc.text(sl, margin + kw, y); 
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(v), contentWidth - kw);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + kw, y + 1.5, margin + kw + lineLen, y + 1.5);
    }
    y += sl.length * 15; 
  };
  const p = (t) => { 
    doc.setFont("times", "normal"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    const lines = doc.splitTextToSize(t, contentWidth); 
    check(lines.length * 15 + 10); 
    doc.text(lines, margin, y); 
    y += lines.length * 15 + 10; 
  };
  const b = (t) => { 
    doc.setFont("times", "normal"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    const lines = doc.splitTextToSize(t, contentWidth - 14); 
    check(lines.length * 15 + 4); 
    doc.text("• ", margin + 4, y); 
    doc.text(lines, margin + 14, y); 
    y += lines.length * 15 + 4; 
  };

  head("Contact Information");
  kv("Legal Company: ", info.legalCompany);
  kv("Website: ", info.website, true);
  kv("Business Address: ", info.businessAddress);
  kv("Phone number: ", info.phoneNumber);
  kv("Email: ", info.email);
  y += 10;

  head("Information We Collect");
  p("We may collect your name, mobile phone number, email address, mailing address, employment or application information, communication preferences, and any information you voluntarily provide through our website, forms, phone calls, SMS conversations, or in-person interactions.");

  head("How We Use Your Information");
  p("We use your information to:");
  b("Respond to customer inquiries and provide customer support.");
  b("Send account notifications and service-related updates.");
  b("Schedule interviews, appointments, and onboarding activities.");
  b("Share job opportunities, hiring events, career resources, and other marketing communications when you have consented.");
  b("Send public service announcements, including office closures, weather-related updates, emergency notifications, or other important service announcements.");
  b("Maintain our records, improve our services, and comply with applicable laws.");
  y += 10;

  head("SMS Communications");
  p("If you opt in to receive text messages, you may receive Customer Care, Account Notification, Marketing, and Public Service Announcement messages. Message frequency varies based on your interactions with us. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance.");

  head("Consent");
  p("Your consent to receive SMS messages is voluntary and is not a condition of employment or receiving our services. You may withdraw your consent at any time by replying STOP.");

  head("Sharing of Information");
  p("We do not sell, rent, or trade your personal information. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as necessary to provide messaging services.");

  head("Data Security");
  p("We maintain reasonable administrative, technical, and physical safeguards designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction.");

  head("Your Rights");
  p("You may request to update or correct your personal information or ask questions regarding this Privacy Policy by contacting us using the information above.");

  head("Changes to this Policy");
  p("We may update this Privacy Policy periodically. Any changes will be posted on our website with a revised effective date.");

  head("Contact Us");
  kv("Website: ", info.website, true);
  kv("Phone: ", info.phoneNumber + " | Email: " + info.email);

  fs.writeFileSync("Generated_Privacy_Policy.pdf", Buffer.from(doc.output("arraybuffer")));
  console.log("Successfully created Generated_Privacy_Policy.pdf");
}

// 2. SMS Terms and Conditions
function makeTerms() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 54;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin + 10;
  const brand = info.dba;
  const check = (n) => { 
    if (y + n > doc.internal.pageSize.getHeight() - margin) { 
      doc.addPage(); 
      y = margin; 
    } 
  };

  // Centered Title (#366091)
  doc.setFont("times", "bold"); 
  doc.setFontSize(21); 
  doc.setTextColor(...COLOR_TITLE);
  doc.text("SMS Terms and Conditions", pageWidth / 2, y, { align: "center" }); 
  y += 24;

  // Centered Effective Date
  doc.setFont("times", "bold"); 
  doc.setFontSize(12); 
  doc.setTextColor(30, 30, 30);
  doc.text("Effective Date: " + (info.effectiveDate || "July 2026"), pageWidth / 2, y, { align: "center" }); 
  y += 26;

  const head = (t) => { 
    check(35); 
    doc.setFont("times", "bold"); 
    doc.setFontSize(13); 
    doc.setTextColor(...COLOR_HEADING); 
    doc.text(t, margin, y); 
    y += 18; 
  };
  const kv = (k, v, isLink = false) => { 
    check(18); 
    doc.setFont("times", "bold"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    doc.text(k, margin, y); 
    const kw = doc.getTextWidth(k); 
    doc.setFont("times", "normal"); 
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const sl = doc.splitTextToSize(v, contentWidth - kw); 
    doc.text(sl, margin + kw, y); 
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(v), contentWidth - kw);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + kw, y + 1.5, margin + kw + lineLen, y + 1.5);
    }
    y += sl.length * 15; 
  };
  const p = (t) => { 
    doc.setFont("times", "normal"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    const lines = doc.splitTextToSize(t, contentWidth); 
    check(lines.length * 15 + 10); 
    doc.text(lines, margin, y); 
    y += lines.length * 15 + 10; 
  };
  const b = (t) => { 
    doc.setFont("times", "normal"); 
    doc.setFontSize(10.5); 
    doc.setTextColor(...COLOR_TEXT); 
    const lines = doc.splitTextToSize(t, contentWidth - 14); 
    check(lines.length * 15 + 4); 
    doc.text("• ", margin + 4, y); 
    doc.text(lines, margin + 14, y); 
    y += lines.length * 15 + 4; 
  };

  head("Acceptance of SMS Terms");
  p("By providing your mobile phone number and opting in to receive SMS messages from " + brand + ", you agree to these SMS Terms and Conditions. These terms govern all SMS communications sent by " + info.legalCompany + ".");

  head("Business Information");
  kv("Legal Company: ", info.legalCompany);
  kv("DBA: ", brand);
  kv("Website: ", info.website, true);
  kv("Business Address: ", info.businessAddress);
  kv("Phone: ", info.phoneNumber);
  kv("Email: ", info.email);
  y += 10;

  head("Types of SMS Messages");
  p("If you opt in to receive SMS communications, you may receive messages related to:");
  b("Customer Care (customer support, interview scheduling, appointment reminders, onboarding assistance, follow-up communications)");
  b("Account Notifications (application status, account alerts, documentation reminders, employment updates)");
  b("Marketing (job opportunities, hiring events, recruiting campaigns, promotions, career resources)");
  y += 10;

  // Sample Message – (Bold Black Header)
  check(40);
  doc.setFont("times", "bold"); 
  doc.setFontSize(12.5); 
  doc.setTextColor(...COLOR_TEXT); 
  doc.text("Sample Message –", margin, y); 
  y += 18;

  // Sample 1: Account notification
  check(60);
  doc.setFont("times", "normal"); 
  doc.setFontSize(10.5); 
  doc.text("•", margin + 12, y);
  doc.setFont("times", "bold"); 
  doc.text("Account notification - ", margin + 26, y);
  const w1 = doc.getTextWidth("Account notification - ");
  doc.setFont("times", "normal");
  const t1 = "Congratulations on completing your onboarding documents! Meet with one of our Employment Specialists to discuss current job opportunities that match your skills. Visit our office Monday–Friday from 8:00 AM–5:00 PM (best times: 8:00–11:00 AM or 12:30–4:30 PM). For more information visit : " + info.website;
  const l1 = doc.splitTextToSize(t1, contentWidth - 26 - w1);
  doc.text(l1, margin + 26 + w1, y); 
  y += l1.length * 15 + 6;

  doc.text("Reply STOP to opt out or HELP for assistance.", margin + 4, y);
  y += 20;

  // Sample 2: Customer Care
  check(60);
  doc.setFont("times", "normal"); 
  doc.text("•", margin + 12, y);
  doc.setFont("times", "bold"); 
  doc.text("Customer Care - ", margin + 26, y);
  const w2 = doc.getTextWidth("Customer Care - ");
  doc.setFont("times", "normal");
  const t2 = brand + ": Hi, this is customer service. We have updated your schedule as requested. Your recruiter will contact you when a matching opportunity becomes available. For questions, visit " + info.website;
  const l2 = doc.splitTextToSize(t2, contentWidth - 26 - w2);
  doc.text(l2, margin + 26 + w2, y); 
  y += l2.length * 15 + 6;

  doc.text("Reply STOP to opt out or HELP for assistance.", margin + 4, y);
  y += 20;

  // Sample 3: Marketing
  check(60);
  doc.setFont("times", "normal"); 
  doc.text("•", margin + 12, y);
  doc.setFont("times", "bold"); 
  doc.text("Marketing - ", margin + 26, y);
  const w3 = doc.getTextWidth("Marketing - ");
  doc.setFont("times", "normal");
  const t3 = brand + ": Your application status has been updated. We have immediate openings matching your profile. Please reply if you are interested or visit " + info.website + ".";
  const l3 = doc.splitTextToSize(t3, contentWidth - 26 - w3);
  doc.text(l3, margin + 26 + w3, y); 
  y += l3.length * 15 + 6;

  doc.text("Reply STOP to opt out or HELP for assistance.", margin + 4, y);
  y += 20;

  head("Message Frequency");
  p("Message frequency varies depending on your interactions with " + brand + ", your employment status, and the services you have requested.");

  head("Message and Data Rates");
  p("Standard message and data rates may apply based on your wireless carrier's plan.");

  head("How to Opt In");
  p("You may opt in to receive SMS messages by completing a website form, employment application, signing a written consent form, providing verbal consent where permitted, or otherwise giving express consent to receive text messages.");

  head("How to Opt Out");
  p("You may opt out of receiving SMS messages at any time by replying STOP to any text message. After opting out, you will receive a final confirmation message and will no longer receive SMS communications unless you opt in again.");

  head("Help");
  p("Reply HELP to any SMS message for assistance, or contact us using the information listed above.");

  head("Privacy");
  p("Your privacy is important to us. We do not sell, rent, or share your personal information with third parties for marketing purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as required to provide messaging services. For more information, please review our");

  doc.setTextColor(...COLOR_LINK);
  doc.setFont("times", "bold");
  const pLink = "Privacy Policy - " + brand;
  doc.text(pLink, margin + 6, y);
  doc.setDrawColor(...COLOR_LINK);
  doc.setLineWidth(0.7);
  doc.line(margin + 6, y + 1.5, margin + 6 + doc.getTextWidth(pLink), y + 1.5);
  y += 18;

  head("Supported Carriers");
  p("Wireless carriers are not liable for delayed or undelivered messages.");

  head("Changes to These Terms");
  p("We reserve the right to modify these SMS Terms and Conditions at any time. Updated versions will be posted on our website with a revised effective date.");

  head("Contact Us");
  kv("Website: ", info.website, true);
  kv("Phone: ", info.phoneNumber);
  kv("Email: ", info.email);

  fs.writeFileSync("Generated_SMS_Terms_and_Conditions.pdf", Buffer.from(doc.output("arraybuffer")));
  console.log("Successfully created Generated_SMS_Terms_and_Conditions.pdf");
}

// 3. SMS Opt-In Consent Form PDF
function makeConsent() {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 54;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin + 10;
  const brand = info.dba;

  // Title (#366091)
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

  const kv = (k, v, isLink = false) => {
    doc.setFont("times", "bold"); 
    doc.setFontSize(11); 
    doc.setTextColor(...COLOR_TEXT);
    doc.text(k, margin, y); 
    const kw = doc.getTextWidth(k);
    doc.setFont("times", "normal");
    if (isLink) {
      doc.setTextColor(...COLOR_LINK);
    } else {
      doc.setTextColor(...COLOR_TEXT);
    }
    const vl = doc.splitTextToSize(v, contentWidth - kw);
    doc.text(vl, margin + kw, y); 
    if (isLink) {
      const lineLen = Math.min(doc.getTextWidth(v), contentWidth - kw);
      doc.setDrawColor(...COLOR_LINK);
      doc.setLineWidth(0.7);
      doc.line(margin + kw, y + 1.5, margin + kw + lineLen, y + 1.5);
    }
    y += vl.length * 16 + 4;
  };

  kv("Legal Company: ", info.legalCompany);
  kv("Website: ", info.website, true);
  kv("Business Address: ", info.businessAddress);
  y += 14;

  doc.setFont("times", "normal"); 
  doc.setFontSize(11); 
  doc.setTextColor(...COLOR_TEXT);
  const intro = "By providing your phone number and signing this form, you expressly consent to receive SMS/text messages from " + brand + " for Customer Care purposes. You may receive:";
  const il = doc.splitTextToSize(intro, contentWidth);
  doc.text(il, margin, y); 
  y += il.length * 16 + 10;

  const bullets = [
    "Customer support communications",
    "Application updates",
    "Interview scheduling",
    "Appointment reminders",
    "Employment onboarding assistance",
    "Account notifications",
    "Follow-up communications"
  ];
  bullets.forEach(b => {
    doc.text("•  " + b, margin + 8, y); 
    y += 18;
  });
  y += 12;

  // SMS Disclosure in #4F81BD
  doc.setFont("times", "bold"); 
  doc.setFontSize(15); 
  doc.setTextColor(...COLOR_HEADING);
  doc.text("SMS Disclosure", margin, y); 
  y += 20;

  const disclosures = [
    "Message and data rates may apply.",
    "Message frequency may vary.",
    "Reply HELP for assistance.",
    "Reply STOP at any time to opt out.",
    "Consent is not a condition of employment.",
    "We do not share mobile numbers with third parties for marketing."
  ];
  disclosures.forEach(d => {
    doc.setFont("times", "normal"); 
    doc.setFontSize(11); 
    doc.setTextColor(...COLOR_TEXT);
    doc.text("•  " + d, margin + 8, y); 
    y += 18;
  });
  y += 14;

  const pUrl = info.privacyPolicyUrl || info.website + "/privacy-policy";
  const tUrl = info.termsUrl || info.website + "/terms-and-conditions";

  doc.setFont("times", "bold"); 
  doc.setFontSize(11); 
  doc.setTextColor(...COLOR_TEXT);
  doc.text("Privacy Policy: ", margin, y);
  const pw = doc.getTextWidth("Privacy Policy: ");
  doc.setFont("times", "normal"); 
  doc.setTextColor(...COLOR_LINK);
  const pl = doc.splitTextToSize(pUrl, contentWidth - pw);
  doc.text(pl, margin + pw, y); 
  doc.setDrawColor(...COLOR_LINK);
  doc.setLineWidth(0.7);
  doc.line(margin + pw, y + 1.5, margin + pw + Math.min(doc.getTextWidth(pUrl), contentWidth - pw), y + 1.5);

  // Page 2
  doc.addPage();
  y = margin + 15;

  doc.setFont("times", "bold"); 
  doc.setFontSize(11); 
  doc.setTextColor(...COLOR_TEXT);
  doc.text("Terms & Conditions: ", margin, y);
  const tw = doc.getTextWidth("Terms & Conditions: ");
  doc.setFont("times", "normal"); 
  doc.setTextColor(...COLOR_LINK);
  const tl = doc.splitTextToSize(tUrl, contentWidth - tw);
  doc.text(tl, margin + tw, y); 
  doc.setDrawColor(...COLOR_LINK);
  doc.setLineWidth(0.7);
  doc.line(margin + tw, y + 1.5, margin + tw + Math.min(doc.getTextWidth(tUrl), contentWidth - tw), y + 1.5);
  y += tl.length * 16 + 24;

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

  const fields = [
    "Customer Name:",
    "Best Phone Number:",
    "Email Address:",
    "Customer Signature:",
    "Today's Date:"
  ];

  fields.forEach(f => {
    doc.setFont("times", "bold"); 
    doc.setFontSize(11); 
    doc.setTextColor(...COLOR_TEXT);
    doc.text(f, margin, y);
    doc.setDrawColor(120, 120, 120); 
    doc.setLineWidth(0.8);
    doc.line(margin + 140, y, margin + contentWidth, y);
    y += 34;
  });

  fs.writeFileSync("Generated_SMS_Consent_Authorization.pdf", Buffer.from(doc.output("arraybuffer")));
  console.log("Successfully created Generated_SMS_Consent_Authorization.pdf");
}

makePrivacyPolicy();
makeTerms();
makeConsent();
