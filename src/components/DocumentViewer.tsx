import React, { useState, useEffect } from "react";
import { CompanyInfo, ActiveDocType } from "../types/document";
import { PrivacyPolicyDoc } from "./PrivacyPolicyDoc";
import { TermsConditionsDoc } from "./TermsConditionsDoc";
import { ConsentFormDoc } from "./ConsentFormDoc";
import { downloadPdf, downloadAllPdfsZip } from "../utils/pdfGenerator";
import { downloadDocx } from "../utils/docxGenerator";
import { getCleanDocumentText } from "../utils/textExtractor";
import { 
  FileText, 
  Download, 
  Printer, 
  Archive, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2,
  ZoomIn,
  ZoomOut,
  Cloud,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  X,
  AlertCircle
} from "lucide-react";

interface DocumentViewerProps {
  formData: CompanyInfo;
  setFormData: (data: CompanyInfo) => void;
  activeDoc: ActiveDocType;
  setActiveDoc: (doc: ActiveDocType) => void;
  highlightFields: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  formData,
  setFormData,
  activeDoc,
  setActiveDoc,
  highlightFields,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState(false);

  // Google Doc Integration States
  const defaultWebhookUrl = "https://script.google.com/a/macros/emitrr.com/s/AKfycbxwWOIA3j-zT097hVF3pUHqigm5e6b9AHurtxSSmk1rU2F_7xY_6zGJIQvigSCzxWlmTw/exec";
  const [webhookUrl, setWebhookUrl] = useState<string>(defaultWebhookUrl);
  const [isCreatingDoc, setIsCreatingDoc] = useState<boolean>(false);
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);
  const [createdDocUrl, setCreatedDocUrl] = useState<string>("");
  const [docError, setDocError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("gapps_script_url");
    if (saved) {
      setWebhookUrl(saved);
    }
  }, []);

  const handleCreateGoogleDoc = async () => {
    setDocModalOpen(true);
    setIsCreatingDoc(true);
    setDocError("");
    setCreatedDocUrl("");

    try {
      const { title, content } = getCleanDocumentText(activeDoc, formData);

      const res = await fetch("/api/create-google-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          webhookUrl,
        }),
      });

      const data = await res.json();

      if (data.success && data.url) {
        setCreatedDocUrl(data.url);
        // Automatically set this URL in the Consent Form links
        if (activeDoc === "privacy") {
          setFormData({
            ...formData,
            privacyPolicyUrl: data.url,
          });
        } else if (activeDoc === "terms") {
          setFormData({
            ...formData,
            termsUrl: data.url,
          });
        }
      } else {
        if (data.error === "AUTH_REQUIRED") {
          setDocError(
            "Google Apps Script Authorization required: Please ensure 'Who has access' in the Apps Script Deployment settings is set to 'Anyone' (or deploy from a personal @gmail.com account)."
          );
        } else {
          setDocError(data.error || "Failed to generate Google Doc. Check script deployment.");
        }
      }
    } catch (err: any) {
      setDocError(err.message || "Network error while connecting to Google Apps Script.");
    } finally {
      setIsCreatingDoc(false);
    }
  };

  const handleCopyLink = () => {
    if (createdDocUrl) {
      navigator.clipboard.writeText(createdDocUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("gapps_script_url", url);
  };

  const handleDownloadPdf = () => {
    downloadPdf(activeDoc, formData);
  };

  const handleDownloadDocx = async () => {
    if (activeDoc === "privacy" || activeDoc === "terms") {
      await downloadDocx(activeDoc, formData);
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsDownloading(true);
      await downloadAllPdfsZip(formData);
    } catch (e) {
      console.error(e);
      alert("Failed to create ZIP file.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/70 rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
      {/* Top Bar with Document Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Document Selection Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveDoc("privacy")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeDoc === "privacy"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            1. Privacy Policy
          </button>
          <button
            onClick={() => setActiveDoc("terms")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeDoc === "terms"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            2. SMS Terms & Conditions
          </button>
          <button
            onClick={() => setActiveDoc("consent")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeDoc === "consent"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            3. SMS Consent Form
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-lg p-1 text-xs text-slate-600 mr-1">
            <button
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px]">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 hover:bg-white rounded transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* NEW: ☁️ Google Doc Link Button */}
          <button
            onClick={handleCreateGoogleDoc}
            title="Create live Google Doc link in your Google Drive"
            className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg flex items-center gap-1.5 transition shadow-xs"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            Google Doc
          </button>

          {/* DOCX button */}
          {(activeDoc === "privacy" || activeDoc === "terms") && (
            <button
              onClick={handleDownloadDocx}
              title="Download Word Document (.docx)"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              DOCX
            </button>
          )}

          {/* Print button */}
          <button
            onClick={handlePrint}
            title="Print Current Document"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download Current PDF */}
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>

          {/* Download All 3 ZIP */}
          <button
            onClick={handleDownloadAllZip}
            disabled={isDownloading}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition active:scale-95"
            title="Download all 3 documents as PDF in a ZIP bundle"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-600" />
            {isDownloading ? "Bundling..." : "All 3 (ZIP)"}
          </button>
        </div>
      </div>

      {/* Document Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
          }}
          className="w-full max-w-[850px] pb-16"
        >
          {activeDoc === "privacy" && (
            <PrivacyPolicyDoc info={formData} highlight={highlightFields} />
          )}
          {activeDoc === "terms" && (
            <TermsConditionsDoc info={formData} highlight={highlightFields} />
          )}
          {activeDoc === "consent" && (
            <ConsentFormDoc info={formData} highlight={highlightFields} />
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-5 py-2 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>A2P / 10DLC Compliance Formats</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Independent Dual-Pane View
        </div>
      </div>

      {/* ======================================================== */}
      {/* GOOGLE DOC GENERATION MODAL                              */}
      {/* ======================================================== */}
      {docModalOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Cloud className="w-5 h-5 text-blue-600" />
                Google Doc Link Generator
              </h3>
              <button
                onClick={() => setDocModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Loading State */}
            {isCreatingDoc && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-semibold text-slate-800">
                  Creating live Google Doc in Google Drive...
                </p>
                <p className="text-xs text-slate-500">
                  Setting public view permissions and fetching share link
                </p>
              </div>
            )}

            {/* Success State */}
            {!isCreatingDoc && createdDocUrl && (
              <div className="space-y-4 py-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <p className="font-bold">Google Doc Successfully Created!</p>
                    <p className="text-emerald-800 mt-0.5">
                      This link has been automatically applied to your <strong>SMS Consent Form</strong> ({activeDoc === "privacy" ? "Privacy Policy Link" : "Terms & Conditions Link"}).
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Shareable Google Docs Link:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdDocUrl}
                      className="flex-1 p-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <a
                    href={createdDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1.5 transition"
                  >
                    Open Google Doc
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setDocModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!isCreatingDoc && docError && (
              <div className="space-y-4 py-2">
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-950 space-y-1">
                    <p className="font-bold">Authorization Notice</p>
                    <p className="text-rose-800">{docError}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900">How to fix in 1 minute:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11.5px]">
                    <li>Open your Google Apps Script project.</li>
                    <li>Click <strong>Deploy ➔ Manage deployments ➔ Edit (Pencil icon)</strong>.</li>
                    <li>Under <strong>&quot;Who has access&quot;</strong>, change from <em>&quot;Anyone within emitrr.com&quot;</em> to <strong>&quot;Anyone&quot;</strong>.</li>
                    <li>Click <strong>Deploy</strong> and you&apos;re all set!</li>
                  </ol>
                </div>

                {/* Edit Webhook URL input */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Google Apps Script Web App URL:
                  </label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => handleSaveWebhook(e.target.value)}
                    className="w-full p-2 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDocModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGoogleDoc}
                    className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
