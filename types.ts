
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

export type CaseUpdate = {
  id: string;
  date: string;
  title: string;
  notes: string;
  author: string;
  type?: 'Court Hearing' | 'Filing' | 'Settlement Meeting' | 'Regulatory Notice' | 'Internal Review';
};

export type CaseDocument = {
  id: string;
  title: string;
  category: 'Originating Summons' | 'Brief of Argument' | 'Affidavit' | 'Ruling' | 'Compliance Audit' | 'Settlement Draft';
  filingDate: string;
  fileSize: string;
  status: 'Filed' | 'Served' | 'Drafting' | 'Certified';
};

export type CaseStatus = 
  | 'Active Trial' 
  | 'Pre-Trial Discovery' 
  | 'Regulatory Review' 
  | 'Arbitration in Progress' 
  | 'Settlement Discussions' 
  | 'Closed / Decided';

export type LegalCase = {
  id: string;
  caseNumber: string;
  title: string;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  practiceArea: string;
  leadAttorney: string;
  leadAttorneyEmail: string;
  regionalOffice: string;
  status: CaseStatus;
  stage: string;
  filingDate: string;
  nextHearingDate?: string;
  courtJurisdiction: string;
  judgeOrPanel?: string;
  summary: string;
  recentUpdates: CaseUpdate[];
  documents: CaseDocument[];
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
