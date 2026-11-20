import React from "react";
import { CompanyInfo } from "../types/document";

interface DocProps {
  info: CompanyInfo;
  highlight: boolean;
}

export const PrivacyPolicyDoc: React.FC<DocProps> = ({ info, highlight }) => {
  const mark = (val: string, fallback: string = "") => {
    const text = val || fallback;
    if (!highlight) return text;
    return (
      <mark className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium border border-amber-300">
        {text}
      </mark>
    );
  };

  return (
    <div className="doc-page max-w-[820px] mx-auto p-12 sm:p-16 bg-white text-black font-serif text-[15px] leading-relaxed select-text shadow-md border border-slate-200">
      {/* Centered Document Header matching Image */}
      <div className="text-center mb-7">
        <h1 className="text-[23px] font-bold text-[#366091] mb-1">
          Privacy Policy
        </h1>
        <h2 className="text-[17px] font-bold text-black">
          Effective Date: {mark(info.effectiveDate, "July 2026")}
        </h2>
      </div>

      {/* Contact Information */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Contact Information
        </h3>
        <div className="space-y-1 text-black">
          <div><span className="font-bold">Legal Company: </span>{mark(info.legalCompany, "[Legal Company]")}</div>
          <div>
            <span className="font-bold">Website: </span>
            <a href={info.website} target="_blank" rel="noreferrer" className="text-[#1155cc] underline hover:text-blue-800">
              {mark(info.website, "[Website URL]")}
            </a>
          </div>
          <div><span className="font-bold">Business Address: </span>{mark(info.businessAddress, "[Business Address]")}</div>
          <div><span className="font-bold">Phone number: </span>{mark(info.phoneNumber, "[Phone Number]")}</div>
          <div><span className="font-bold">Email: </span><span>{mark(info.email, "[Email Address]")}</span></div>
          {/* Custom Fields */}
          {info.customFields?.map((field) => (
            <div key={field.id}>
              <span className="font-bold">{field.label}: </span>
              {mark(field.value)}
            </div>
          ))}
        </div>
      </section>

      {/* Information We Collect */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Information We Collect
        </h3>
        <p className="text-black text-justify leading-normal">
          We may collect your name, mobile phone number, email address, mailing address, employment or application information, communication preferences, and any information you voluntarily provide through our website, forms, phone calls, SMS conversations, or in-person interactions.
        </p>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          How We Use Your Information
        </h3>
        <p className="text-black mb-2">We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1 text-black">
          <li>Respond to customer inquiries and provide customer support.</li>
          <li>Send account notifications and service-related updates.</li>
          <li>Schedule interviews, appointments, and onboarding activities.</li>
          <li>Share job opportunities, hiring events, career resources, and other marketing communications when you have consented.</li>
          <li>Send public service announcements, including office closures, weather-related updates, emergency notifications, or other important service announcements.</li>
          <li>Maintain our records, improve our services, and comply with applicable laws.</li>
        </ul>
      </section>

      {/* SMS Communications */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          SMS Communications
        </h3>
        <p className="text-black leading-normal">
          If you opt in to receive text messages, you may receive Customer Care, Account Notification, Marketing, and Public Service Announcement messages. Message frequency varies based on your interactions with us. Message and data rates may apply. Reply STOP to opt out at any time or HELP for assistance.
        </p>
      </section>

      {/* Consent */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Consent
        </h3>
        <p className="text-black leading-normal">
          Your consent to receive SMS messages is voluntary and is not a condition of employment or receiving our services. You may withdraw your consent at any time by replying STOP.
        </p>
      </section>

      {/* Sharing of Information */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Sharing of Information
        </h3>
        <p className="text-black leading-normal">
          We do not sell, rent, or trade your personal information. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as necessary to provide messaging services.
        </p>
      </section>

      {/* Data Security */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Data Security
        </h3>
        <p className="text-black leading-normal">
          We maintain reasonable administrative, technical, and physical safeguards designed to protect your personal information against unauthorized access, disclosure, alteration, or destruction.
        </p>
      </section>

      {/* Your Rights */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Your Rights
        </h3>
        <p className="text-black leading-normal">
          You may request to update or correct your personal information or ask questions regarding this Privacy Policy by contacting us using the information above.
        </p>
      </section>

      {/* Changes to this Policy */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Changes to this Policy
        </h3>
        <p className="text-black leading-normal">
          We may update this Privacy Policy periodically. Any changes will be posted on our website with a revised effective date.
        </p>
      </section>

      {/* Contact Us */}
      <section className="pt-2">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Contact Us
        </h3>
        <div className="space-y-1 text-black">
          <div>
            <span className="font-bold">Website: </span>
            <a href={info.website} target="_blank" rel="noreferrer" className="text-[#1155cc] underline">
              {mark(info.website, "[Website URL]")}
            </a>
          </div>
          <div>
            <span className="font-bold">Phone: </span>{mark(info.phoneNumber, "[Phone]")} | <span className="font-bold">Email: </span>{mark(info.email, "[Email]")}
          </div>
          {info.customFields?.map((field) => (
            <div key={"contact-" + field.id}>
              <span className="font-bold">{field.label}: </span>
              <span>{mark(field.value)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
