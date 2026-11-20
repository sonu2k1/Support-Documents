import React, { useState } from "react";
import { CompanyInfo, ActiveDocType } from "../types/document";
import { PrivacyPolicyDoc } from "./PrivacyPolicyDoc";
import { TermsConditionsDoc } from "./TermsConditionsDoc";
import { ConsentFormDoc } from "./ConsentFormDoc";
import { downloadPdf, downloadAllPdfsZip } from "../utils/pdfGenerator";
import { downloadDocx } from "../utils/docxGenerator";
import { 
  FileText, 
  Download, 
  Printer, 
  Archive, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface DocumentViewerProps {
  formData: CompanyInfo;
  activeDoc: ActiveDocType;
  setActiveDoc: (doc: ActiveDocType) => void;
  highlightFields: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  formData,
  activeDoc,
  setActiveDoc,
  highlightFields,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState(false);

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
    <div className="flex flex-col h-full bg-slate-200/70 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Bar with Document Tabs (Fixed/Sticky Header of Right Pane) */}
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

      {/* Document Content Viewport (Independent Scroll with smooth custom scrollbar) */}
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

      {/* Bottom Info Bar (Fixed/Sticky Footer of Right Pane) */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-5 py-2 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>A2P / 10DLC Compliance Formats</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Independent Dual-Pane View
        </div>
      </div>
    </div>
  );
};
