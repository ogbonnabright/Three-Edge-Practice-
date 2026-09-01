
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