# A2P 10DLC Compliance Document Generator & PDF Editor

A Next.js web application designed to generate, customize, preview, and export 10DLC / A2P carrier-compliant documents:
1. **Privacy Policy**
2. **SMS Terms and Conditions**
3. **SMS Consent – Customer Care Opt-In Authorization**

## Features

- **Dynamic Company & Contact Information**: Real-time injection of Legal Company Name, DBA/Brand, Website, Address, Phone, Email, and Effective Date across all 3 documents.
- **Custom Information Fields**: Add and delete custom business fields (e.g. Support Hours, Fax Number, State License, etc.).
- **Editable Sample Messages**: Add, customize, and delete multiple SMS sample messages with automatic STOP/HELP carrier compliance disclaimers.
- **Strict Input Validation**: Phone number inputs strictly allow numeric digits with optional leading `+`.
- **Dual Independent Scroll View**: Left form and right document preview scroll completely independently for a smooth editing experience.
- **Real-Time Dynamic Highlighting**: Toggle field highlights to instantly see where company inputs appear in documents.
- **Pixel-Perfect PDF Export**: Generates high-resolution vector A4 PDFs matching standard Google Docs / Microsoft Word styling (Office Theme blue headers, crisp serif typography).
- **DOCX Word Export**: Download Privacy Policy and SMS Terms in `.docx` format.
- **1-Click All 3 ZIP Bundle**: Download all 3 completed compliance PDFs bundled in a single ZIP file.
- **Pre-configured Presets**: 1-click loading for BrightStar Care and ExpressPros templates.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
# or for production build
npm run build && npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **jsPDF** (Vector PDF generation)
- **docx** (Word document generation)
- **JSZip** & **FileSaver** (Bundle downloading)
- **Lucide Icons**
