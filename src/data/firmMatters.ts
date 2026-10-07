import { LegalCase, ClientProfile } from '../../types';

export const DEMO_CLIENTS: ClientProfile[] = [
  {
    id: 'client-atlantic-deepwater-2026',
    uid: 'client-atlantic-deepwater-2026',
    name: 'Atlantic Deepwater Exploration Corp',
    email: 'legal@atlanticdeepwater.ng',
    organization: 'Atlantic Deepwater Group Ltd',
    representative: 'Engr. Tari Briggs (Chief Operating Officer)',
    phone: '+234 84 892 100',
    address: 'Onne Oil & Gas Free Zone, Port Harcourt, Rivers State',
    status: 'Active',
    registeredAt: '2026-01-10',
    notes: 'Primary upstream corporate retainer. Key stakeholder in Gulf of Guinea concession.'
  },
  {
    id: 'client-zenith-telecom-2026',
    uid: 'client-zenith-telecom-2026',
    name: 'Zenith Telecommunications Ltd',
    email: 'compliance@zenithtelecom.ng',
    organization: 'Zenith Telecom Holdings Plc',
    representative: 'Dr. Halima Bello (General Counsel)',
    phone: '+234 9 461 8200',
    address: 'Plot 1022 Shehu Shagari Way, Maitama, Abuja, FCT',
    status: 'Active',
    registeredAt: '2026-01-20',
    notes: 'Tier-1 Telecoms operator. Spectrum licensing and regulatory defense.'
  }
];

