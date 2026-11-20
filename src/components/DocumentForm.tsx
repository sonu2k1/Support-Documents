import React, { useState } from "react";
import { CompanyInfo, SampleMessageItem, CustomField, getDefaultSampleMessagesList } from "../types/document";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Link2, 
  Sparkles, 
  RotateCcw,
  MessageSquareText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  Trash2,
  SlidersHorizontal,
  Edit3,
  Check
} from "lucide-react";

interface DocumentFormProps {
  formData: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  highlightFields: boolean;
  setHighlightFields: (v: boolean) => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  formData,
  onChange,
  highlightFields,
  setHighlightFields,
}) => {
  // Collapsed by default as requested: user clicks button to edit
  const [showSampleMessages, setShowSampleMessages] = useState<boolean>(false);
  const [showCustomFields, setShowCustomFields] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  // Sync Website URL in Sample Messages whenever Website URL is changed
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    const oldUrl = formData.website;

    const updatedSamples = formData.sampleMessages.map((item) => {
      let msg = item.message;
      if (oldUrl && oldUrl.trim() && msg.includes(oldUrl.trim())) {
        msg = msg.replaceAll(oldUrl.trim(), newUrl);
      } else {
        msg = msg.replace(/https?:\/\/[^\s]+(?=[.,]?(\s|$))/gi, newUrl);
      }
      return {
        ...item,
        message: msg,
      };
    });

    onChange({
      ...formData,
      website: newUrl,
      sampleMessages: updatedSamples,
    });
  };

  // Sync DBA / Brand Name in Sample Messages whenever DBA is changed
  const handleDbaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrand = e.target.value;
    const oldBrand = formData.dba.trim();

    const updatedSamples = formData.sampleMessages.map((item) => {
      let msg = item.message;
      if (oldBrand && newBrand) {
        msg = msg.replaceAll(oldBrand, newBrand);
      }
      return {
        ...item,
        message: msg,
      };
    });

    onChange({
      ...formData,
      dba: newBrand,
      sampleMessages: updatedSamples,
    });
  };

  // Strictly enforce only numbers & optional leading + for phone number
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const hasPlus = raw.startsWith("+");
    const digits = raw.replace(/\D/g, "");
    const clean = (hasPlus ? "+" : "") + digits;
    onChange({
      ...formData,
      phoneNumber: clean,
    });
  };

  // --- Sample Messages Management ---
  const handleUpdateSampleMessage = (id: string, field: "title" | "message", val: string) => {
    const updated = formData.sampleMessages.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange({ ...formData, sampleMessages: updated });
  };

  const handleAddSampleMessage = () => {
    const newId = "sample-" + Date.now();
    const brand = formData.dba.trim() || formData.legalCompany || "Company";
    const newItem: SampleMessageItem = {
      id: newId,
      title: "Appointment Reminder",
      message: `${brand}: Hi, this is a reminder for your upcoming appointment. Reply STOP to opt out or HELP for assistance.`,
    };
    onChange({
      ...formData,
      sampleMessages: [...formData.sampleMessages, newItem],
    });
  };

  const handleDeleteSampleMessage = (id: string) => {
    const updated = formData.sampleMessages.filter((item) => item.id !== id);
    onChange({ ...formData, sampleMessages: updated });
  };

  const handleRegenerateSamples = () => {
    const brand = formData.dba.trim() || formData.legalCompany;
    const samples = getDefaultSampleMessagesList(brand, formData.website);
    onChange({
      ...formData,
      sampleMessages: samples,
    });
  };

  // --- Custom Fields Management ---
  const handleAddCustomField = () => {
    const newId = "custom-" + Date.now();
    const newField: CustomField = {
      id: newId,
      label: "Support Hours",
      value: "Monday – Friday, 8:00 AM – 5:00 PM",
    };
    onChange({
      ...formData,
      customFields: [...formData.customFields, newField],
    });
  };

  const handleUpdateCustomField = (id: string, field: "label" | "value", val: string) => {
    const updated = formData.customFields.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: val };
      }
      return f;
    });
    onChange({ ...formData, customFields: updated });
  };

  const handleDeleteCustomField = (id: string) => {
    const updated = formData.customFields.filter((f) => f.id !== id);
    onChange({ ...formData, customFields: updated });
  };

  // --- Presets ---
  const loadPreset = (preset: "brightstar" | "expresspros") => {
    if (preset === "brightstar") {
      const brand = "BrightStar Care";
      const site = "https://www.brightstarcare.com/west-portland";
      onChange({
        legalCompany: "LJC & COMPANY HEALTHCARE LLC",
        dba: brand,
        website: site,
        businessAddress: "1675 SW Marlow ave, Portland Oregon 97225",
        phoneNumber: "+15036206011",
        email: "staffing-westptld@brightstarcare.com",
        effectiveDate: "July 2026",
        privacyPolicyUrl: "https://www.brightstarcare.com/west-portland/privacy-policy",
        termsUrl: "https://www.brightstarcare.com/west-portland/terms-and-conditions",
        sampleMessages: getDefaultSampleMessagesList(brand, site),
        customFields: [],
      });
    } else {
      const brand = "Express Employment Professionals";
      const site = "https://www.expresspros.com/us-pennsylvania-westmoreland-fayette";
      onChange({
        legalCompany: "PSJK Associates Inc",
        dba: brand,
        website: site,
        businessAddress: "4012 Rt 130, Irvin, Pennsylvania -15642",
        phoneNumber: "+17243927190",
        email: "haily.rotharmel@expresspros.com",
        effectiveDate: "July 2026",
        privacyPolicyUrl: "https://docs.google.com/document/d/1EbWTdTx5RZDd1im4DmZxuI7gcJsgvs5jH5E9oXR2nYg/edit?usp=sharing",
        termsUrl: "https://docs.google.com/document/d/1Niz7bdT-J9WSnfwXNAzn5UTKPWWmryeSbV5YbzprCQA/edit?usp=sharing",
        sampleMessages: getDefaultSampleMessagesList(brand, site),
        customFields: [],
      });
    }
  };

  const handleReset = () => {
    onChange({
      legalCompany: "",
      dba: "",
      website: "",
      businessAddress: "",
      phoneNumber: "",
      email: "",
      effectiveDate: "July 2026",
      privacyPolicyUrl: "",
      termsUrl: "",
      sampleMessages: [],
      customFields: [],
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-5">
      {/* Header & Presets */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Company & Contact Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input info to populate all 3 compliance documents
            </p>
          </div>
          <button
            onClick={handleReset}
            title="Clear all fields"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => loadPreset("brightstar")}
            className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200/60 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Preset: BrightStar Care
          </button>
          <button
            onClick={() => loadPreset("expresspros")}
            className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            Preset: ExpressPros
          </button>
        </div>
      </div>

      {/* Main Standard Fields */}
      <div className="space-y-4">
        {/* Legal Company */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Legal Company Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="legalCompany"
              value={formData.legalCompany}
              onChange={handleChange}
              placeholder="e.g. LJC & COMPANY HEALTHCARE LLC"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
              required
            />
          </div>
        </div>

        {/* DBA / Brand Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            DBA / Brand Name <span className="text-slate-400 font-normal">(Used in SMS & headers)</span>
          </label>
          <input
            type="text"
            name="dba"
            value={formData.dba}
            onChange={handleDbaChange}
            placeholder="e.g. BrightStar Care (defaults to Legal Company if blank)"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
          />
        </div>

        {/* Website URL (Auto-syncs in sample messages) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Website URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleWebsiteChange}
              placeholder="https://www.example.com"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
              required
            />
          </div>
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Street, City, State ZIP"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
              required
            />
          </div>
        </div>

        {/* Phone & Email (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span> <span className="text-[10px] text-slate-400 font-normal">(Numbers only)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="phoneNumber"
                inputMode="tel"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+15036206011"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Effective Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Effective Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              placeholder="e.g. July 2026 or Current Month"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* DYNAMIC CUSTOM FIELDS (ADD / DELETE OPTIONAL FIELDS)     */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setShowCustomFields(!showCustomFields)}
              className="text-xs font-bold text-slate-800 flex items-center gap-1.5 hover:text-indigo-600 transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Custom Information Fields ({formData.customFields.length})</span>
              {showCustomFields ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Field
            </button>
          </div>

          {showCustomFields && (
            <div className="space-y-2.5">
              {formData.customFields.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200">
                  No extra fields added. Click &quot;+ Add Field&quot; to add custom attributes (e.g. Support Hours, Fax Number, State License, etc.).
                </p>
              ) : (
                formData.customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateCustomField(field.id, "label", e.target.value)}
                      placeholder="Field Name (e.g. Support Hours)"
                      className="w-1/3 p-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleUpdateCustomField(field.id, "value", e.target.value)}
                      placeholder="Field Value"
                      className="flex-1 p-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomField(field.id)}
                      title="Delete this field"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* DYNAMIC SAMPLE MESSAGES (BUTTON TO OPEN/EDIT)            */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <MessageSquareText className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">
                SMS Sample Messages ({formData.sampleMessages.length})
              </span>
            </div>

            {/* Prominent Action Button: Click to edit */}
            <button
              type="button"
              onClick={() => setShowSampleMessages(!showSampleMessages)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                showSampleMessages
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
            >
              {showSampleMessages ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Sample Messages
                </>
              )}
            </button>
          </div>

          {/* Collapsed Compact State */}
          {!showSampleMessages && (
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs flex items-center justify-between">
              <span className="text-purple-900 font-medium">
                {formData.sampleMessages.length} messages auto-synced with Website & Brand
              </span>
              <button
                type="button"
                onClick={() => setShowSampleMessages(true)}
                className="text-[11px] font-bold text-purple-700 underline hover:text-purple-900"
              >
                Customize text
              </button>
            </div>
          )}

          {/* Expanded Edit Form */}
          {showSampleMessages && (
            <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-purple-200/80 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-[11px] font-medium text-slate-500">
                  Edit titles & messages below:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRegenerateSamples}
                    title="Reset sample messages to default using current brand & website"
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSampleMessage}
                    title="Add a new custom sample message"
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded-lg border border-purple-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {formData.sampleMessages.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">
                  No sample messages. Click &quot;+ Add&quot; to add one.
                </p>
              ) : (
                formData.sampleMessages.map((item, idx) => (
                  <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[11px] font-bold text-purple-700">#{idx + 1}</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateSampleMessage(item.id, "title", e.target.value)}
                          placeholder="e.g. Customer Care, Marketing, Alert"
                          className="w-full text-xs font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none px-1 py-0.5"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSampleMessage(item.id)}
                        title="Delete this sample message"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={item.message}
                      onChange={(e) => handleUpdateSampleMessage(item.id, "message", e.target.value)}
                      placeholder="Enter the sample message body..."
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                ))
              )}

              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500 italic">
                  * Note: Carrier STOP/HELP compliance is automatically appended.
                </span>
                <button
                  type="button"
                  onClick={handleAddSampleMessage}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another sample message
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Opt-In Links (Collapsible/Advanced) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-indigo-500" />
            Consent Form Links (Optional)
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Privacy Policy URL</label>
              <input
                type="url"
                name="privacyPolicyUrl"
                value={formData.privacyPolicyUrl || ""}
                onChange={handleChange}
                placeholder={`${formData.website ? formData.website + '/privacy-policy' : 'https://...'}`}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-0.5">Terms & Conditions URL</label>
              <input
                type="url"
                name="termsUrl"
                value={formData.termsUrl || ""}
                onChange={handleChange}
                placeholder={`${formData.website ? formData.website + '/terms-and-conditions' : 'https://...'}`}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Highlighting Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 bg-amber-50/70 border border-amber-200/70 rounded-xl p-2.5 hover:bg-amber-100/50 transition">
            <input
              type="checkbox"
              checked={highlightFields}
              onChange={(e) => setHighlightFields(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span className="font-medium">
              Highlight dynamic fields in preview
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
