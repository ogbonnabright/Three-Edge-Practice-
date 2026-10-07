
export type NavItem = {
  label: string;
  path: string;
};

export type Staff = {
  name: string;
  role: string;
  email: string;
};

export type SubPractice = {
  title: string;
  details: string;
  staff?: Staff[];
};

export type PracticeArea = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  subPractices: SubPractice[];
};

export type TeamMember = {
  id?: string;
  name: string;
  role: string;
  category?: 'Partners' | 'Managing Counsel' | 'Senior Associates' | 'Associates';
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  practiceAreas?: string[];
  bio: string;
  fullBio?: string;
  education?: string[];
  admissions?: string[];
  keyMatters?: string[];
  image: string;
};

export type Insight = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  author?: string;
};

export type BigWin = {
  title: string;
  year: string;
  description: string;
  result: string;
};

export type RegionalOffice = {
  id: string;
  city: string;
  state: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  partnerInCharge?: string;
  mapQuery: string;
  practiceFocus: string[];
};

export type CaseUpdateType =
  | 'Court Hearing'
  | 'Court Ruling / Judgment'
  | 'Filing of Processes'
  | 'Service of Court Documents'
  | 'Adjournment'
  | 'Settlement Development'
  | 'Correspondence'
  | 'Regulatory Development'
  | 'Investigative Development'
  | 'Client Instruction'
  | 'Legal Milestone'
  | 'Next Steps'
  | 'Change in Case Status'
  | 'Internal Review'
  | 'Other Significant Development';

export type CaseUpdate = {
  id: string;
  date: string;
  title: string;
  notes: string;
  author: string;
  type?: CaseUpdateType | string;
  visibility?: 'Client Visible' | 'Internal/Confidential';
  caseStatus?: CaseStatus;
  nextAction?: string;
  nextActionDate?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  additionalRemarks?: string;
};

export type MatterCategory =
  | 'Compliance & Regulatory Advisory'
  | 'Corporate & Commercial Legal Support'
  | 'Government Relations, Public Policy & ESG'
  | 'Corporate Criminal Defense & Investigations'
  | 'Dispute Resolution & Commercial Advocacy'
  | 'Energy, Maritime & Natural Resources'
  | 'Tax Advisory & Fiscal Structuring'
  | 'IT Law, Tech Regulatory & Data Protection';

export type CaseDocumentCategory =
  | 'Legal Opinion / Advisory Memo'
  | 'Compliance Audit & Impact Report'
  | 'Commercial Contract / Transaction Draft'
  | 'Regulatory Filing / Statutory Permit'
  | 'Data Protection (NDPA) Framework'
  | 'Tax Assessment & Defense Filing'
  | 'Originating Summons'
  | 'Brief of Argument'
  | 'Affidavit'
  | 'Ruling'
  | 'Compliance Audit'
  | 'Settlement Draft';

export type CaseDocument = {
  id: string;
  title: string;
  category: CaseDocumentCategory | string;
  filingDate: string;
  fileSize: string;
  status: 'Filed' | 'Served' | 'Drafting' | 'Certified' | 'Executed' | 'Approved' | 'Under Review';
};

export type CaseStatus = 
  | 'Active Advisory / Retainer'
  | 'Regulatory Audit & Compliance Review'
  | 'Transactional Drafting & Negotiation'
  | 'Statutory Filing & Licensing'
  | 'Pre-Charge Investigation & Defense'
  | 'Arbitration in Progress'
  | 'Settlement Discussions'
  | 'Pre-Trial Discovery'
  | 'Active Trial'
  | 'Regulatory Review'
  | 'Closed / Decided';

export type ClientStatus = 'Active' | 'Deactivated';

export type ClientNotice = {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'Normal' | 'Urgent' | 'Privileged';
  sender: string;
};

export type ClientProfile = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  organization: string;
  representative: string;
  phone: string;
  address: string;
  status: ClientStatus;
  registeredAt: string;
  notes?: string;
  linkedCaseCount?: number;
};

export type LegalCase = {
  id: string;
  caseNumber: string; // Firm Docket / File Reference Number (e.g. TEP-MAT-2026-0419)
  docketNumber?: string; // Firm Docket / File Reference Number
  suitNumber?: string; // Suit / Case Number (court suit number or official proceeding ref)
  title: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  practiceArea: string;
  matterCategory?: MatterCategory | string;
  matterTrack?: MatterCategory | string;
  leadAttorney: string;
  leadAttorneyEmail: string;
  regionalOffice: string;
  status: CaseStatus;
  stage: string;
  filingDate: string;
  nextHearingDate?: string;
  courtJurisdiction: string;
  forumOrAuthority?: string;
  judgeOrPanel?: string;
  presidingOfficer?: string;
  nextMilestoneLabel?: string;
  summary: string;
  recentUpdates: CaseUpdate[];
  documents: CaseDocument[];
  clientAccess?: 'Active' | 'Deactivated' | 'Revoked';
  clientNotices?: ClientNotice[];
  createdAt: string;
  updatedAt: string;
};

export type UserRole = 'Admin' | 'Client';

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  photoURL?: string | null;
  phoneNumber?: string | null;
  organization?: string;
  createdAt: string;
};

export type ClientUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  role?: UserRole;
};

export type FirmClient = {
  uid: string;
  name: string;
  email: string;
  organization?: string;
  activeCasesCount: number;
  totalCasesCount: number;
  lastMatterFiling?: string;
};
