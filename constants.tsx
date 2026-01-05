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
        title: 'Data Protection',
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
          { name: 'Oluwaseun Adeyemi', role: 'Managing Partner', email: 's.adeyemi@tep.com.ng' }
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
    title: 'Nigeria’s New Tax Regime (2026): Compliance, Conflict & Coming Litigation',
    category: 'Tax Advisory',
    date: 'FEB 12, 2025',
    excerpt: 'An authoritative review of the 2026 Tax Regime under the now-effective Nigeria Tax Reform Act 2025, detailing the new enforcement reality.',
    image: 'https://picsum.photos/seed/tep_tax/600/400',
    author: 'Oluwaseun Adeyemi',
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
    author: 'Oluwaseun Adeyemi',
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