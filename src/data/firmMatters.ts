import { LegalCase, ClientProfile, MatterCategory, CaseStatus, CaseDocumentCategory, CaseUpdateType } from '../../types';

export interface PracticePreset {
  name: string;
  category: MatterCategory;
  forum: string;
  presiding: string;
  status: CaseStatus;
  stage: string;
  nextMilestone: string;
  docCategory: CaseDocumentCategory;
  docTitle: string;
  updateTitle: string;
  updateType: CaseUpdateType;
}

export const PRACTICE_PRESETS: PracticePreset[] = [
  {
    name: 'Compliance and Advisory',
    category: 'Compliance & Regulatory Advisory',
    forum: 'Nigeria Data Protection Commission (NDPC) / CAC',
    presiding: 'National Commissioner / Registrar-General',
    status: 'Regulatory Audit & Compliance Review',
    stage: 'Regulatory Compliance Audit & Impact Assessment',
    nextMilestone: 'NOV 15, 2026 - Statutory NDPC Audit Filing Deadline',
    docCategory: 'Compliance Audit & Impact Report',
    docTitle: 'Regulatory Compliance Audit & Impact Report',
    updateTitle: 'Compliance Review & Retainer Initialized',
    updateType: 'Regulatory Development'
  },
  {
    name: 'General Corporate/Commercial Legal Support',
    category: 'Corporate & Commercial Legal Support',
    forum: 'Corporate Affairs Commission (CAC) / Securities & Exchange Commission',
    presiding: 'Registrar-General / Transaction Directorate',
    status: 'Transactional Drafting & Negotiation',
    stage: 'Contract Drafting, Due Diligence & Negotiation',
    nextMilestone: 'NOV 20, 2026 - Definitive Agreement Execution',
    docCategory: 'Commercial Contract / Transaction Draft',
    docTitle: 'Master Commercial Contract & Transaction Draft',
    updateTitle: 'Corporate Transactional Mandate Initiated',
    updateType: 'Legal Milestone'
  },
  {
    name: 'Corporate Criminal Defense',
    category: 'Corporate Criminal Defense & Investigations',
    forum: 'EFCC Legal & Prosecution Directorate / Special Operations Unit',
    presiding: 'Director of Legal & Prosecution / Enforcement Taskforce',
    status: 'Pre-Charge Investigation & Defense',
    stage: 'Pre-Charge Investigation, Document Production & Defense',
    nextMilestone: 'NOV 10, 2026 - Agency Document Production Session',
    docCategory: 'Legal Opinion / Advisory Memo',
    docTitle: 'Statutory Defense Position Paper & Agency Response',
    updateTitle: 'Pre-Charge Defense File & Representation Opened',
    updateType: 'Investigative Development'
  },
  {
    name: 'Tax Advisory & Fiscal Structuring',
    category: 'Tax Advisory & Fiscal Structuring',
    forum: 'Federal Inland Revenue Service (FIRS) - Large Tax Office',
    presiding: 'Director of Corporate Tax Audit & Review Panel',
    status: 'Active Advisory / Retainer',
    stage: 'Tax Assessment Reconciliation & Advance Ruling Advisory',
    nextMilestone: 'NOV 18, 2026 - FIRS Technical Audit Reconciliation',
    docCategory: 'Tax Assessment & Defense Filing',
    docTitle: 'Tax Advisory Position Paper & Fiscal Defense',
    updateTitle: 'Fiscal Review & Advisory Protocol Initiated',
    updateType: 'Legal Milestone'
  },
  {
    name: 'Energy, Maritime & Natural Resources',
    category: 'Energy, Maritime & Natural Resources',
    forum: 'Nigerian Upstream Petroleum Regulatory Commission (NUPRC) / Federal High Court',
    presiding: 'Commission Chief Executive / Admiralty Division Judge',
    status: 'Active Advisory / Retainer',
    stage: 'Concession Review, Host Community Trust & Local Content Compliance',
    nextMilestone: 'DEC 02, 2026 - PIA Concession Statutory Milestone',
    docCategory: 'Regulatory Filing / Statutory Permit',
    docTitle: 'PIA Concession & Operational Compliance Framework',
    updateTitle: 'Energy Concession & Statutory Framework Onboarded',
    updateType: 'Regulatory Development'
  },
  {
    name: 'IT Law, Tech Regulatory & Data Protection',
    category: 'IT Law, Tech Regulatory & Data Protection',
    forum: 'Nigeria Data Protection Commission (NDPC) / SEC Sandbox',
    presiding: 'National Commissioner & DPCO Audit Directorate',
    status: 'Regulatory Audit & Compliance Review',
    stage: 'DPIA Privacy Audit & Software Licensing Framework',
    nextMilestone: 'NOV 25, 2026 - Statutory Tech Compliance Filing',
    docCategory: 'Data Protection (NDPA) Framework',
    docTitle: 'Data Protection Impact Assessment (NDPA Framework)',
    updateTitle: 'Technology Regulatory Retainer & Audit Activated',
    updateType: 'Regulatory Development'
  },
  {
    name: 'Government Relations, Public Policy & ESG',
    category: 'Government Relations, Public Policy & ESG',
    forum: 'National Assembly Joint Committee / Ministry of Environment',
    presiding: 'Director of Public-Private Concessions & ESG Board',
    status: 'Active Advisory / Retainer',
    stage: 'Policy Advisory, Public Procurement & ESG Impact Verification',
    nextMilestone: 'NOV 30, 2026 - Ministerial Stakeholder Consultation',
    docCategory: 'Compliance Audit & Impact Report',
    docTitle: 'ESG Impact Verification & Public Policy Advisory',
    updateTitle: 'Public Policy Advisory & Stakeholder Liaison Initiated',
    updateType: 'Regulatory Development'
  },
  {
    name: 'Dispute Resolution & Commercial Advocacy',
    category: 'Dispute Resolution & Commercial Advocacy',
    forum: 'Federal High Court, Abuja Judicial Division',
    presiding: 'Hon. Justice M. A. Idris (Presiding)',
    status: 'Active Trial',
    stage: 'Pleadings Exchange & Substantive Hearing',
    nextMilestone: 'NOV 18, 2026 at 09:30 AM',
    docCategory: 'Originating Summons',
    docTitle: 'Originating Process & Statement of Claim',
    updateTitle: 'Commercial Dispute Docket Formally Instituted',
    updateType: 'Filing of Processes'
  }
];

// Clean state: Zero mock/default clients or seeded cases
export const DEMO_CLIENTS: ClientProfile[] = [];
export const INITIAL_FIRM_CASES: LegalCase[] = [];
