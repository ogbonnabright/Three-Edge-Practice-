import { NavItem, PracticeArea, TeamMember, Insight, BigWin } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'THE FIRM', path: '/firm' },
  { label: 'PRACTICE', path: '/practice' },
  { label: 'BIG WINS', path: '/wins' },
  { label: 'TEAM', path: '/team' },
  { label: 'INSIGHTS', path: '/insights' },
  { label: 'CAREERS', path: '/careers' },
  { label: 'CONTACT', path: '/contact' },
];

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'compliance',
    title: 'Compliance and Advisory',
    description: 'Navigating complex regulatory landscapes with precision and foresight.',
    fullDescription: 'Our Compliance and Advisory group works with institutional clients to architect robust frameworks that not only meet current legal standards but anticipate future regulatory shifts. We focus on risk mitigation and sustainable corporate governance.',
    subPractices: [
      {
        title: 'AML/CFT Compliance and Advisory',
        details: 'We provide comprehensive Anti-Money Laundering and Counter-Financing of Terrorism strategies in line with the Money Laundering (Prevention and Prohibition) Act, 2022. Our services include institutional risk assessments, KYC/CDD framework design, and representation during regulatory audits by the EFCC, CBN, or SEC. We offer specialized support including the outsourcing of qualified Compliance Officers, ongoing institutional AML/CFT training for employees, and the management of mandatory disclosures and regulatory reporting requirements.',
        staff: [
          { name: 'Oluwaseun Adeyemi', role: 'Managing Partner', email: 's.adeyemi@tep.com.ng' },
          { name: 'Chinyere Okafor', role: 'Senior Partner', email: 'c.okafor@tep.com.ng' }
        ]
      },
      {
        title: 'Import Duty Exemption Advisory',
        details: 'Navigating the fiscal incentives landscape. We assist manufacturers and energy firms in obtaining and maintaining Import Duty Exemption Certificates (IDEC), ensuring significant cost optimization for large-scale capital projects.',
        staff: [
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' }
        ]
      },
      {
        title: 'Data Protection and General Compliance',
        details: 'In the era of the Nigeria Data Protection Act (NDPA) 2023, the General Application and Implementation Directive (GAID) 2025, and the global standards set by the General Data Protection Regulation (GDPR), we protect your data integrity. We conduct privacy impact assessments, draft data processing agreements, and manage breach notification protocols to safeguard corporate reputation and ensure rigorous adherence to evolving local and international regulatory standards.',
        staff: [
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' },
          { name: 'Kevin Azuka', role: 'Senior Associate', email: 'k.azuka@tep.com.ng' }
        ]
      }
    ]
  },
  {
    id: 'government',
    title: 'Government / Public Relations',
    description: 'Strategic engagement to manage stakeholders and mitigate institutional risks.',
    fullDescription: 'TEP acts as the bridge between corporate enterprise and government authority. We manage the delicate balance of public interest and private initiative, particularly in highly regulated sectors like Energy and Infrastructure.',
    subPractices: [
      {
        title: 'Government & Stakeholder Engagement',
        details: 'We manage relationships with key regulators, legislative bodies, and local communities. Our approach is built on transparency, respect, and strategic alignment of interests to ensure project continuity.',
        staff: [
          { name: 'Chinyere Okafor', role: 'Senior Partner', email: 'c.okafor@tep.com.ng' },
          { name: 'Musa Bello', role: 'Public Affairs Director', email: 'm.bello@tep.com.ng' }
        ]
      },
      {
        title: 'Environmental and Social Governance (ESG)',
        details: 'Integrating sustainability into the corporate DNA. We advise on environmental impact assessments, social responsibility frameworks, and governance structures that meet international ESG reporting standards.',
        staff: [
          { name: 'Oluwaseun Adeyemi', role: 'Managing Partner', email: 's.adeyemi@tep.com.ng' },
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' }
        ]
      },
      {
        title: 'Crisis and Reputational Management',
        details: 'When institutional challenges arise, we provide decisive leadership. We work with PR teams to handle legal communication and strategy during industrial actions, environmental incidents, or regulatory disputes.',
        staff: [
          { name: 'Chinyere Okafor', role: 'Senior Partner', email: 'c.okafor@tep.com.ng' }
        ]
      }
    ]
  },
  {
    id: 'criminal',
    title: 'Corporate Criminal Defense',
    description: 'Defending corporate integrity through rigorous legal strategy and advocacy.',
    fullDescription: 'Our defense group is composed of seasoned trial lawyers and forensic experts. We represent corporate entities and executives facing the full weight of state power, ensuring that due process and corporate rights are rigorously upheld.',
    subPractices: [
      {
        title: 'Regulatory Investigations',
        details: 'Defense against EFCC, ICPC, and other specialized enforcement agencies. We manage document production, witness preparation, and negotiation during the pre-charge phase of investigations.',
        staff: [
          { name: 'Ibrahim Musa', role: 'Partner, Criminal Defense', email: 'i.musa@tep.com.ng' }
        ]
      },
      {
        title: 'White Collar & Corporate Crime',
        details: 'Comprehensive defense strategy for allegations of fraud, embezzlement, insider trading, or tax evasion. We combine technical accounting knowledge with courtroom advocacy to deliver decisive results.',
        staff: [
          { name: 'Ibrahim Musa', role: 'Partner, Criminal Defense', email: 'i.musa@tep.com.ng' },
          { name: 'Umar Farouk', role: 'Senior Litigation Counsel', email: 'u.farouk@tep.com.ng' }
        ]
      },
      {
        title: 'Asset Forfeiture & Recovery',
        details: 'Protecting corporate assets during litigation. We challenge interim forfeiture orders and assist in the legal recovery of assets targeted by regulatory enforcement actions.',
        staff: [
          { name: 'Ibrahim Musa', role: 'Partner, Criminal Defense', email: 'i.musa@tep.com.ng' }
        ]
      }
    ]
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Oluwaseun Adeyemi',
    role: 'Managing Partner',
    bio: 'With over two decades of experience in corporate law and regulatory affairs, Oluwaseun leads the firm with a vision of strategic excellence.',
    image: 'https://picsum.photos/seed/tep1/400/500'
  },
  {
    name: 'Chinyere Okafor',
    role: 'Senior Partner',
    bio: 'An expert in government relations and crisis management, Chinyere has successfully navigated complex regulatory storms for multinational clients.',
    image: 'https://picsum.photos/seed/tep2/400/500'
  },
  {
    name: 'Ibrahim Musa',
    role: 'Partner, Criminal Defense',
    bio: 'A formidable advocate in corporate crime defense, Ibrahim is known for his analytical rigor and courtroom successes.',
    image: 'https://picsum.photos/seed/tep3/400/500'
  },
  {
    name: 'Sarah Thompson',
    role: 'Associate Partner',
    bio: 'Specializing in data protection and ESG advisory, Sarah brings a modern perspective to compliance in the digital age.',
    image: 'https://picsum.photos/seed/tep4/400/500'
  }
];

