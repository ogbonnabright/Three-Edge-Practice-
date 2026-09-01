import { NavItem, PracticeArea, TeamMember, Insight, BigWin, RegionalOffice } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'THE FIRM', path: '/firm' },
  { label: 'PRACTICE', path: '/practice' },
  { label: 'BIG WINS', path: '/wins' },
  { label: 'TEAM', path: '/team' },
  { label: 'INSIGHTS', path: '/insights' },
  { label: 'CAREERS', path: '/careers' },
  { label: 'CONTACT', path: '/contact' },
];

export const REGIONAL_OFFICES: RegionalOffice[] = [
  {
    id: 'abuja',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    tagline: 'Firm Headquarters & Regulatory Affairs Practice',
    address: 'Plot 483 Ajose Adeogun Street, Utako, Abuja, FCT, Nigeria',
    phone: '+234 (0) 907 914 0069',
    email: 'abuja@tep.com.ng',
    hours: 'Mon - Fri: 08:00 - 19:00',
    partnerInCharge: 'Chinyere Okafor (Senior Partner)',
    mapQuery: 'Plot 483 Ajose Adeogun Street, Utako, Abuja',
    practiceFocus: [
      'Government & Stakeholder Relations',
      'Supreme Court & Appellate Advocacy',
      'Public Procurement & Federal Concessions',
      'Energy Policy & Regulatory Compliance',
      'Anti-Corruption & Statutory Investigations'
    ]
  },
  {
    id: 'lagos',
    city: 'Lagos',
    state: 'Lagos State',
    tagline: 'Commercial, Banking & Corporate Governance Hub',
    address: '14B Walter Carrington Crescent, Victoria Island, Lagos, Nigeria',
    phone: '+234 (0) 1 270 3980',
    email: 'lagos@tep.com.ng',
    hours: 'Mon - Fri: 08:00 - 19:00',
    partnerInCharge: "Al'qasim Jafar (Managing Partner)",
    mapQuery: 'Walter Carrington Crescent, Victoria Island, Lagos',
    practiceFocus: [
      'Mergers, Acquisitions & Private Equity',
      'AML/CFT & Corporate Criminal Defense',
      'Data Protection, Cyber Law & NDPA',
      'Tax Advisory & Fiscal Optimization',
      'Fintech & Venture Capital Structuring'
    ]
  },
  {
    id: 'kano',
    city: 'Kano',
    state: 'Kano State',
    tagline: 'Northern Commercial Gateway & Trans-Saharan Trade Hub',
    address: 'Suite 501, Bank of Industry Tower, 25 Post Office Road, Bompai / Nassarawa GRA, Kano State, Nigeria',
    phone: '+234 (0) 64 630 890',
    email: 'kano@tep.com.ng',
    hours: 'Mon - Fri: 08:00 - 18:00',
    partnerInCharge: 'Dr. Kabir Sanusi (Partner)',
    mapQuery: '25 Post Office Road, Kano, Nigeria',
    practiceFocus: [
      'Islamic Banking, Sukuk & Non-Interest Finance',
      'Cross-Border Trade & AfCFTA Corridor Advisory',
      'Agribusiness, Commodity Export & Land Tenures',
      'Commercial Arbitration & Northern Division Litigation',
      'Industrial Manufacturing & Import Duty Exemptions (IDEC)'
    ]
  },
  {
    id: 'port-harcourt',
    city: 'Port Harcourt',
    state: 'Rivers State',
    tagline: 'Energy, Natural Resources & Niger Delta Practice',
    address: 'Plot 12 Trans-Amadi Industrial Layout, Port Harcourt, Rivers State, Nigeria',
    phone: '+234 (0) 84 301 220',
    email: 'portharcourt@tep.com.ng',
    hours: 'Mon - Fri: 08:00 - 18:30',
    partnerInCharge: 'Emeka Nnamdi (Senior Counsel)',
    mapQuery: 'Trans-Amadi Industrial Layout, Port Harcourt',
    practiceFocus: [
      'Upstream & Midstream Oil & Gas (PIA 2021)',
      'Host Community Development Trusts (HCDT)',
      'Cabotage, Maritime Security & Vessel Arrests',
      'Environmental Impact Assessment & Remediation',
      'Offshore Service Contracting & Local Content'
    ]
  }
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
          { name: "Al'qasim Jafar", role: 'Managing Partner', email: 'a.jafar@tep.com.ng' },
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
        title: 'Data Protection',
        details: 'In the era of the Nigeria Data Protection Act (NDPA) 2023, the General Application and Implementation Directive (GAID) 2025, and the global standards set by the General Data Protection Regulation (GDPR), we protect your data integrity. We conduct privacy impact assessments, draft data processing agreements, and manage breach notification protocols to safeguard corporate reputation and ensure rigorous adherence to evolving local and international regulatory standards.',
        staff: [
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' },
          { name: 'Kevin Azuka', role: 'Senior Associate', email: 'k.azuka@tep.com.ng' }
        ]
      },
      {
        title: 'Intellectual Property',
        details: 'Protecting innovation and creative assets. We offer comprehensive IP services including trademark registration, patent filings, and copyright protection under the Trademarks Act, Patents and Designs Act, and the Copyright Act 2022. We advise on IP commercialization, licensing agreements, and enforcement strategies to safeguard the intangible assets of technology startups, creative industries, and manufacturing firms.',
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
          { name: "Al'qasim Jafar", role: 'Managing Partner', email: 'a.jafar@tep.com.ng' },
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' }
        ]
      },
      {
        title: 'Crisis and Reputational Management',
        details: 'When institutional challenges arise, we provide decisive leadership. We work with PR teams to handle legal communication and strategy during industrial actions, environmental incidents, host community crises, or regulatory disputes.',
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
  },
  {
    id: 'corporate-commercial',
    title: 'General Corporate/Commercial Legal Support',
    description: 'Comprehensive legal frameworks for core industry operations.',
    fullDescription: 'TEP provides end-to-end legal support for foundational business operations. From fiscal planning to sector-specific regulatory adherence, we ensure that our clients\' corporate structures are resilient and commercially optimized.',
    subPractices: [
      {
        title: 'Tax Advisory',
        details: 'Strategic fiscal planning and compliance. We advise on corporate income tax, VAT, withholding tax, and transfer pricing, ensuring that our clients maintain optimal tax efficiency while adhering to FIRS regulations.',
        staff: [
          { name: 'Kevin Azuka', role: 'Senior Associate', email: 'k.azuka@tep.com.ng' }
        ]
      },
      {
        title: 'Startup Advisory',
        details: 'From incorporation to Series A and beyond. We guide entrepreneurs through the complexities of venture capital, intellectual property protection, and corporate governance in the tech ecosystem.',
        staff: [
          { name: 'Sarah Thompson', role: 'Associate Partner', email: 's.thompson@tep.com.ng' }
        ]
      },
      {
        title: 'Construction and Real Estate',
        details: 'Facilitating complex physical development. We handle land acquisitions, title perfection, joint venture agreements, and regulatory approvals for major infrastructure and residential projects.',
        staff: [
          { name: "Al'qasim Jafar", role: 'Managing Partner', email: 'a.jafar@tep.com.ng' }
        ]
      },
      {
        title: 'Energy and Natural Resources',
        details: 'Navigating the extractive industries. We provide counsel on licensing, PSCs, JVs, and local content compliance in the oil, gas, and solid minerals sectors.',
        staff: [
          { name: 'Chinyere Okafor', role: 'Senior Partner', email: 'c.okafor@tep.com.ng' }
        ]
      }
    ]
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'alqasim-jafar',
    name: "Al'qasim Jafar",
    role: 'Managing Partner',
    category: 'Partners',
    location: 'Lagos',
    email: 'a.jafar@tep.com.ng',
    phone: '+234 (0) 1 270 3980',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['AML/CFT Compliance', 'Corporate & Commercial', 'Tax Advisory', 'ESG Strategy'],
    bio: "With over two decades of experience in corporate law, taxation, and regulatory affairs, Al'qasim leads the firm with a vision of strategic excellence and decisive results.",
    fullBio: "Al'qasim Jafar is the Managing Partner of Three Edge Practice (TEP). He has over 22 years of experience advising Fortune 500 multinationals, domestic conglomerates, and governmental agencies on complex corporate restructuring, tax optimization, and regulatory strategy. Recognized as a market-leading commercial lawyer in Sub-Saharan Africa, he routinely leads multijurisdictional M&A transactions and high-stakes administrative proceedings before statutory regulators.",
    education: [
      'LL.M. (Corporate & Commercial Law), King’s College London',
      'LL.B. (First Class Honours), University of Lagos',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (1999)',
      'Chartered Institute of Taxation of Nigeria (CITN)',
      'Fellow, Institute of Chartered Arbitrators (FCIArb)'
    ],
    keyMatters: [
      'Advised a Tier-1 international bank on its $450M cross-border corporate reorganization across West Africa.',
      'Lead counsel to a multinational energy consortium during negotiations with statutory regulators regarding fiscal compliance under the Petroleum Industry Act.',
      'Architected institutional AML/CFT compliance and governance framework for one of Africa’s largest fintech payment switches.'
    ],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'chinyere-okafor',
    name: 'Chinyere Okafor',
    role: 'Senior Partner',
    category: 'Partners',
    location: 'Abuja',
    email: 'c.okafor@tep.com.ng',
    phone: '+234 (0) 9 461 4000',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Energy & Natural Resources', 'Government Relations', 'Crisis Management', 'Infrastructure'],
    bio: 'An expert in government relations, crisis management, and infrastructure development, Chinyere has successfully navigated complex regulatory storms for multinational clients.',
    fullBio: 'Chinyere Okafor heads TEP’s Abuja office and leads the Energy & Government Relations Practice. With extensive top-tier advisory experience spanning major public-private partnerships, oil & gas concessioning, and crisis dispute mediation, she is known as an indispensable advisor to boards navigating political and regulatory volatility across African jurisdictions.',
    education: [
      'LL.M. (Energy & Infrastructure Law), Harvard Law School',
      'LL.B. (Honours), University of Nigeria, Nsukka',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2003)',
      'Nigerian Bar Association (Section on Business Law)',
      'International Bar Association (Energy Law Section)'
    ],
    keyMatters: [
      'Represented a syndicate of international infrastructure financiers on a $1.2B deep-sea port concession project.',
      'Secured landmark regulatory clearances for a cross-border gas pipeline development consortium.',
      'Successfully guided an international consumer brand through complex parliamentary hearings and executive regulatory settlements.'
    ],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ibrahim-musa',
    name: 'Ibrahim Musa',
    role: 'Partner, White Collar & Dispute Resolution',
    category: 'Partners',
    location: 'Lagos',
    email: 'i.musa@tep.com.ng',
    phone: '+234 (0) 1 270 3982',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['White Collar Defense', 'Commercial Litigation', 'Anti-Corruption', 'International Arbitration'],
    bio: 'A formidable advocate in corporate crime defense and international commercial arbitration, Ibrahim is known for his analytical rigor and courtroom victories.',
    fullBio: 'Ibrahim Musa is a Partner in the Dispute Resolution and White Collar Crime Defense practice. A seasoned trial advocate with appearances at all levels of Nigerian courts up to the Supreme Court, Ibrahim specializes in high-stakes corporate crime, asset forfeiture defense, anti-money laundering litigation, and multi-forum commercial disputes.',
    education: [
      'LL.M. (International Dispute Resolution), London School of Economics (LSE)',
      'LL.B., Ahmadu Bello University, Zaria',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2006)',
      'Fellow, Chartered Institute of Arbitrators UK (FCIArb)',
      'International Association of Defense Counsel'
    ],
    keyMatters: [
      'Successfully defended a multinational financial institution against a N35 Billion regulatory enforcement penalty, achieving complete dismissal.',
      'Represented an executive board in cross-border anti-bribery and corruption investigations spanning Nigeria, the UK, and Switzerland.',
      'Secured multi-million dollar arbitral awards under UNCITRAL and ICC arbitration rules for commercial telecommunication providers.'
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'sarah-thompson',
    name: 'Sarah Thompson',
    role: 'Partner, Data Protection & Cyber Law',
    category: 'Partners',
    location: 'Lagos',
    email: 's.thompson@tep.com.ng',
    phone: '+234 (0) 1 270 3984',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Data Protection & Privacy', 'Cybersecurity Law', 'Fintech Advisory', 'ESG Strategy'],
    bio: 'Specializing in data protection, NDPA compliance, and ESG advisory, Sarah brings a modern global perspective to governance in the digital economy.',
    fullBio: 'Sarah Thompson co-leads TEP’s Digital Economy, Privacy, and Cyber Law Practice Group. She is recognized internationally as a leading voice on the Nigeria Data Protection Act (NDPA) 2023, GAID 2025, and cross-border data transfer mechanisms. Sarah acts as external Data Protection Officer (DPO) and strategic advisor to leading tech unicorns, cloud providers, and digital health platforms.',
    education: [
      'LL.M. (Technology, Media & IP Law), University of Cambridge',
      'LL.B., University of Ibadan',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2010)',
      'Certified Information Privacy Professional/Europe (CIPP/E)',
      'International Association of Privacy Professionals (IAPP)'
    ],
    keyMatters: [
      'Led the NDPA/GDPR compliance audit and privacy architecture transformation for an African digital banking platform with over 15 million users.',
      'Advised global tech conglomerates on cross-border data localization, cloud sovereignty, and regulatory enforcement response.',
      'Structured institutional ESG metrics, human rights compliance, and supply chain reporting standards for multinational consumer brands.'
    ],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tunde-fashola',
    name: 'Babatunde Fashola',
    role: 'Managing Counsel',
    category: 'Managing Counsel',
    location: 'Lagos',
    email: 'b.fashola@tep.com.ng',
    phone: '+234 (0) 1 270 3986',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Real Estate & Construction', 'Banking & Finance', 'Corporate Governance'],
    bio: 'Renowned for his strategic command of complex real estate transactions, project financing, and urban zoning legal frameworks.',
    fullBio: 'Babatunde Fashola is a Managing Counsel with extensive expertise in structuring large-scale property acquisitions, syndication facilities, and commercial real estate development schemes. He provides nuanced commercial counsel to REITs, institutional developers, and private equity funds.',
    education: [
      'LL.M. (Commercial Law), University of Lagos',
      'LL.B., Obafemi Awolowo University, Ile-Ife',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2008)',
      'Nigerian Bar Association (Section on Business Law)'
    ],
    keyMatters: [
      'Structured a $120M multi-asset mixed-use commercial development in Victoria Island, Lagos.',
      'Advised an international hotel chain on management contracts, land tenure regularization, and state fiscal compliance.'
    ],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'amina-shehu',
    name: 'Amina Bello Shehu',
    role: 'Managing Counsel',
    category: 'Managing Counsel',
    location: 'Abuja',
    email: 'a.shehu@tep.com.ng',
    phone: '+234 (0) 9 461 4005',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Public Procurement', 'Corporate Commercial', 'Telecommunications'],
    bio: 'Advising institutional contractors and sovereign entities on statutory public procurement frameworks and commercial concessions.',
    fullBio: 'Amina Bello Shehu heads regulatory transaction advisory in the firm’s Abuja office. She regularly advises telecom operators, defense contractors, and technology companies on statutory bidding, national security clearance, and federal concession agreements.',
    education: [
      'LL.M., University of Aberdeen, Scotland',
      'LL.B., Bayero University Kano',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2009)',
      'Chartered Institute of Arbitrators (MCIArb)'
    ],
    keyMatters: [
      'Advised on national fiber-optic broadband concession contracts with federal regulatory authorities.',
      'Successfully arbitrated complex commercial supply chain dispute valued at $45M.'
    ],
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'emeka-nnamdi',
    name: 'Emeka Nnamdi',
    role: 'Senior Associate',
    category: 'Senior Associates',
    location: 'Port Harcourt',
    email: 'e.nnamdi@tep.com.ng',
    phone: '+234 (0) 84 301 220',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Energy & Natural Resources', 'Environmental Law', 'Maritime & Shipping'],
    bio: 'Focuses on upstream oil & gas operations, maritime security, environmental impact litigation, and community trust frameworks.',
    fullBio: 'Emeka Nnamdi is a Senior Associate based in our Port Harcourt office. He focuses on host community developmental trusts (HCDT) under the PIA 2021, cabotage vessel compliance, and offshore contractual agreements.',
    education: [
      'LL.M. (Maritime & Environmental Law), University of Southampton',
      'LL.B., University of Calabar',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2014)',
      'Nigerian Maritime Law Association'
    ],
    keyMatters: [
      'Established host community governance structures for major deepwater exploration licenses in the Niger Delta.',
      'Drafted vessel charterparty and midstream gas transportation agreements for industrial manufacturers.'
    ],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kemi-adeleke',
    name: 'Kemi Adeleke',
    role: 'Senior Associate',
    category: 'Senior Associates',
    location: 'Lagos',
    email: 'k.adeleke@tep.com.ng',
    phone: '+234 (0) 1 270 3988',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Tax Advisory', 'Corporate Structuring', 'Startups & Venture Capital'],
    bio: 'Advising high-growth technology ventures, fintechs, and venture capital syndicates on tax-efficient structuring and funding rounds.',
    fullBio: 'Kemi Adeleke is a Senior Associate in the Corporate and Tax practices. She assists startups, private equity investors, and multinational tech firms with capital raises, employee share option plans (ESOPs), and fiscal compliance under the Nigeria Tax Reform Acts.',
    education: [
      'LL.B., University of Benin',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2016)',
      'Associate, Chartered Institute of Taxation of Nigeria (ACTI)'
    ],
    keyMatters: [
      'Advised a series-A fintech startup on its $18M equity funding round and cross-border IP holding restructuring.',
      'Handled tax audit clearance and withholding tax defense for an international logistics platform.'
    ],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kabir-sanusi',
    name: 'Dr. Kabir Sanusi',
    role: 'Partner, Northern Practice & Islamic Finance',
    category: 'Partners',
    location: 'Kano',
    email: 'k.sanusi@tep.com.ng',
    phone: '+234 (0) 64 630 892',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Islamic Finance & Sukuk', 'Cross-Border Trade (AfCFTA)', 'Commercial Arbitration', 'Agribusiness & Concessions'],
    bio: 'Heading our Kano regional office, Dr. Sanusi advises sovereign authorities, non-interest banking institutions, and multinational agribusiness conglomerates.',
    fullBio: 'Dr. Kabir Sanusi is the Partner-in-Charge of Three Edge Practice’s Kano regional office. With deep expertise across Northern Nigerian commercial corridors, Islamic finance structurings, Sukuk bond issuances, and cross-border Sahel trade corridors under AfCFTA, he represents financial institutions, industrial manufacturers, and state governments on complex regulatory and transactional mandates.',
    education: [
      'Ph.D. in Islamic Banking & Commercial Law, International Islamic University',
      'LL.M. (Corporate & Finance Law), Queen Mary University of London',
      'LL.B. (First Class Honours), Bayero University Kano',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2004)',
      'Fellow, Chartered Institute of Arbitrators (FCIArb)',
      'Member, Non-Interest Financial Institutions Association of Nigeria'
    ],
    keyMatters: [
      'Advised on a ₦150 Billion State Government Sukuk issuance for infrastructure modernization in Northern Nigeria.',
      'Lead legal advisor to a cross-border agricultural commodity processing conglomerate with operations spanning Kano, Chad, and Niger.',
      'Successfully defended a multinational manufacturing client in a $30M commercial distribution arbitration.'
    ],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'nweye-robinson',
    name: 'Nweye R. Robinson',
    role: 'Managing Counsel, Dispute Resolution & Energy',
    category: 'Managing Counsel',
    location: 'Port Harcourt',
    email: 'rrnweye@tep.com.ng',
    phone: '+234 (0) 84 301 224',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Energy & Natural Resources', 'Commercial Litigation', 'Environmental Law', 'White Collar Defense'],
    bio: 'An accomplished courtroom advocate and energy counsel specializing in complex oil and gas litigation, environmental remediation claims, and appellate advocacy.',
    fullBio: 'Nweye R. Robinson is a Managing Counsel in Three Edge Practice’s Port Harcourt office, co-leading the Energy, Natural Resources and Dispute Resolution practice. With over 15 years of courtroom experience spanning the Federal High Court, Court of Appeal, and Supreme Court of Nigeria, Robinson routinely represents international oil companies, indigenous concession holders, and engineering contractors in high-stakes joint venture disputes, offshore facility claims, and environmental tort litigations.',
    education: [
      'LL.M. (Petroleum Law & Policy), University of Dundee',
      'LL.B. (Honours), Rivers State University',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2010)',
      'Chartered Institute of Arbitrators UK (MCIArb)',
      'Nigerian Bar Association (Section on Legal Practice)'
    ],
    keyMatters: [
      'Successfully defended an international exploration operator against a ₦40 Billion host community environmental damages lawsuit.',
      'Represented a syndicate of oilfield service contractors in multi-party commercial arbitration over vessel procurement and offshore fabrication delays.',
      'Advised on regulatory compliance and statutory decommissioning liabilities under the Petroleum Industry Act 2021.'
    ],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'churchill-osila',
    name: 'Churchill Osila',
    role: 'Senior Associate, Banking & Corporate Commercial',
    category: 'Senior Associates',
    location: 'Lagos',
    email: 'cosila@tep.com.ng',
    phone: '+234 (0) 1 270 3991',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Banking & Finance', 'Corporate & Commercial', 'Mergers & Acquisitions', 'AML/CFT Compliance'],
    bio: 'Specializing in syndicated lending, cross-border corporate transactions, debt capital restructuring, and financial regulatory compliance.',
    fullBio: 'Churchill Osila is a Senior Associate in the Banking, Finance, and Corporate Commercial practice group in Lagos. He advises commercial banks, development finance institutions (DFIs), private equity houses, and conglomerate borrowers on complex syndicated loan facilities, asset securitizations, and regulatory compliance with the Central Bank of Nigeria (CBN) and SEC directives.',
    education: [
      'LL.M. (International Commercial Law), University of Nottingham',
      'LL.B., University of Lagos',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2015)',
      'Nigerian Bar Association (Section on Business Law)',
      'International Bar Association (Banking Law Committee)'
    ],
    keyMatters: [
      'Advised on a $180M syndicated corporate debt refinancing facility for a leading telecommunications infrastructure provider.',
      'Structured legal security documentation and statutory mortgages for a consortium of commercial lenders funding a commercial port expansion.',
      'Assisted a multinational FMCG conglomerate in a cross-border acquisition and pre-merger clearance with the FCCPC.'
    ],
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'eugenia-anuforo',
    name: 'Eugenia Ifunanya Anuforo',
    role: 'Senior Associate, Regulatory & Public Policy',
    category: 'Senior Associates',
    location: 'Abuja',
    email: 'eianuforo@tep.com.ng',
    phone: '+234 (0) 9 461 4012',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Government Relations', 'Public Procurement', 'Corporate Commercial', 'Data Protection & Privacy'],
    bio: 'Navigating federal administrative statutory processes, public-private partnership concessions, and high-level stakeholder relations for corporate leaders.',
    fullBio: 'Eugenia Ifunanya Anuforo is a Senior Associate in the Abuja headquarters, leading the Public Procurement, Concessions, and Government Regulatory Relations team. She provides strategic counsel to international development partners, infrastructure developers, and technology corporations interfacing with Federal Ministries, Departments, and Agencies (MDAs), the Bureau of Public Procurement (BPP), and the Infrastructure Concession Regulatory Commission (ICRC).',
    education: [
      'LL.M. (Public Law & Governance), University of Cape Town',
      'LL.B., University of Nigeria, Nsukka',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2016)',
      'Nigerian Bar Association (NBA Women Forum)',
      'Institute of Chartered Mediators and Conciliators (ICMC)'
    ],
    keyMatters: [
      'Drafted concession agreements and negotiated concession terms for a $350M federal highway and tollway modernization scheme.',
      'Advised a foreign green energy investor on obtaining statutory generation licenses and tariff clearance from NERC.',
      'Represented a global pharmaceutical firm in statutory compliance investigations and expedited regulatory approvals before NAFDAC.'
    ],
    image: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tamunoibi-aprekuma',
    name: 'Tamunoibi Aprekuma',
    role: 'Senior Associate, Energy & Environmental Governance',
    category: 'Senior Associates',
    location: 'Port Harcourt',
    email: 'taprekuma@tep.com.ng',
    phone: '+234 (0) 84 301 228',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Energy & Natural Resources', 'Environmental Law', 'Maritime & Shipping', 'Host Community Trusts'],
    bio: 'Advising upstream and midstream energy players on PIA governance, environmental ESG obligations, maritime cabotage, and Niger Delta stakeholder relations.',
    fullBio: 'Tamunoibi Aprekuma is a Senior Associate in the Energy and Natural Resources practice based in Port Harcourt. Her expertise spans Host Community Development Trusts (HCDTs), upstream farm-ins, offshore service contracts, environmental impact assessments (EIA), and maritime cabotage compliance under NIMASA regulations.',
    education: [
      'LL.M. (Energy & Environmental Law), University of Aberdeen',
      'LL.B., University of Port Harcourt',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2015)',
      'Women in Energy Network (WIEN)',
      'Nigerian Maritime Law Association'
    ],
    keyMatters: [
      'Facilitated the incorporation and funding governance of multiple Host Community Development Trusts across offshore asset clusters in Rivers and Bayelsa States.',
      'Advised a global marine logistics operator on Nigerian flag registration, cabotage waivers, and joint venture crew compliance.',
      'Defended an oilfield engineering contractor in contentious regulatory proceedings regarding environmental oil discharge containment.'
    ],
    image: '/images/Tamunoibi Aprekuma.jpeg'
  },
  {
    id: 'nwinee-williams',
    name: 'Nwinee Williams',
    role: 'Associate, Commercial Litigation & Real Estate',
    category: 'Associates',
    location: 'Port Harcourt',
    email: 'nwineewilliams@tep.com.ng',
    phone: '+234 (0) 84 301 230',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Commercial Litigation', 'Real Estate & Construction', 'Dispute Resolution', 'Corporate Commercial'],
    bio: 'Focuses on civil litigation, commercial real estate titling, industrial land acquisitions, and construction contract disputes.',
    fullBio: 'Nwinee Williams is an Associate in the Litigation and Real Estate practices in Port Harcourt. He represents corporate clients in property title regularizations, commercial tenancy disputes, construction delay claims, and debt recovery proceedings before state and federal high courts.',
    education: [
      'LL.B., Rivers State University',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2019)',
      'Nigerian Bar Association'
    ],
    keyMatters: [
      'Handled extensive land acquisition and community title verification for a 100-hectare industrial logistics park in the Greater Port Harcourt area.',
      'Secured favorable court judgments in multiple contentious commercial contract enforcement suits.',
      'Advised developers on drafting turnkey FIDIC construction agreements and subcontractor indemnity clauses.'
    ],
    image: '/images/Nwinee Williams.jpeg'
  },
  {
    id: 'iniekebiama-ofoda',
    name: 'Iniekebiama Goodluck Ofoda',
    role: 'Associate, Maritime, Energy Transition & Trade',
    category: 'Associates',
    location: 'Port Harcourt',
    email: 'oigoodluck@tep.com.ng',
    phone: '+234 (0) 84 301 235',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Maritime & Shipping', 'Energy Transition & ESG', 'Cross-Border Trade', 'Commercial Litigation'],
    bio: 'Advising shipowners, offshore service providers, and renewable energy ventures on vessel arrests, charterparties, and cross-border maritime commerce.',
    fullBio: 'Iniekebiama Goodluck Ofoda is an Associate in the Maritime, Energy, and Trade practice group. He handles contentious maritime admiralty claims, vessel arrests and releases, marine insurance disputes, and advises clients on decarbonization compliance and transitional fuel projects across the Gulf of Guinea.',
    education: [
      'LL.M. (Maritime Law), Swansea University, Wales',
      'LL.B., Niger Delta University',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2018)',
      'Young International Arbitrators Group (YIAG - LCIA)',
      'Nigerian Bar Association'
    ],
    keyMatters: [
      'Acted as legal counsel in emergency warrant of arrest and security release proceedings involving an international cargo tanker at Onne Port.',
      'Advised an indigenous offshore supply vessel operator on cross-border charterparty negotiations and marine insurance indemnity coverage.',
      'Prepared legal compliance frameworks for flare gas monetization and clean energy carbon credit initiatives in the Niger Delta.'
    ],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'racheal-erakpotubor',
    name: 'Racheal Erakpotubor',
    role: 'Associate, IP, Tech & Corporate Compliance',
    category: 'Associates',
    location: 'Abuja',
    email: 'rrerakpotubor@tep.com.ng',
    phone: '+234 (0) 9 461 4018',
    linkedin: 'https://linkedin.com',
    practiceAreas: ['Data Protection & Privacy', 'Intellectual Property', 'Corporate & Commercial', 'Tax Advisory'],
    bio: 'Specializing in intellectual property protection, NDPA compliance, digital trademarks, and general corporate secretarial advisory.',
    fullBio: 'Racheal Erakpotubor is an Associate in the Technology, IP, and Corporate Compliance group at the firm’s Abuja office. She assists clients with trademark registrations, patent filings before the Nigerian IP Registry, data privacy impact assessments (DPIAs), corporate secretarial governance, and statutory compliance with the CAC and NDPC.',
    education: [
      'LL.B., Benson Idahosa University',
      'B.L., Nigerian Law School'
    ],
    admissions: [
      'Supreme Court of Nigeria (2020)',
      'Nigerian Bar Association',
      'Institute of Chartered Secretaries and Administrators of Nigeria (ICSAN) Graduate Member'
    ],
    keyMatters: [
      'Managed trademark and patent filing portfolios for high-growth tech startups and creative consumer brands across West Africa.',
      'Conducted data privacy and NDPA 2023 compliance audits for healthcare and educational institutions.',
      'Advised on corporate filings, governance board resolutions, and annual statutory returns for foreign subsidiary incorporations.'
    ],
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop'
  }
];

