export interface SampleMessageItem {
  id: string;
  title: string;
  message: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  isLink?: boolean;
}

export interface CompanyInfo {
  legalCompany: string;
  dba: string;
  website: string;
  businessAddress: string;
  phoneNumber: string;
  email: string;
  effectiveDate: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  // Dynamic list of sample messages (Add / Edit / Delete)
  sampleMessages: SampleMessageItem[];
  // Dynamic list of custom fields (Add / Edit / Delete)
  customFields: CustomField[];
}

export type ActiveDocType = 'privacy' | 'terms' | 'consent';

export function getDefaultSampleMessagesList(brand: string, website: string): SampleMessageItem[] {
  const b = brand || "Example Brand";
  const w = website || "https://www.example.com";
  return [
    {
      id: "sample-1",
      title: "Account notification",
      message: `Congratulations on completing your onboarding documents! Meet with one of our Employment Specialists to discuss current job opportunities that match your skills. Visit our office Monday–Friday from 8:00 AM–5:00 PM (best times: 8:00–11:00 AM or 12:30–4:30 PM). For more information visit : ${w}`,
    },
    {
      id: "sample-2",
      title: "Customer Care",
      message: `${b}: Hi, this is Alyssa. We've updated your availability through Friday as requested. Your recruiter will contact you when a matching opportunity becomes available. Remember to update your availability Monday–Friday by 8:00 AM at ${w} using your email as your username.`,
    },
    {
      id: "sample-3",
      title: "Marketing",
      message: `${b}: Your application status has been updated. We have an immediate 2nd shift opening in Irwin starting at $20/hour that matches your profile. Please reply if you're interested or call our office for more information. For more information visit : ${w}.`,
    },
  ];
}

export const INITIAL_COMPANY_DATA: CompanyInfo = {
  legalCompany: "Example Company LLC",
  dba: "Example Brand",
  website: "https://www.example.com",
  businessAddress: "123 Main Street, Suite 100, Austin, TX 78701",
  phoneNumber: "+15551234567",
  email: "support@example.com",
  effectiveDate: "July 2026",
  privacyPolicyUrl: "https://www.example.com/privacy-policy",
  termsUrl: "https://www.example.com/terms-and-conditions",
  sampleMessages: getDefaultSampleMessagesList("Example Brand", "https://www.example.com"),
  customFields: [],
};
