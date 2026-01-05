
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
  name: string;
  role: string;
  bio: string;
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