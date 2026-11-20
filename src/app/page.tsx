"use client";

import React, { useState } from "react";
import { CompanyInfo, INITIAL_COMPANY_DATA, ActiveDocType } from "../types/document";
import { DocumentForm } from "../components/DocumentForm";
import { DocumentViewer } from "../components/DocumentViewer";
import { 
  FileCheck, 
  Sparkles, 
  Download 
} from "lucide-react";
import { downloadAllPdfsZip } from "../utils/pdfGenerator";

export default function Home() {
  const [formData, setFormData] = useState<CompanyInfo>(INITIAL_COMPANY_DATA);
  const [activeDoc, setActiveDoc] = useState<ActiveDocType>("terms");
  const [highlightFields, setHighlightFields] = useState<boolean>(true);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleDownloadAll = async () => {
    try {
      setIsZipping(true);
      await downloadAllPdfsZip(formData);
    } catch (e) {
      console.error(e);
      alert("Error generating PDF ZIP");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100">
      {/* Top Fixed Header */}
      <header className="h-14 flex-shrink-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="h-full max-w-[1700px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                A2P 10DLC Document Generator & PDF Editor
              </h1>
              <p className="hidden sm:block text-[11px] text-slate-500">
                Privacy Policy • SMS Terms & Conditions • SMS Consent Opt-In
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadAll}
              disabled={isZipping}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? "Generating..." : "Download All 3 (ZIP)"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Pane Independent Scroll View */}
      <div className="flex-1 h-[calc(100vh-3.5rem)] max-w-[1700px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Form Editor (Independent Scroll) */}
        <div className="lg:col-span-4 xl:col-span-4 h-full overflow-y-auto pr-1 pb-12 space-y-4 custom-scrollbar">
          <DocumentForm
            formData={formData}
            onChange={setFormData}
            highlightFields={highlightFields}
            setHighlightFields={setHighlightFields}
          />

          {/* Quick Guidance Card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              How it works:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-indigo-800 leading-relaxed text-[11.5px]">
              <li>Edit company info, custom fields, or sample messages on the left.</li>
              <li>Right panel live preview automatically reflects all changes in real time.</li>
              <li>Both panels scroll independently for ease of editing.</li>
              <li>Download individual PDFs or click <strong>Download All 3</strong> for a ZIP bundle.</li>
            </ol>
          </div>
        </div>

        {/* Right Column: Live Document Preview (Independent Scroll) */}
        <div className="lg:col-span-8 xl:col-span-8 h-full flex flex-col overflow-hidden">
          <DocumentViewer
            formData={formData}
            activeDoc={activeDoc}
            setActiveDoc={setActiveDoc}
            highlightFields={highlightFields}
          />
        </div>
      </div>
    </main>
  );
}