export const INSIGHTS: Insight[] = [
  {
    title: 'Navigating the New AML/CFT Framework',
    category: 'Regulatory',
    date: 'OCT 24, 2024',
    excerpt: 'An in-depth analysis of recent changes in anti-money laundering regulations and their impact on corporate governance.',
    image: 'https://picsum.photos/seed/news1/600/400'
  },
  {
    title: 'ESG: More Than Just a Buzzword',
    category: 'Advisory',
    date: 'SEP 15, 2024',
    excerpt: 'Why Environmental and Social Governance is becoming the cornerstone of long-term corporate stability in Nigeria.',
    image: 'https://picsum.photos/seed/news2/600/400'
  },
  {
    title: 'Defense Strategies in High-Profile Investigations',
    category: 'Criminal Defense',
    date: 'AUG 30, 2024',
    excerpt: 'Key considerations for corporate entities facing regulatory investigations and potential criminal charges.',
    image: 'https://picsum.photos/seed/news3/600/400'
  }
];

export const BIG_WINS: BigWin[] = [
  {
    title: 'Successful Defense in $500M Regulatory Dispute',
    year: '2023',
    description: 'Secured a favorable outcome for a leading telecommunications company in a multi-jurisdictional enforcement case.',
    result: 'Full dismissal of all regulatory charges.'
  },
  {
    title: 'Nationwide Compliance Restructuring',
    year: '2022',
    description: 'Architected and implemented a comprehensive AML/CFT framework for a top-tier financial institution.',
    result: 'Exceeded all Central Bank audit standards.'
  },
  {
    title: 'Crisis Management for Energy Major',
    year: '2021',
    description: 'Managed a high-stakes reputational crisis involving community stakeholders and government agencies.',
    result: 'Resolved within 90 days with zero litigation.'
  }
];