export const INSIGHTS: Insight[] = [
  {
    title: 'Nigeria’s New Tax Regime (2026): Compliance, Conflict & Coming Litigation',
    category: 'Tax Advisory',
    date: 'FEB 12, 2025',
    excerpt: 'An authoritative review of the 2026 Tax Regime under the now-effective Nigeria Tax Reform Act 2025, detailing the new enforcement reality.',
    image: 'https://picsum.photos/seed/tep_tax/600/400',
    author: "Al'qasim Jafar",
    content: `The 1st of January 2026 marks a watershed moment in the history of Nigerian fiscal administration. With the Nigeria Tax Reform Act 2025 now fully in force, the nation has moved from a fragmented revenue collection model to a centralized, digital-first structure. This is no longer a period of legislative anticipation; it is a period of active enforcement and operational adjustment. For institutional entities, the 2026 fiscal year represents the primary testing ground for a new social contract between the state and the taxpayer.

I. THE NEW LEGISLATIVE REALITY: THE 2025 ACT
The Nigeria Tax Reform Act 2025 represents the definitive consolidation of Nigeria's tax laws. It officially repeals various legacy provisions and establishes the Nigeria Revenue Service (NRS) as the successor to the FIRS, with a mandates for administrative efficiency and absolute transparency. 

Key pillars of the enacted 2025 Act:
- Unified Revenue Administration: The NRS now holds centralized powers for the collection and distribution of major taxes, aimed at eliminating the 'multiplicity of taxes' that long inhibited the ease of doing business.
- Tax Administration Provisions: The Act codifies the use of 'TaxPro-Max' as the exclusive legal interface for all filings. As of January 1, 2026, manual returns are effectively void in the eyes of the law.
- Integrated Revenue Board: A new statutory body manages jurisdictional harmony between Federal and State revenue interests, providing a framework for conflict resolution.

II. PRACTICAL COMPLIANCE: THE 2026 MANDATE
Compliance in the 2026 era is defined by 'Real-Time Accountability.' The Act mandates that corporate ERP systems and banking interfaces maintain seamless connectivity with the NRS digital portal.

Significant Enforced Changes:
- Corporate Tax Graduation: The 2025 Act implements a refined graduated CIT scale, with large corporations (turnover above ₦100m) subjected to a rate that balances fiscal revenue needs with international competitiveness.
- Digital Services Tax (DST): The Act formally brings non-resident digital service providers into the Nigerian net, requiring registration and reporting for any entity with 'Significant Economic Presence' in Nigeria.
- Value Added Tax (VAT) Harmonization: The Act provides a unified formula for VAT collection and distribution, attempting to resolve the long-standing legal frictions between the Federation and the component States.

Primary Pitfalls for 2026:
The most immediate risk is the 'Data Mismatch' penalty. Under the new Act, discrepancies between bank records and TaxPro-Max filings trigger automated audits. Businesses that have not reconciled their historical data under the Finance Act 2023 with the new 2026 NRS standards face significant exposure.

III. ANTICIPATED LITIGATION AND DISPUTE TRENDS
As the 2026 regime begins its first full cycle of enforcement, we anticipate that the judiciary will be called upon to interpret the boundaries of the NRS's powers.

1. Challenges to Automated Distrain: The 2025 Act grants the NRS expanded powers to recover taxes through automated distrain actions. We expect litigation challenging the constitutional validity of these powers where they are exercised without prior judicial oversight or the fulfillment of 'Fair Hearing' requirements under Section 36 of the Constitution.
2. Jurisdictional Disputes over VAT: While the 2025 Act attempts a legislative fix for VAT administration, constitutional purists may still challenge the Federal Government's right to legislate on intra-state consumption, potentially reviving the precedents of *Attorney General of Rivers State v. FIRS*.
3. Classification Disputes for DST: Multinational tech entities are likely to challenge the NRS's interpretation of 'Significant Economic Presence' (SEP), leading to complex multi-jurisdictional tax litigation.

IV. TEP STRATEGIC ADVISORY
Three Edge Practice remains at the forefront of this transition. We recommend:
- Immediate NRS Registration Review: Ensure your NRS digital profiles are correctly configured under the 2025 Act.
- ERP Audit-Readiness: Perform a technical stress test of your accounting software's compatibility with the NRS API.
- Litigation Defense Strategy: Establish a protocol for managing 'Notices of Default' to ensure all administrative remedies are exhausted before matters escalate to the Tax Appeal Tribunal.

SUMMARY OF KEY TAKEAWAYS
1. Enactment: The Nigeria Tax Reform Act 2025 is now in force (effective 1st Jan 2026).
2. Institutional Change: NRS replaces FIRS with centralized, digital-first mandates.
3. Digital Exclusivity: TaxPro-Max is now the only legally recognized filing interface.
4. Enforcement Focus: Real-time transactional auditing is the new operational standard.

Conclusion:
The 2026 Tax Regime is a clinical, data-driven framework that leaves no room for administrative ambiguity. The successful corporation in 2026 will be one that treats tax compliance not as an annual event, but as a continuous strategic imperative integrated into the very fabric of its digital operations.

References:
- Nigeria Tax Reform Act 2025 (Enacted).
- Tax Administration Act 2025 (Enacted).
- Nigeria Revenue Service (Establishment) Act 2025.
- Constitution of the Federal Republic of Nigeria 1999 (As Amended).
- NRS TaxPro-Max Technical Standards 2026.`
  },
  {
    title: 'Regulators Are Getting Tough: What SEC & FCCPC Enforcement Means for Businesses',
    category: 'Regulatory',
    date: 'JAN 28, 2025',
    excerpt: 'A critical review of high-velocity enforcement led by the SEC and FCCPC under current competition and securities laws.',
    image: 'https://picsum.photos/seed/tep_reg/600/400',
    author: 'Chinyere Okafor',
    content: `Regulatory enforcement in Nigeria has transitioned from a consultative posture to a clinical, punitive one. The Securities and Exchange Commission (SEC) and the Federal Competition and Consumer Protection Commission (FCCPC) are currently setting precedents that redefine the cost of non-compliance.

The Dawn Raid Era:
Under the Federal Competition and Consumer Protection Act (FCCPA) 2018, the FCCPC has increasingly utilized its 'Search and Seize' powers (Sections 27–29) to investigate pricing cartels and abuse of dominant positions. Recent enforcement actions in the digital lending and consumer goods sectors demonstrate a zero-tolerance policy for 'Unfair Trade Practices.' Administrative penalties are now reaching the statutory ceiling of 10% of global annual turnover.

SEC and the VASP Framework:
The SEC’s New Rules on Issuance, Offering Platforms, and Custody of Digital Assets (2024 Update) have brought the fintech sector under intense scrutiny. The Commission is now actively prosecuting 'Unregistered Securities' offerings, with the Investments and Securities Act (ISA) providing the legal bedrock for these enforcement actions.

Strategic Counsel:
Boards must move beyond a 'General Counsel' approach to a 'Regulatory Strategy' approach. TEP advocates for the implementation of 'Dawn Raid Protocols' and rigorous internal audits of trade association activities to ensure no inadvertent breach of the FCCPA’s anti-competition clauses occurs.

References:
- Federal Competition and Consumer Protection Act (FCCPA) 2018.
- Investments and Securities Act (ISA) 2007 (Current).
- SEC Rules on Virtual Asset Service Providers (VASPs) 2024 Update.
- FCCPA Merger Review Regulations 2020.`
  },
  {
    title: 'Data Protection in Nigeria: From Compliance Obligation to Enforcement Exposure',
    category: 'Data Privacy',
    date: 'JAN 15, 2025',
    excerpt: 'Analyzing the NDPC’s enforcement trajectory under the Nigeria Data Protection Act (NDPA) 2023.',
    image: 'https://picsum.photos/seed/tep_data/600/400',
    author: 'Sarah Thompson',
    content: `The enactment of the Nigeria Data Protection Act (NDPA) 2023 has fundamentally shifted the legal status of personal data from a corporate asset to a significant institutional liability. The Nigeria Data Protection Commission (NDPC) has signaled that the 'grace period' for transition is over.

Enforcement focal points:
Under Section 48 of the NDPA, the Commission is empowered to impose 'Remedial Fees'—effectively fines—of up to 2% of annual gross revenue for major breaches. We are seeing a specific focus on 'Sensitive Personal Data' processing and cross-border data transfers. The requirement for a 'Data Protection Impact Assessment' (DPIA) is now a mandatory prerequisite for any new digital product launch.

Strategic Resilience:
Firms must move from 'Checklist Compliance' to 'Privacy by Design.' This involves a forensic mapping of data flows and ensuring that third-party service providers (Data Processors) are contractually bound by the stringent standards set in the NDPA. Failure to report a data breach within the statutory 72-hour window is now a primary trigger for high-tier punitive action.

References:
- Nigeria Data Protection Act (NDPA) 2023.
- NDPC Guidance Note on the Implementation of the NDPA 2023.
- Nigeria Data Protection Regulation (NDPR) 2019 (as saved by the Act).
- General Application and Implementation Directive (GAID) 2025.`
  },
  {
    title: 'Anti-Money Laundering in Focus: Expanding Regulatory Scrutiny and Corporate Risk',
    category: 'AML/CFT',
    date: 'DEC 20, 2024',
    excerpt: 'Structural shifts in directorial liability and reporting mandates under the Money Laundering (Prevention and Prohibition) Act 2022.',
    image: 'https://picsum.photos/seed/tep_aml/600/400',
    author: 'Ibrahim Musa',
    content: `The Money Laundering (Prevention and Prohibition) Act 2022 (the 'MLA') has redefined the risk landscape for corporate officers and directors. The MLA introduces the concept of 'Directorial Liability' where a lack of personal knowledge is no longer a valid legal defense for institutional failures in AML protocols.

The Expanded Scope of DNFBPs:
The MLA significantly expands the definition of 'Designated Non-Financial Businesses and Professions' (DNFBPs). Real estate developers, luxury dealers, and professional service firms are now under the direct oversight of the Special Control Unit against Money Laundering (SCUML). Mandatory 'Suspicious Transaction Reports' (STRs) must now be filed within 24 hours of detection, a significant tightening of previous timelines.

The FATF Grey List Context:
Nigeria’s effort to exit the Financial Action Task Force (FATF) 'Grey List' is driving a clinical enforcement environment. The CBN (Anti-Money Laundering, Combating the Financing of Terrorism and Countering Proliferation Financing of Weapons of Mass Destruction in Financial Institutions) Regulations 2022 provides the technical roadmap that institutions must follow or face immediate suspension of operating licenses.

References:
- Money Laundering (Prevention and Prohibition) Act 2022.
- Terrorism (Prevention and Prohibition) Act 2022.
- Proceeds of Crime (Recovery and Management) Act 2022.
- CBN AML/CFT/CPF Regulations 2022.`
  },
  {
    title: 'Global Regulatory Shifts and Their Local Impact: What Nigerian Businesses Must Watch',
    category: 'Advisory',
    date: 'NOV 30, 2024',
    excerpt: 'How EU CBAM and global ESG mandates are affecting Nigerian trade and compliance requirements.',
    image: 'https://picsum.photos/seed/tep_global/600/400',
    author: 'Chinyere Okafor',
    content: `The regulatory reach of the European Union and the United States now extends deep into the Nigerian corporate boardroom. Laws such as the EU Carbon Border Adjustment Mechanism (CBAM) and the UK Bribery Act exert 'Downstream Compliance' pressure on Nigerian exporters and financial institutions.

ESG as a Trade Mandate:
ESG is transitioning from a 'Corporate Social Responsibility' initiative to a hard trade requirement. Under the EU Regulation 2023/956 (CBAM), Nigerian exporters in the extractive and manufacturing sectors must now provide verifiable carbon footprint data or face punitive import tariffs at the European border. 

Extraterritorial Jurisdiction:
The US Foreign Corrupt Practices Act (FCPA) and the UK Bribery Act continue to target the 'Second-Order' actions of Nigerian partners of global firms. TEP provides a 'Global Horizon Scan' to ensure that your board is aware of these shifts 18 months before they manifest as local regulatory challenges.

References:
- EU Regulation 2023/956 (Carbon Border Adjustment Mechanism).
- UK Bribery Act 2010.
- US Foreign Corrupt Practices Act (FCPA).
- African Continental Free Trade Area (AfCFTA) Protocol on Investment.`
  },
  {
    title: 'AI in Legal Practice: Efficiency Tool or Ethical Risk?',
    category: 'Technology',
    date: 'NOV 12, 2024',
    excerpt: 'Assessing the ethical and legal boundaries of AI integration under the Rules of Professional Conduct 2023.',
    image: 'https://picsum.photos/seed/tep_ai/600/400',
    author: "Al'qasim Jafar",
    content: `The integration of Generative AI into legal and corporate environments presents a profound challenge to traditional concepts of privilege and liability. At Three Edge Practice, we view AI as an 'Efficiency Engine' that must be strictly piloted by human legal judgment.

Confidentiality & The RPC 2023:
The updated Rules of Professional Conduct (RPC) 2023 for Legal Practitioners maintain an absolute duty of confidentiality. Inputting client-sensitive data into public, non-proprietary AI models constitutes a breach of attorney-client privilege and potential professional misconduct. Since these models use input data for training, the data is no longer 'confidential' once processed.

Evidentiary Integrity:
Under the Evidence (Amendment) Act 2023, the authentication of electronically generated documents has become more nuanced. The risk of AI 'Hallucinations'—fictitious case law or statutes—poses a significant risk in litigation. TEP utilizes a proprietary, 'Air-Gapped' AI environment to ensure that client data remains within our secure perimeter while benefiting from rapid document analysis.

References:
- Rules of Professional Conduct for Legal Practitioners (Nigeria) 2023.
- Evidence (Amendment) Act 2023.
- Constitution of the Federal Republic of Nigeria 1999 (As Amended).
- IBA Guidelines on the Use of Artificial Intelligence in the Legal Profession.`
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
