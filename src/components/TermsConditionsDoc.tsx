import React from "react";
import { CompanyInfo } from "../types/document";

interface DocProps {
  info: CompanyInfo;
  highlight: boolean;
}

export const TermsConditionsDoc: React.FC<DocProps> = ({ info, highlight }) => {
  const brand = info.dba.trim() || info.legalCompany || "[Brand / Legal Company]";

  const mark = (val: string, fallback: string = "") => {
    const text = val || fallback;
    if (!highlight) return text;
    return (
      <mark className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium border border-amber-300">
        {text}
      </mark>
    );
  };

  // Purple highlight specifically for Sample Messages as requested by user
  const renderSampleMessage = (msg: string) => {
    if (!highlight) {
      return <span className="whitespace-pre-wrap">{msg}</span>;
    }
    return (
      <mark className="bg-purple-100/90 text-purple-950 px-1.5 py-0.5 rounded border border-purple-300 whitespace-pre-wrap leading-relaxed inline">
        {msg}
      </mark>
    );
  };

  return (
    <div className="doc-page max-w-[820px] mx-auto p-12 sm:p-16 bg-white text-black font-serif text-[15px] leading-relaxed select-text shadow-md border border-slate-200">
      {/* Centered Document Header matching Image */}
      <div className="text-center mb-7">
        <h1 className="text-[23px] font-bold text-[#366091] mb-1">
          SMS Terms and Conditions
        </h1>
        <h2 className="text-[17px] font-bold text-black">
          Effective Date: {mark(info.effectiveDate, "July 2026")}
        </h2>
      </div>

      {/* Acceptance of SMS Terms */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Acceptance of SMS Terms
        </h3>
        <p className="text-black text-justify leading-normal">
          By providing your mobile phone number and opting in to receive SMS messages from {mark(brand)}, you agree to these SMS Terms and Conditions. These terms govern all SMS communications sent by {mark(info.legalCompany, "[Legal Company]")}.
        </p>
      </section>

      {/* Business Information */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Business Information
        </h3>
        <div className="space-y-1 text-black">
          <div><span className="font-bold">Legal Company: </span>{mark(info.legalCompany, "[Legal Company]")}</div>
          <div><span className="font-bold">DBA: </span>{mark(brand)}</div>
          <div>
            <span className="font-bold">Website: </span>
            <a href={info.website} target="_blank" rel="noreferrer" className="text-[#1155cc] underline hover:text-blue-800">
              {mark(info.website, "[Website URL]")}
            </a>
          </div>
          <div><span className="font-bold">Business Address: </span>{mark(info.businessAddress, "[Business Address]")}</div>
          <div><span className="font-bold">Phone: </span>{mark(info.phoneNumber, "[Phone]")}</div>
          <div className="pt-1"><span className="font-bold">Email: </span><span>{mark(info.email, "[Email]")}</span></div>
          {/* Custom Dynamic Fields */}
          {info.customFields?.map((field) => (
            <div key={field.id}>
              <span className="font-bold">{field.label}: </span>
              {mark(field.value)}
            </div>
          ))}
        </div>
      </section>

      {/* Types of SMS Messages */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Types of SMS Messages
        </h3>
        <p className="text-black mb-2">If you opt in to receive SMS communications, you may receive messages related to:</p>
        <ul className="list-disc pl-6 space-y-1 text-black">
          <li><strong>Customer Care</strong> (customer support, interview scheduling, appointment reminders, onboarding assistance, follow-up communications)</li>
          <li><strong>Account Notifications</strong> (application status, account alerts, documentation reminders, employment updates)</li>
          <li><strong>Marketing</strong> (job opportunities, hiring events, recruiting campaigns, promotions, career resources)</li>
        </ul>
      </section>

      {/* Sample Message – (Dynamic List with Purple Highlight) */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-black mb-3">
          Sample Message –
        </h3>
        
        {info.sampleMessages?.length === 0 ? (
          <p className="text-slate-400 italic text-xs">No sample messages configured.</p>
        ) : (
          info.sampleMessages.map((item) => (
            <div key={item.id} className="mb-5 pl-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-black">•</span>
                <div className="leading-relaxed">
                  <span className="font-bold">{item.title} - </span>
                  {renderSampleMessage(item.message)}
                </div>
              </div>
              <div className="text-black pl-4">
                Reply STOP to opt out or HELP for assistance.
              </div>
            </div>
          ))
        )}
      </section>

      {/* Message Frequency */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Message Frequency
        </h3>
        <p className="text-black leading-normal">
          Message frequency varies depending on your interactions with {mark(brand)}, your employment status, and the services you have requested.
        </p>
      </section>

      {/* Message and Data Rates */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Message and Data Rates
        </h3>
        <p className="text-black leading-normal">
          Standard message and data rates may apply based on your wireless carrier&apos;s plan.
        </p>
      </section>

      {/* How to Opt In */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          How to Opt In
        </h3>
        <p className="text-black leading-normal">
          You may opt in to receive SMS messages by completing a website form, employment application, signing a written consent form, providing verbal consent where permitted, or otherwise giving express consent to receive text messages.
        </p>
      </section>

      {/* How to Opt Out */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          How to Opt Out
        </h3>
        <p className="text-black leading-normal">
          You may opt out of receiving SMS messages at any time by replying STOP to any text message. After opting out, you will receive a final confirmation message and will no longer receive SMS communications unless you opt in again.
        </p>
      </section>

      {/* Help */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Help
        </h3>
        <p className="text-black leading-normal">
          Reply HELP to any SMS message for assistance, or contact us using the information listed above.
        </p>
      </section>

      {/* Privacy */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Privacy
        </h3>
        <p className="text-black leading-normal mb-2">
          Your privacy is important to us. We do not sell, rent, or share your personal information with third parties for marketing purposes. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties except as required to provide messaging services. For more information, please review our
        </p>
        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
          <span className="text-blue-500 text-xs">📄</span>
          <span className="font-bold text-[#1155cc] underline cursor-pointer">
            Privacy Policy- {mark(brand)}
          </span>
          <span className="text-slate-400">|</span>
        </div>
      </section>

      {/* Supported Carriers */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Supported Carriers
        </h3>
        <p className="text-black leading-normal">
          Wireless carriers are not liable for delayed or undelivered messages.
        </p>
      </section>

      {/* Changes to These Terms */}
      <section className="mb-6">
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-1.5">
          Changes to These Terms
        </h3>
        <p className="text-black leading-normal">
          We reserve the right to modify these SMS Terms and Conditions at any time. Updated versions will be posted on our website with a revised effective date.
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
          <div><span className="font-bold">Phone: </span>{mark(info.phoneNumber, "[Phone]")}</div>
          <div><span className="font-bold">Email: </span><span>{mark(info.email, "[Email]")}</span></div>
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
