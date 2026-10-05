import { LegalCase } from '../../types';

export const DEMO_CLIENTS = [
  {
    uid: 'client-atlantic-deepwater-2026',
    name: 'Atlantic Deepwater Exploration Corp',
    email: 'legal@atlanticdeepwater.ng',
    organization: 'Atlantic Deepwater Group Ltd',
    representative: 'Engr. Tari Briggs (Chief Operating Officer)',
    phone: '+234 84 892 100',
    address: 'Onne Oil & Gas Free Zone, Port Harcourt, Rivers State'
  },
  {
    uid: 'client-zenith-telecom-2026',
    name: 'Zenith Telecommunications Ltd',
    email: 'compliance@zenithtelecom.ng',
    organization: 'Zenith Telecom Holdings Plc',
    representative: 'Dr. Halima Bello (General Counsel)',
    phone: '+234 9 461 8200',
    address: 'Plot 1022 Shehu Shagari Way, Maitama, Abuja, FCT'
  }
];

export const INITIAL_FIRM_CASES: LegalCase[] = [
  {
    id: 'case-tep-fct-0419',
    caseNumber: 'TEP-FCT-2026-0419',
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
    createdAt: '2026-01-14T09:00:00.000Z',
    updatedAt: '2026-10-04T14:30:00.000Z'
  },
  {
    id: 'case-tep-phc-1022',
    caseNumber: 'TEP-PHC-2026-1022',
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
    createdAt: '2026-03-22T11:00:00.000Z',
    updatedAt: '2026-10-01T16:00:00.000Z'
  },
  {
    id: 'case-tep-lag-3388',
    caseNumber: 'TEP-LAG-2026-3388',
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
    createdAt: '2026-02-19T08:30:00.000Z',
    updatedAt: '2026-10-03T12:00:00.000Z'
  }
];
