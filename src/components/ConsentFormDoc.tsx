import React from "react";
import { CompanyInfo } from "../types/document";

interface DocProps {
  info: CompanyInfo;
  highlight: boolean;
}

export const ConsentFormDoc: React.FC<DocProps> = ({ info, highlight }) => {
  const brand = info.dba.trim() || info.legalCompany || "[Brand / Legal Company]";
  const privacyUrl = info.privacyPolicyUrl || `${info.website}/privacy-policy`;
  const termsUrl = info.termsUrl || `${info.website}/terms-and-conditions`;

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
    <div className="space-y-8">
      {/* PAGE 1 */}
      <div className="doc-page max-w-[820px] mx-auto p-12 sm:p-16 bg-white text-black font-serif text-[15px] leading-relaxed select-text shadow-md border border-slate-200 min-h-[1050px] relative">
        <div className="text-[10px] text-slate-400 absolute top-4 right-8 font-mono">Page 1 of 2</div>

        {/* Title in matching #366091 */}
        <h1 className="text-[23px] font-bold text-[#366091] mb-1 leading-snug">
          SMS Consent – Customer Care Opt-In Authorization
        </h1>
        <h2 className="text-[17px] font-bold text-slate-800 mb-6">
          {mark(brand)}
        </h2>

        {/* Legal Info */}
        <div className="space-y-1.5 mb-6 text-black">
          <div><span className="font-bold">Legal Company: </span>{mark(info.legalCompany, "[Legal Company]")}</div>
          <div>
            <span className="font-bold">Website: </span>
            <a href={info.website} target="_blank" rel="noreferrer" className="text-[#1155cc] underline hover:text-blue-800">
              {mark(info.website, "[Website URL]")}
            </a>
          </div>
          <div><span className="font-bold">Business Address: </span>{mark(info.businessAddress, "[Business Address]")}</div>
          {info.customFields?.map((field) => (
            <div key={field.id}>
              <span className="font-bold">{field.label}: </span>
              {mark(field.value)}
            </div>
          ))}
        </div>

        {/* Intro */}
        <p className="text-black mb-4 leading-normal">
          By providing your phone number and signing this form, you expressly consent to receive SMS/text messages from {mark(brand)} for Customer Care purposes. You may receive:
        </p>

        {/* Bullets */}
        <ul className="list-disc pl-6 space-y-1.5 text-black mb-8">
          <li>Customer support communications</li>
          <li>Application updates</li>
          <li>Interview scheduling</li>
          <li>Appointment reminders</li>
          <li>Employment onboarding assistance</li>
          <li>Account notifications</li>
          <li>Follow-up communications</li>
        </ul>

        {/* SMS Disclosure in matching #4F81BD */}
        <h3 className="text-[17px] font-bold text-[#4F81BD] mb-3">
          SMS Disclosure
        </h3>
        <ul className="list-disc pl-6 space-y-1.5 text-black mb-8">
          <li>Message and data rates may apply.</li>
          <li>Message frequency may vary.</li>
          <li>Reply HELP for assistance.</li>
          <li>Reply STOP at any time to opt out.</li>
          <li>Consent is not a condition of employment.</li>
          <li>We do not share mobile numbers with third parties for marketing.</li>
        </ul>

        {/* Privacy Policy Link */}
        <div className="pt-2 text-black">
          <span className="font-bold">Privacy Policy: </span>
          <a href={privacyUrl} target="_blank" rel="noreferrer" className="text-[#1155cc] underline break-all">
            {mark(privacyUrl)}
          </a>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="doc-page max-w-[820px] mx-auto p-12 sm:p-16 bg-white text-black font-serif text-[15px] leading-relaxed select-text shadow-md border border-slate-200 min-h-[700px] relative">
        <div className="text-[10px] text-slate-400 absolute top-4 right-8 font-mono">Page 2 of 2</div>

        {/* Terms Link */}
        <div className="mb-8 text-black">
          <span className="font-bold">Terms & Conditions: </span>
          <a href={termsUrl} target="_blank" rel="noreferrer" className="text-[#1155cc] underline break-all">
            {mark(termsUrl)}
          </a>
        </div>

        {/* Checkbox Options */}
        <div className="space-y-4 mb-10 pl-1">
          <label className="flex items-center gap-3 text-black font-medium cursor-pointer">
            <span className="w-5 h-5 border-2 border-slate-600 rounded flex items-center justify-center"></span>
            <span>I have read and accept.</span>
          </label>
          <label className="flex items-center gap-3 text-black font-medium cursor-pointer">
            <span className="w-5 h-5 border-2 border-slate-600 rounded flex items-center justify-center"></span>
            <span>I have read and decline.</span>
          </label>
        </div>

        {/* Signature Fields */}
        <div className="space-y-6 pt-4 max-w-lg">
          <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
            <span className="font-bold text-black text-sm w-44">Customer Name:</span>
            <div className="flex-1"></div>
          </div>

          <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
            <span className="font-bold text-black text-sm w-44">Best Phone Number:</span>
            <div className="flex-1"></div>
          </div>

          <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
            <span className="font-bold text-black text-sm w-44">Email Address:</span>
            <div className="flex-1"></div>
          </div>

          <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
            <span className="font-bold text-black text-sm w-44">Customer Signature:</span>
            <div className="flex-1"></div>
          </div>

          <div className="flex items-baseline justify-between border-b border-slate-400 pb-1">
            <span className="font-bold text-black text-sm w-44">Today&apos;s Date:</span>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