export const INITIAL_FIRM_CASES: LegalCase[] = [
  {
    id: 'case-tep-fct-0419',
    caseNumber: 'TEP/FCT/2026/0419',
    docketNumber: 'TEP/FCT/2026/0419',
    suitNumber: 'FHC/ABJ/CS/419/2026',
    title: 'Atlantic Deepwater Consortium v. Federal Regulatory Commission (Inter-State Gas Concession)',
    clientUid: 'client-atlantic-deepwater-2026',
    clientName: 'Atlantic Deepwater Exploration Corp',
    clientEmail: 'legal@atlanticdeepwater.ng',
    practiceArea: 'Compliance and Advisory / Regulatory Advocacy',
    leadAttorney: "Al'Qasim Jafar (Managing Partner)",
    leadAttorneyEmail: 'a.jafar@tep.com.ng',
    regionalOffice: 'Abuja (Federal Capital Territory)',
    status: 'Active Trial',
    stage: 'Hearing on Preliminary Objection & Substantive Briefs',
    filingDate: 'JAN 14, 2026',
    nextHearingDate: 'OCT 28, 2026 at 09:00 AM',
    courtJurisdiction: 'Federal High Court, Abuja Judicial Division (Court 4)',
    judgeOrPanel: 'Hon. Justice M. A. Idris (Presiding)',
    summary: 'Substantive constitutional challenge and regulatory defense regarding statutory concession rights, tariff harmonization, and third-party access under the Petroleum Industry Act 2021.',
    recentUpdates: [
      {
        id: 'upd-1',
        date: 'OCT 04, 2026',
        title: 'Reply on Points of Law Filed & Certified',
        notes: 'Lead counsel filed and served our final written address addressing the Commission’s preliminary objection. Court registry certified receipt and service confirmed on all respondents.',
        author: "Al'Qasim Jafar (Managing Partner)",
        type: 'Filing'
      },
      {
        id: 'upd-2',
        date: 'SEP 22, 2026',
        title: 'Pre-Hearing Case Management Conference',
        notes: 'Court settled issues for determination and scheduled substantive hearing for late October. Pre-trial disclosure requirements fulfilled.',
        author: 'Eugenia Ifunanya Anuforo (Senior Associate)',
        type: 'Court Hearing'
      },
      {
        id: 'upd-3',
        date: 'AUG 18, 2026',
        title: 'Regulatory Conciliation Session',
        notes: 'Executive stakeholder session held at TEP Abuja headquarters to evaluate potential conciliation parameters before the Commission.',
        author: "Al'Qasim Jafar (Managing Partner)",
        type: 'Internal Review'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Originating Summons & Affidavit in Support',
        category: 'Originating Summons',
        filingDate: 'JAN 14, 2026',
        fileSize: '4.2 MB',
        status: 'Filed'
      },
      {
        id: 'doc-2',
        title: 'Plaintiff’s Reply Brief on Points of Law',
        category: 'Brief of Argument',
        filingDate: 'OCT 02, 2026',
        fileSize: '1.8 MB',
        status: 'Served'
      },
      {
        id: 'doc-3',
        title: 'Certified True Copy (CTC) of Interim Injunction Order',
        category: 'Ruling',
        filingDate: 'FEB 04, 2026',
        fileSize: '850 KB',
        status: 'Certified'
      },
      {
        id: 'doc-4',
        title: 'Joint Expert Regulatory Economic Impact Report',
        category: 'Compliance Audit',
        filingDate: 'SEP 10, 2026',
        fileSize: '3.6 MB',
        status: 'Drafting'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-1',
        title: 'Privileged Pre-Trial Strategy Note',
        message: 'Lead Counsel has finalized the rejoinder on points of law. The presiding judge has indicated substantive oral argument will proceed promptly on October 28.',
        date: 'OCT 04, 2026',
        priority: 'Privileged',
        sender: "Al'Qasim Jafar (Managing Partner)"
      }
    ],
    createdAt: '2026-01-14T09:00:00.000Z',
    updatedAt: '2026-10-04T14:30:00.000Z'
  },
  {
    id: 'case-tep-phc-1022',
    caseNumber: 'TEP/PHC/2026/1022',
    docketNumber: 'TEP/PHC/2026/1022',
    suitNumber: 'FHC/PH/CS/1022/2026',
    title: 'Offshore Energy Operators Ltd v. Atlantic Terminal Logistics (Vessel Arrest & Demurrage)',
    clientUid: 'client-atlantic-deepwater-2026',
    clientName: 'Atlantic Deepwater Exploration Corp',
    clientEmail: 'legal@atlanticdeepwater.ng',
    practiceArea: 'Energy & Natural Resources / Maritime Litigation',
    leadAttorney: 'Churchill Osila (Partner & Head of Office)',
    leadAttorneyEmail: 'cosila@tep.com.ng',
    regionalOffice: 'Port Harcourt (Rivers State)',
    status: 'Pre-Trial Discovery',
    stage: 'Discovery Exchange & Witness Depositions',
    filingDate: 'MAR 22, 2026',
    nextHearingDate: 'NOV 12, 2026 at 10:00 AM',
    courtJurisdiction: 'Federal High Court, Port Harcourt Division (Admiralty Jurisdiction)',
    judgeOrPanel: 'Hon. Justice E. N. Woko',
    summary: 'Commercial admiralty defense and counter-claim challenging an unlawful detention warrant against a deep-sea support vessel at Onne Port corridor, claiming damages for contractual delay.',
    recentUpdates: [
      {
        id: 'upd-4',
        date: 'OCT 01, 2026',
        title: 'Expert Maritime Surveyor Affidavit Filed',
        notes: 'Technical inspection logs and vessel voyage records tendered as further witness statement on oath.',
        author: 'Churchill Osila (Partner)',
        type: 'Filing'
      },
      {
        id: 'upd-5',
        date: 'AUG 20, 2026',
        title: 'Security Deposit & Bond Perfection',
        notes: 'Secured unconditional bank guarantee in substitution of vessel arrest, enabling vessel mobilization back to commercial operations.',
        author: 'Nweye R. Robinson (Partner)',
        type: 'Settlement Meeting'
      }
    ],
    documents: [
      {
        id: 'doc-5',
        title: 'Statement of Defense and Counterclaim',
        category: 'Brief of Argument',
        filingDate: 'APR 09, 2026',
        fileSize: '3.1 MB',
        status: 'Filed'
      },
      {
        id: 'doc-6',
        title: 'Bank Guarantee of Release from Arrest',
        category: 'Settlement Draft',
        filingDate: 'AUG 20, 2026',
        fileSize: '1.2 MB',
        status: 'Certified'
      },
      {
        id: 'doc-7',
        title: 'Notice of Production of Maritime Voyage Logs',
        category: 'Originating Summons',
        filingDate: 'SEP 28, 2026',
        fileSize: '920 KB',
        status: 'Served'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-2',
        title: 'Consent Award Documentation Advisory',
        message: 'The appellate settlement terms draft is scheduled for execution before the presiding appellate justice on November 05.',
        date: 'OCT 03, 2026',
        priority: 'Normal',
        sender: 'Nweye R. Robinson (Partner)'
      }
    ],
    createdAt: '2026-03-22T11:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z'
  },
  {
    id: 'case-tep-comp-0104',
    caseNumber: 'TEP/NDPC/2026/0104',
    docketNumber: 'TEP/NDPC/2026/0104',
    suitNumber: 'NDPC/AUD/2026/0104 (Regulatory Proceeding File)',
    title: 'Atlantic Deepwater - Institutional NDPA Data Privacy Audit & GAID Framework Implementation',
    clientUid: 'client-atlantic-deepwater-2026',
    clientName: 'Atlantic Deepwater Exploration Corp',
    clientEmail: 'legal@atlanticdeepwater.ng',
    practiceArea: 'Compliance and Advisory',
    matterCategory: 'Compliance & Regulatory Advisory',
    leadAttorney: 'Tamunoibi Aprekuma (Head, IT Law & Tech Regulatory)',
    leadAttorneyEmail: 'taprekuma@tep.com.ng',
    regionalOffice: 'Port Harcourt (Rivers State)',
    status: 'Regulatory Audit & Compliance Review',
    stage: 'Data Protection Impact Assessment (DPIA) & Statutory Registration',
    filingDate: 'FEB 02, 2026',
    nextHearingDate: 'NOV 15, 2026 - Statutory NDPC Audit Filing Deadline',
    courtJurisdiction: 'Nigeria Data Protection Commission (NDPC), Headquarters Abuja',
    judgeOrPanel: 'National Commissioner & CEO, NDPC / DPCO Audit Board',
    summary: 'Institutional corporate privacy audit and regulatory compliance architecture under the Nigeria Data Protection Act (NDPA) 2023 and GAID 2025. Covers offshore operational personnel data, cross-border data transfer protocols, and DPCO statutory filings.',
    recentUpdates: [
      {
        id: 'upd-comp-1',
        date: 'OCT 05, 2026',
        title: 'Comprehensive Privacy Impact Assessment (DPIA) Concluded',
        notes: 'Technical audit completed across enterprise systems; remediation framework and data processing agreements drafted for third-party offshore logistics vendors.',
        author: 'Tamunoibi Aprekuma (Head, IT Law)',
        type: 'Regulatory Development',
        visibility: 'Client Visible',
        caseStatus: 'Regulatory Audit & Compliance Review',
        nextAction: 'Submission of formal DPCO compliance summary to NDPC registry',
        nextActionDate: 'OCT 25, 2026',
        attachmentName: 'Atlantic_Deepwater_Executive_DPIA_Audit_2026.pdf'
      },
      {
        id: 'upd-comp-2',
        date: 'SEP 12, 2026',
        title: 'Board Governance Data Handling Protocol Adopted',
        notes: 'Board-approved corporate data governance policy transmitted to corporate secretarial archives and executive compliance directorate.',
        author: 'Eugenia Ifunanya Anuforo (Senior Associate)',
        type: 'Client Instruction',
        visibility: 'Client Visible'
      }
    ],
    documents: [
      {
        id: 'doc-comp-1',
        title: 'Enterprise Data Protection Impact Assessment Report (DPIA)',
        category: 'Data Protection (NDPA) Framework',
        filingDate: 'OCT 05, 2026',
        fileSize: '4.8 MB',
        status: 'Certified'
      },
      {
        id: 'doc-comp-2',
        title: 'Standard Cross-Border Data Transfer Agreement (SCCs)',
        category: 'Commercial Contract / Transaction Draft',
        filingDate: 'SEP 18, 2026',
        fileSize: '1.9 MB',
        status: 'Drafting'
      },
      {
        id: 'doc-comp-3',
        title: 'NDPC Statutory Compliance Filing Docket Receipt',
        category: 'Regulatory Filing / Statutory Permit',
        filingDate: 'FEB 02, 2026',
        fileSize: '650 KB',
        status: 'Filed'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-comp-1',
        title: 'NDPA Annual Compliance Seal Schedule',
        message: 'The preliminary DPIA draft has received favorable internal DPCO audit review. Statutory certification is projected for mid-November 2026.',
        date: 'OCT 05, 2026',
        priority: 'Normal',
        sender: 'Tamunoibi Aprekuma (Head, IT Law)'
      }
    ],
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-10-05T15:00:00.000Z'
  },
  {
    id: 'case-tep-corp-2041',
    caseNumber: 'TEP/CORP/2026/2041',
    docketNumber: 'TEP/CORP/2026/2041',
    suitNumber: 'CAC/RC/2026/2041-JV (Corporate Registry Ref)',
    title: 'Zenith Telecom - Nationwide Fiber Infrastructure JV & FIRS Pioneer Status Tax Incentive',
    clientUid: 'client-zenith-telecom-2026',
    clientName: 'Zenith Telecommunications Ltd',
    clientEmail: 'compliance@zenithtelecom.ng',
    practiceArea: 'General Corporate/Commercial Legal Support',
    matterCategory: 'Corporate & Commercial Legal Support',
    leadAttorney: "Al'Qasim Jafar (Managing Partner)",
    leadAttorneyEmail: 'a.jafar@tep.com.ng',
    regionalOffice: 'Abuja (Federal Capital Territory)',
    status: 'Transactional Drafting & Negotiation',
    stage: 'Joint Venture Shareholder Agreement Structuring & FIRS Tax Clearance',
    filingDate: 'MAR 11, 2026',
    nextHearingDate: 'NOV 20, 2026 - JV Definitive Closing & Escrow Execution',
    courtJurisdiction: 'Federal Inland Revenue Service (FIRS) / Corporate Affairs Commission (CAC)',
    judgeOrPanel: 'Director of Corporate Tax Planning (FIRS) / Registrar-General CAC',
    summary: 'Corporate transactional advisory, commercial joint venture agreements, shareholder frameworks, and statutory tax planning for a 3,500km metropolitan optical fiber deployment consortium across Western and Northern Nigeria.',
    recentUpdates: [
      {
        id: 'upd-corp-1',
        date: 'OCT 02, 2026',
        title: 'Consortium Shareholder Agreement Restructured',
        notes: 'Finalized minority protection covenants, step-in equity rights, and dispute escalation protocols with co-investor lead counsel.',
        author: "Al'Qasim Jafar (Managing Partner)",
        type: 'Legal Milestone',
        visibility: 'Client Visible',
        caseStatus: 'Transactional Drafting & Negotiation',
        nextAction: 'Execution of definitive escrow agreement and corporate resolution filing at CAC',
        nextActionDate: 'NOV 20, 2026',
        attachmentName: 'Zenith_Consortium_Definitive_SHA_v4.pdf'
      },
      {
        id: 'upd-corp-2',
        date: 'SEP 04, 2026',
        title: 'FIRS Advance Tax Ruling Submission',
        notes: 'Submitted formal advisory application to FIRS Large Tax Office concerning withholding tax optimization on imported telecommunication equipment.',
        author: 'Chioma Onyejesi (Associate, Corporate Commercial)',
        type: 'Filing of Processes',
        visibility: 'Client Visible'
      }
    ],
    documents: [
      {
        id: 'doc-corp-1',
        title: 'Consortium Joint Venture Agreement & Shareholder Framework',
        category: 'Commercial Contract / Transaction Draft',
        filingDate: 'OCT 02, 2026',
        fileSize: '3.4 MB',
        status: 'Drafting'
      },
      {
        id: 'doc-corp-2',
        title: 'FIRS Tax Clearance & Pioneer Status Legal Opinion',
        category: 'Legal Opinion / Advisory Memo',
        filingDate: 'AUG 14, 2026',
        fileSize: '2.1 MB',
        status: 'Certified'
      },
      {
        id: 'doc-corp-3',
        title: 'CAC Special Resolution on Consortium Incorporation',
        category: 'Regulatory Filing / Statutory Permit',
        filingDate: 'MAR 11, 2026',
        fileSize: '1.1 MB',
        status: 'Filed'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-corp-1',
        title: 'Transaction Closing Schedule & Protocol Advisory',
        message: 'The revised consortium shareholder covenants have been settled. Pre-closing conditions are on schedule for execution by mid-November.',
        date: 'OCT 02, 2026',
        priority: 'Normal',
        sender: "Al'Qasim Jafar (Managing Partner)"
      }
    ],
    createdAt: '2026-03-11T12:00:00.000Z',
    updatedAt: '2026-10-02T16:00:00.000Z'
  },
  {
    id: 'case-tep-def-3012',
    caseNumber: 'TEP/DEF/2026/3012',
    docketNumber: 'TEP/DEF/2026/3012',
    suitNumber: 'CBN/NFIU/ENF/3012/2026 (Special Regulatory Inquiry)',
    title: 'Zenith Telecom - Special Foreign Exchange Statutory Review before Central Bank & NFIU',
    clientUid: 'client-zenith-telecom-2026',
    clientName: 'Zenith Telecommunications Ltd',
    clientEmail: 'compliance@zenithtelecom.ng',
    practiceArea: 'Corporate Criminal Defense',
    matterCategory: 'Corporate Criminal Defense & Investigations',
    leadAttorney: 'Churchill Osila (Partner, Head of Office)',
    leadAttorneyEmail: 'cosila@tep.com.ng',
    regionalOffice: 'Abuja (Federal Capital Territory)',
    status: 'Pre-Charge Investigation & Defense',
    stage: 'Document Production, Forensic Audit & Regulatory Exit Conference',
    filingDate: 'APR 15, 2026',
    nextHearingDate: 'NOV 08, 2026 - Central Bank Supervisory Exit Conference',
    courtJurisdiction: 'Central Bank of Nigeria (CBN) / Nigerian Financial Intelligence Unit (NFIU)',
    judgeOrPanel: 'Director of Banking Supervision & Special Enforcement Taskforce',
    summary: 'Corporate regulatory defense representation regarding foreign exchange capital importation documentation, Form M compliance, and statutory AML/CFT reconciliation under CBN Monetary Guidelines.',
    recentUpdates: [
      {
        id: 'upd-def-1',
        date: 'OCT 04, 2026',
        title: 'Forensic Forex Reconciliations Tendered to CBN Committee',
        notes: 'Submitted forensic compliance dossier demonstrating complete statutory backing for capital importation certificates and equipment import financing.',
        author: 'Churchill Osila (Partner)',
        type: 'Regulatory Development',
        visibility: 'Client Visible',
        caseStatus: 'Pre-Charge Investigation & Defense',
        nextAction: 'Supervisory clearance exit meeting with joint CBN/NFIU directors',
        nextActionDate: 'NOV 08, 2026',
        attachmentName: 'TEP_Supervisory_Submission_Forex_Compliance_2026.pdf'
      },
      {
        id: 'upd-def-2',
        date: 'AUG 10, 2026',
        title: 'Interim Supervisory Clearance Notification Received',
        notes: 'Special committee confirmed no predicate money-laundering infractions detected; matter narrowed to technical banking reconciliation.',
        author: 'Aisha Tanko (Associate, Regulatory Compliance)',
        type: 'Correspondence',
        visibility: 'Client Visible'
      }
    ],
    documents: [
      {
        id: 'doc-def-1',
        title: 'Comprehensive Legal Advisory Memorandum on Forex Importation',
        category: 'Legal Opinion / Advisory Memo',
        filingDate: 'OCT 04, 2026',
        fileSize: '2.8 MB',
        status: 'Certified'
      },
      {
        id: 'doc-def-2',
        title: 'Statutory AML/CFT Reconciliation Schedule Tendered to Regulators',
        category: 'Compliance Audit & Impact Report',
        filingDate: 'AUG 10, 2026',
        fileSize: '3.7 MB',
        status: 'Filed'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-def-1',
        title: 'Privileged Supervisory Defense Advisory',
        message: 'The comprehensive reconciliation filing was formally accepted by the joint supervisory panel. Final closure recommendation scheduled for November 08.',
        date: 'OCT 04, 2026',
        priority: 'Normal',
        sender: 'Churchill Osila (Partner)'
      }
    ],
    createdAt: '2026-04-15T09:00:00.000Z',
    updatedAt: '2026-10-04T17:00:00.000Z'
  },
  {
    id: 'case-tep-lag-3388',
    caseNumber: 'TEP/LAG/2026/3388',
    docketNumber: 'TEP/LAG/2026/3388',
    suitNumber: 'CA/LAG/CV/3388/2026',
    title: 'Zenith Telecommunications Ltd v. National Communications Agency (5G Spectrum Bandwidth Allocation)',
    clientUid: 'client-zenith-telecom-2026',
    clientName: 'Zenith Telecommunications Ltd',
    clientEmail: 'compliance@zenithtelecom.ng',
    practiceArea: 'Dispute Resolution / Telecommunications and ICT',
    leadAttorney: 'Nweye R. Robinson (Partner)',
    leadAttorneyEmail: 'nrobinson@tep.com.ng',
    regionalOffice: 'Lagos (Commercial Hub)',
    status: 'Settlement Discussions',
    stage: 'Alternative Dispute Resolution (ADR) Terms Settlement',
    filingDate: 'FEB 19, 2026',
    nextHearingDate: 'NOV 05, 2026 at 11:30 AM',
    courtJurisdiction: 'Court of Appeal, Lagos Judicial Division',
    judgeOrPanel: 'Hon. Justice C. A. Mohammed, Presiding Appellate Panel',
    summary: 'Appellate arbitration and judicial review seeking enforcement of non-discriminatory spectrum license renewal terms and infrastructure sharing protocols under National Communications Act.',
    recentUpdates: [
      {
        id: 'upd-6',
        date: 'OCT 03, 2026',
        title: 'ADR Terms of Settlement Draft Submitted',
        notes: 'Joint settlement framework submitted to the appellate registrar for adoption as consent order, harmonizing interstate broadband transmission rates.',
        author: 'Nweye R. Robinson (Partner)',
        type: 'Settlement Meeting'
      },
      {
        id: 'upd-7',
        date: 'SEP 15, 2026',
        title: 'Regulatory Commission Compliance Response Delivered',
        notes: 'Executive stakeholder response received confirming willingness to waive contested retrospective tariff adjustments.',
        author: "Al'Qasim Jafar (Managing Partner)",
        type: 'Regulatory Notice'
      }
    ],
    documents: [
      {
        id: 'doc-8',
        title: 'Notice of Appeal and Appellant Brief',
        category: 'Brief of Argument',
        filingDate: 'FEB 19, 2026',
        fileSize: '5.4 MB',
        status: 'Filed'
      },
      {
        id: 'doc-9',
        title: 'Draft Terms of Consent Judgment',
        category: 'Settlement Draft',
        filingDate: 'OCT 03, 2026',
        fileSize: '1.4 MB',
        status: 'Drafting'
      },
      {
        id: 'doc-10',
        title: 'Certified True Copy of Spectrum License Concession',
        category: 'Ruling',
        filingDate: 'MAR 05, 2026',
        fileSize: '2.1 MB',
        status: 'Certified'
      }
    ],
    clientAccess: 'Active',
    clientNotices: [
      {
        id: 'not-3',
        title: 'Tribunal Filings Acknowledgment Notice',
        message: 'The appellate registrar has formally served the National Communications Agency with the agreed consent terms.',
        date: 'OCT 04, 2026',
        priority: 'Privileged',
        sender: 'Nweye R. Robinson (Partner)'
      }
    ],
    createdAt: '2026-02-19T08:30:00.000Z',
    updatedAt: '2026-10-03T12:00:00.000Z'
  }
];
