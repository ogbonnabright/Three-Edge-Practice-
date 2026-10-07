import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Briefcase, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Activity, 
  FileText, 
  Bell, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Clock3,
  Scale,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  EyeOff,
  Paperclip,
  PlusCircle
} from 'lucide-react';
import { LegalCase, ClientProfile, CaseUpdate, CaseDocument, CaseStatus, ClientNotice, CaseUpdateType, MatterCategory, CaseDocumentCategory } from '../types';

interface ClientManagementWorkspaceProps {
  client: ClientProfile;
  clientCases: LegalCase[];
  onBack: () => void;
  onUpdateClient: (updatedClient: ClientProfile) => Promise<void>;
  onToggleClientStatus: (clientId: string, newStatus: 'Active' | 'Deactivated') => Promise<void>;
  onDeleteClient: (clientId: string, deleteCases: boolean) => Promise<void>;
  onSaveCase: (legalCase: LegalCase) => Promise<void>;
  onDeleteCase: (caseId: string) => Promise<void>;
  onAddUpdateToCase: (caseId: string, update: CaseUpdate) => Promise<void>;
  onEditUpdate: (caseId: string, update: CaseUpdate) => Promise<void>;
  onDeleteUpdate: (caseId: string, updateId: string) => Promise<void>;
  onAddDocumentToCase: (caseId: string, doc: CaseDocument) => Promise<void>;
  onEditDocument: (caseId: string, doc: CaseDocument) => Promise<void>;
  onDeleteDocument: (caseId: string, docId: string) => Promise<void>;
  onAddNoticeToCase: (caseId: string, notice: ClientNotice) => Promise<void>;
  onDeleteNotice: (caseId: string, noticeId: string) => Promise<void>;
  onSwitchToClientView?: (email: string) => void;
  currentUserName: string | null;
  initialTab?: 'dockets' | 'updates' | 'documents' | 'notices' | 'profile';
  initialOpenAddUpdate?: boolean;
  initialCaseIdForUpdate?: string;
}

type ManageTab = 'dockets' | 'updates' | 'documents' | 'notices' | 'profile';

const ClientManagementWorkspace: React.FC<ClientManagementWorkspaceProps> = ({
  client,
  clientCases,
  onBack,
  onUpdateClient,
  onToggleClientStatus,
  onDeleteClient,
  onSaveCase,
  onDeleteCase,
  onAddUpdateToCase,
  onEditUpdate,
  onDeleteUpdate,
  onAddDocumentToCase,
  onEditDocument,
  onDeleteDocument,
  onAddNoticeToCase,
  onDeleteNotice,
  onSwitchToClientView,
  currentUserName,
  initialTab = 'dockets',
  initialOpenAddUpdate = false,
  initialCaseIdForUpdate
}) => {
  const [activeTab, setActiveTab] = useState<ManageTab>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddDocketModal, setShowAddDocketModal] = useState(false);
  const [editingCase, setEditingCase] = useState<LegalCase | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<LegalCase | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);
  const [deleteClientWithCases, setDeleteClientWithCases] = useState(false);

  // Updates / Documents / Notices Modals
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(initialOpenAddUpdate);
  const [selectedCaseForUpdate, setSelectedCaseForUpdate] = useState<string>(
    initialCaseIdForUpdate || clientCases[0]?.id || ''
  );
  const [editingUpdate, setEditingUpdate] = useState<{ caseId: string; update: CaseUpdate } | null>(null);

  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [selectedCaseForDoc, setSelectedCaseForDoc] = useState<string>(clientCases[0]?.id || '');

  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [selectedCaseForNotice, setSelectedCaseForNotice] = useState<string>(clientCases[0]?.id || '');

  // Form States
  const [clientForm, setClientForm] = useState({
    name: client.name,
    email: client.email,
    organization: client.organization,
    representative: client.representative,
    phone: client.phone,
    address: client.address,
    notes: client.notes || ''
  });

const PRACTICE_PRESETS = [
  {
    name: 'Compliance and Advisory',
    category: 'Compliance & Regulatory Advisory' as MatterCategory,
    forum: 'Nigeria Data Protection Commission (NDPC) / CAC',
    presiding: 'National Commissioner / Registrar-General',
    status: 'Regulatory Audit & Compliance Review' as CaseStatus,
    stage: 'Regulatory Compliance Audit & Impact Assessment',
    nextMilestone: 'NOV 15, 2026 - Statutory NDPC Audit Filing Deadline',
    docCategory: 'Compliance Audit & Impact Report' as CaseDocumentCategory,
    docTitle: 'Regulatory Compliance Audit & Impact Report',
    updateTitle: 'Compliance Review & Retainer Initialized',
    updateType: 'Regulatory Development' as CaseUpdateType
  },
  {
    name: 'General Corporate/Commercial Legal Support',
    category: 'Corporate & Commercial Legal Support' as MatterCategory,
    forum: 'Corporate Affairs Commission (CAC) / Securities & Exchange Commission',
    presiding: 'Registrar-General / Transaction Directorate',
    status: 'Transactional Drafting & Negotiation' as CaseStatus,
    stage: 'Contract Drafting, Due Diligence & Negotiation',
    nextMilestone: 'NOV 20, 2026 - Definitive Agreement Execution',
    docCategory: 'Commercial Contract / Transaction Draft' as CaseDocumentCategory,
    docTitle: 'Master Commercial Contract & Transaction Draft',
    updateTitle: 'Corporate Transactional Mandate Initiated',
    updateType: 'Legal Milestone' as CaseUpdateType
  },
  {
    name: 'Corporate Criminal Defense',
    category: 'Corporate Criminal Defense & Investigations' as MatterCategory,
    forum: 'EFCC Legal & Prosecution Directorate / Special Operations Unit',
    presiding: 'Director of Legal & Prosecution / Enforcement Taskforce',
    status: 'Pre-Charge Investigation & Defense' as CaseStatus,
    stage: 'Pre-Charge Investigation, Document Production & Defense',
    nextMilestone: 'NOV 10, 2026 - Agency Document Production Session',
    docCategory: 'Legal Opinion / Advisory Memo' as CaseDocumentCategory,
    docTitle: 'Statutory Defense Position Paper & Agency Response',
    updateTitle: 'Pre-Charge Defense File & Representation Opened',
    updateType: 'Investigative Development' as CaseUpdateType
  },
  {
    name: 'Tax Advisory & Fiscal Structuring',
    category: 'Tax Advisory & Fiscal Structuring' as MatterCategory,
    forum: 'Federal Inland Revenue Service (FIRS) - Large Tax Office',
    presiding: 'Director of Corporate Tax Audit & Review Panel',
    status: 'Active Advisory / Retainer' as CaseStatus,
    stage: 'Tax Assessment Reconciliation & Advance Ruling Advisory',
    nextMilestone: 'NOV 18, 2026 - FIRS Technical Audit Reconciliation',
    docCategory: 'Tax Assessment & Defense Filing' as CaseDocumentCategory,
    docTitle: 'Tax Advisory Position Paper & Fiscal Defense',
    updateTitle: 'Fiscal Review & Advisory Protocol Initiated',
    updateType: 'Legal Milestone' as CaseUpdateType
  },
  {
    name: 'Energy, Maritime & Natural Resources',
    category: 'Energy, Maritime & Natural Resources' as MatterCategory,
    forum: 'Nigerian Upstream Petroleum Regulatory Commission (NUPRC) / Federal High Court',
    presiding: 'Commission Chief Executive / Admiralty Division Judge',
    status: 'Active Advisory / Retainer' as CaseStatus,
    stage: 'Concession Review, Host Community Trust & Local Content Compliance',
    nextMilestone: 'DEC 02, 2026 - PIA Concession Statutory Milestone',
    docCategory: 'Regulatory Filing / Statutory Permit' as CaseDocumentCategory,
    docTitle: 'PIA Concession & Operational Compliance Framework',
    updateTitle: 'Energy Concession & Statutory Framework Onboarded',
    updateType: 'Regulatory Development' as CaseUpdateType
  },
  {
    name: 'IT Law, Tech Regulatory & Data Protection',
    category: 'IT Law, Tech Regulatory & Data Protection' as MatterCategory,
    forum: 'Nigeria Data Protection Commission (NDPC) / SEC Sandbox',
    presiding: 'National Commissioner & DPCO Audit Directorate',
    status: 'Regulatory Audit & Compliance Review' as CaseStatus,
    stage: 'DPIA Privacy Audit & Software Licensing Framework',
    nextMilestone: 'NOV 25, 2026 - Statutory Tech Compliance Filing',
    docCategory: 'Data Protection (NDPA) Framework' as CaseDocumentCategory,
    docTitle: 'Data Protection Impact Assessment (NDPA Framework)',
    updateTitle: 'Technology Regulatory Retainer & Audit Activated',
    updateType: 'Regulatory Development' as CaseUpdateType
  },
  {
    name: 'Government Relations, Public Policy & ESG',
    category: 'Government Relations, Public Policy & ESG' as MatterCategory,
    forum: 'National Assembly Joint Committee / Ministry of Environment',
    presiding: 'Director of Public-Private Concessions & ESG Board',
    status: 'Active Advisory / Retainer' as CaseStatus,
    stage: 'Policy Advisory, Public Procurement & ESG Impact Verification',
    nextMilestone: 'NOV 30, 2026 - Ministerial Stakeholder Consultation',
    docCategory: 'Compliance Audit & Impact Report' as CaseDocumentCategory,
    docTitle: 'ESG Impact Verification & Public Policy Advisory',
    updateTitle: 'Public Policy Advisory & Stakeholder Liaison Initiated',
    updateType: 'Regulatory Development' as CaseUpdateType
  },
  {
    name: 'Dispute Resolution & Commercial Advocacy',
    category: 'Dispute Resolution & Commercial Advocacy' as MatterCategory,
    forum: 'Federal High Court, Abuja Judicial Division',
    presiding: 'Hon. Justice M. A. Idris (Presiding)',
    status: 'Active Trial' as CaseStatus,
    stage: 'Pleadings Exchange & Substantive Hearing',
    nextMilestone: 'NOV 18, 2026 at 09:30 AM',
    docCategory: 'Originating Summons' as CaseDocumentCategory,
    docTitle: 'Originating Process & Statement of Claim',
    updateTitle: 'Commercial Dispute Docket Formally Instituted',
    updateType: 'Filing of Processes' as CaseUpdateType
  }
];

  const [docketForm, setDocketForm] = useState({
    title: '',
    caseNumber: '',
    suitNumber: '',
    courtJurisdiction: 'Nigeria Data Protection Commission (NDPC) / CAC',
    judgeOrPanel: 'National Commissioner / Registrar-General',
    status: 'Regulatory Audit & Compliance Review' as CaseStatus,
    stage: 'Regulatory Compliance Audit & Impact Assessment',
    filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    nextHearingDate: 'NOV 15, 2026 - Statutory NDPC Audit Filing Deadline',
    practiceArea: 'Compliance and Advisory',
    matterCategory: 'Compliance & Regulatory Advisory' as MatterCategory,
    summary: ''
  });

  const [updateForm, setUpdateForm] = useState({
    title: '',
    notes: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
    type: 'Court Hearing' as CaseUpdateType | string,
    visibility: 'Client Visible' as 'Client Visible' | 'Internal/Confidential',
    caseStatus: '' as CaseStatus | '',
    nextAction: '',
    nextActionDate: '',
    attachmentName: '',
    attachmentUrl: '',
    additionalRemarks: ''
  });

  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Brief of Argument' as CaseDocument['category'],
    filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    fileSize: '1.8 MB',
    status: 'Filed' as CaseDocument['status']
  });

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
    priority: 'Privileged' as ClientNotice['priority'],
    sender: currentUserName || "Al'Qasim Jafar (Managing Partner)"
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Handle Edit Client Profile
  const handleSaveClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated: ClientProfile = {
        ...client,
        name: clientForm.name.trim(),
        email: clientForm.email.toLowerCase().trim(),
        organization: clientForm.organization.trim(),
        representative: clientForm.representative.trim(),
        phone: clientForm.phone.trim(),
        address: clientForm.address.trim(),
        notes: clientForm.notes.trim()
      };
      await onUpdateClient(updated);
      setShowEditProfileModal(false);
      showToast('Client profile updated successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async () => {
    const nextStatus = client.status === 'Active' ? 'Deactivated' : 'Active';
    try {
      await onToggleClientStatus(client.id, nextStatus);
      setShowDeactivateModal(false);
      showToast(
        nextStatus === 'Deactivated'
          ? `Client ${client.name} deactivated. Portal access revoked.`
          : `Client ${client.name} reactivated. Portal access restored.`
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Client
  const handleDeleteClientSubmit = async () => {
    try {
      await onDeleteClient(client.id, deleteClientWithCases);
      setShowDeleteClientModal(false);
      onBack();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Create / Edit Docket
  const handleSaveDocketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const preset = PRACTICE_PRESETS.find(p => p.name === docketForm.practiceArea) || PRACTICE_PRESETS[0];

      if (editingCase) {
        const updated: LegalCase = {
          ...editingCase,
          title: docketForm.title.trim(),
          caseNumber: docketForm.caseNumber.trim(),
          docketNumber: docketForm.caseNumber.trim(),
          suitNumber: docketForm.suitNumber.trim() || undefined,
          courtJurisdiction: docketForm.courtJurisdiction.trim(),
          judgeOrPanel: docketForm.judgeOrPanel.trim(),
          status: docketForm.status,
          stage: docketForm.stage.trim(),
          filingDate: docketForm.filingDate.trim(),
          nextHearingDate: docketForm.nextHearingDate.trim(),
          practiceArea: docketForm.practiceArea.trim(),
          matterCategory: docketForm.matterCategory || preset.category,
          matterTrack: docketForm.matterCategory || preset.category,
          summary: docketForm.summary.trim(),
          clientName: client.name,
          clientEmail: client.email,
          updatedAt: new Date().toISOString()
        };
        await onSaveCase(updated);
        setEditingCase(null);
        setShowAddDocketModal(false);
        showToast(`Docket ${updated.caseNumber} updated successfully.`);
      } else {
        const newCaseId = `case-${Date.now()}`;
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const prefix = docketForm.practiceArea.toLowerCase().includes('tax') ? 'TEP/TAX/2026' :
                       docketForm.practiceArea.toLowerCase().includes('compliance') ? 'TEP/NDPC/2026' :
                       docketForm.practiceArea.toLowerCase().includes('corporate') ? 'TEP/CORP/2026' :
                       docketForm.practiceArea.toLowerCase().includes('criminal') ? 'TEP/DEF/2026' :
                       docketForm.practiceArea.toLowerCase().includes('energy') ? 'TEP/ENR/2026' : 'TEP/MAT/2026';
        const docketNumber = docketForm.caseNumber.trim() || `${prefix}/${randomNum}`;
        const created: LegalCase = {
          id: newCaseId,
          caseNumber: docketNumber,
          docketNumber,
          suitNumber: docketForm.suitNumber.trim() || undefined,
          title: docketForm.title.trim(),
          clientUid: client.id,
          clientName: client.name,
          clientEmail: client.email,
          practiceArea: docketForm.practiceArea.trim(),
          matterCategory: docketForm.matterCategory || preset.category,
          matterTrack: docketForm.matterCategory || preset.category,
          leadAttorney: "Al'Qasim Jafar (Managing Partner)",
          leadAttorneyEmail: 'a.jafar@tep.com.ng',
          regionalOffice: 'Abuja (Federal Capital Territory)',
          status: docketForm.status,
          stage: docketForm.stage.trim(),
          filingDate: docketForm.filingDate.trim(),
          nextHearingDate: docketForm.nextHearingDate.trim(),
          courtJurisdiction: docketForm.courtJurisdiction.trim(),
          judgeOrPanel: docketForm.judgeOrPanel.trim(),
          summary: docketForm.summary.trim() || 'Factual matrix, regulatory scope, and legal strategy for client representation.',
          recentUpdates: [
            {
              id: `upd-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
              title: preset.updateTitle,
              notes: `Registered and verified by Three Edge Practice registry for ${client.name} (${client.email}). Initial mandate and strategy protocol established.`,
              author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
              type: preset.updateType,
              visibility: 'Client Visible',
              caseStatus: docketForm.status,
              nextAction: 'First substantive engagement / statutory submission',
              nextActionDate: docketForm.nextHearingDate
            }
          ],
          documents: [
            {
              id: `doc-${Date.now()}`,
              title: `${preset.docTitle} - ${docketForm.title.slice(0, 30)}...`,
              category: preset.docCategory,
              filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
              fileSize: '2.4 MB',
              status: preset.name.includes('Dispute') ? 'Filed' : 'Certified'
            }
          ],
          clientAccess: client.status === 'Active' ? 'Active' : 'Deactivated',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await onSaveCase(created);
        setShowAddDocketModal(false);
        showToast(`Docket ${docketNumber} linked to ${client.email}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit Docket Modal
  const openEditDocket = (c: LegalCase) => {
    setEditingCase(c);
    setDocketForm({
      title: c.title,
      caseNumber: c.docketNumber || c.caseNumber,
      suitNumber: c.suitNumber || '',
      courtJurisdiction: c.courtJurisdiction || c.forumOrAuthority || '',
      judgeOrPanel: c.judgeOrPanel || c.presidingOfficer || '',
      status: c.status,
      stage: c.stage,
      filingDate: c.filingDate,
      nextHearingDate: c.nextHearingDate || '',
      practiceArea: c.practiceArea,
      matterCategory: (c.matterCategory as MatterCategory) || 'Compliance & Regulatory Advisory',
      summary: c.summary
    });
    setShowAddDocketModal(true);
  };

  // Open Add Docket Modal
  const openAddDocket = () => {
    setEditingCase(null);
    const defaultPreset = PRACTICE_PRESETS[0];
    setDocketForm({
      title: '',
      caseNumber: '',
      suitNumber: '',
      courtJurisdiction: defaultPreset.forum,
      judgeOrPanel: defaultPreset.presiding,
      status: defaultPreset.status,
      stage: defaultPreset.stage,
      filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      nextHearingDate: defaultPreset.nextMilestone,
      practiceArea: defaultPreset.name,
      matterCategory: defaultPreset.category,
      summary: ''
    });
    setShowAddDocketModal(true);
  };

  // Submit Update to Case
  const handleAddUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.title.trim() || !selectedCaseForUpdate) return;
    try {
      if (editingUpdate) {
        const updated: CaseUpdate = {
          ...editingUpdate.update,
          title: updateForm.title.trim(),
          notes: updateForm.notes.trim(),
          date: updateForm.date.trim(),
          type: updateForm.type,
          author: updateForm.author.trim(),
          visibility: updateForm.visibility,
          caseStatus: updateForm.caseStatus ? (updateForm.caseStatus as CaseStatus) : undefined,
          nextAction: updateForm.nextAction.trim() || undefined,
          nextActionDate: updateForm.nextActionDate.trim() || undefined,
          attachmentName: updateForm.attachmentName.trim() || undefined,
          attachmentUrl: updateForm.attachmentUrl.trim() || undefined,
          additionalRemarks: updateForm.additionalRemarks.trim() || undefined
        };
        await onEditUpdate(editingUpdate.caseId, updated);
        setEditingUpdate(null);
        showToast('Case update modified successfully.');
      } else {
        const newUpd: CaseUpdate = {
          id: `upd-${Date.now()}`,
          title: updateForm.title.trim(),
          notes: updateForm.notes.trim(),
          date: updateForm.date.trim(),
          type: updateForm.type,
          author: updateForm.author.trim(),
          visibility: updateForm.visibility,
          caseStatus: updateForm.caseStatus ? (updateForm.caseStatus as CaseStatus) : undefined,
          nextAction: updateForm.nextAction.trim() || undefined,
          nextActionDate: updateForm.nextActionDate.trim() || undefined,
          attachmentName: updateForm.attachmentName.trim() || undefined,
          attachmentUrl: updateForm.attachmentUrl.trim() || undefined,
          additionalRemarks: updateForm.additionalRemarks.trim() || undefined
        };
        await onAddUpdateToCase(selectedCaseForUpdate, newUpd);
        setShowAddUpdateModal(false);
        showToast(
          updateForm.visibility === 'Client Visible'
            ? 'Case update recorded & synced to client dashboard.'
            : 'Internal confidential update saved (visible strictly to Firm/Admin).'
        );
      }
      setUpdateForm({
        title: '',
        notes: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
        type: 'Court Hearing',
        visibility: 'Client Visible',
        caseStatus: '',
        nextAction: '',
        nextActionDate: '',
        attachmentName: '',
        attachmentUrl: '',
        additionalRemarks: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Open Add Update Modal
  const openAddUpdate = (caseId?: string) => {
    if (caseId) {
      setSelectedCaseForUpdate(caseId);
    } else if (clientCases.length > 0) {
      setSelectedCaseForUpdate(clientCases[0].id);
    }
    setEditingUpdate(null);
    setUpdateForm({
      title: '',
      notes: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
      type: 'Court Hearing',
      visibility: 'Client Visible',
      caseStatus: '',
      nextAction: '',
      nextActionDate: '',
      attachmentName: '',
      attachmentUrl: '',
      additionalRemarks: ''
    });
    setShowAddUpdateModal(true);
  };

  // Open Edit Update Modal
  const openEditUpdate = (caseId: string, upd: CaseUpdate) => {
    setEditingUpdate({ caseId, update: upd });
    setSelectedCaseForUpdate(caseId);
    setUpdateForm({
      title: upd.title || '',
      notes: upd.notes || '',
      date: upd.date || '',
      author: upd.author || (currentUserName || "Al'Qasim Jafar (Managing Partner)"),
      type: upd.type || 'Court Hearing',
      visibility: upd.visibility || 'Client Visible',
      caseStatus: upd.caseStatus || '',
      nextAction: upd.nextAction || '',
      nextActionDate: upd.nextActionDate || '',
      attachmentName: upd.attachmentName || '',
      attachmentUrl: upd.attachmentUrl || '',
      additionalRemarks: upd.additionalRemarks || ''
    });
    setShowAddUpdateModal(true);
  };

  // Submit Document to Case
  const handleAddDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim() || !selectedCaseForDoc) return;
    try {
      const newDoc: CaseDocument = {
        id: `doc-${Date.now()}`,
        title: docForm.title.trim(),
        category: docForm.category,
        filingDate: docForm.filingDate.trim(),
        fileSize: docForm.fileSize.trim(),
        status: docForm.status
      };
      await onAddDocumentToCase(selectedCaseForDoc, newDoc);
      setShowAddDocModal(false);
      setDocForm({
        title: '',
        category: 'Brief of Argument',
        filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        fileSize: '1.8 MB',
        status: 'Filed'
      });
      showToast('Court document added to client dossier.');
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Notice to Client
  const handleAddNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.message.trim() || !selectedCaseForNotice) return;
    try {
      const newNotice: ClientNotice = {
        id: `not-${Date.now()}`,
        title: noticeForm.title.trim(),
        message: noticeForm.message.trim(),
        date: noticeForm.date.trim(),
        priority: noticeForm.priority,
        sender: noticeForm.sender.trim()
      };
      await onAddNoticeToCase(selectedCaseForNotice, newNotice);
      setShowAddNoticeModal(false);
      setNoticeForm({
        title: '',
        message: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        priority: 'Privileged',
        sender: currentUserName || "Al'Qasim Jafar (Managing Partner)"
      });
      showToast('Client notice posted to client dashboard.');
    } catch (err) {
      console.error(err);
    }
  };

  // Aggregated updates for this client's cases
  const allClientUpdates = clientCases.flatMap(c => 
    (c.recentUpdates || []).map(u => ({ ...u, caseId: c.id, caseNumber: c.caseNumber, caseTitle: c.title }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Aggregated documents for this client's cases
  const allClientDocuments = clientCases.flatMap(c =>
    (c.documents || []).map(d => ({ ...d, caseId: c.id, caseNumber: c.caseNumber, caseTitle: c.title }))
  );

  // Aggregated notices for this client's cases
  const allClientNotices = clientCases.flatMap(c =>
    (c.clientNotices || []).map(n => ({ ...n, caseId: c.id, caseNumber: c.caseNumber, caseTitle: c.title }))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-950 border-l-4 border-l-emerald-500 text-white text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#990000] uppercase tracking-wider mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Clients Directory</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-black">{client.name}</h2>
            <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
              client.status === 'Active'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-red-100 text-red-900 border-red-300'
            }`}>
              {client.status === 'Active' ? 'Active Portal Client' : 'Portal Access Deactivated'}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-mono border border-gray-200">
              {clientCases.length} Assigned Docket{clientCases.length > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <strong className="text-black font-mono">{client.email}</strong>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-gray-400" />
              <span>{client.organization}</span>
            </span>
            <span>&bull;</span>
            <span>Rep: <strong>{client.representative}</strong></span>
          </p>
        </div>

        {/* Global Client Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onSwitchToClientView && client.status === 'Active' && (
            <button
              onClick={() => onSwitchToClientView(client.email)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Preview how this client sees their portal"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Client Portal</span>
            </button>
          )}

          <button
            onClick={() => setShowDeactivateModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
              client.status === 'Active'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {client.status === 'Active' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Deactivate Portal</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reactivate Portal</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setClientForm({
                name: client.name,
                email: client.email,
                organization: client.organization,
                representative: client.representative,
                phone: client.phone,
                address: client.address,
                notes: client.notes || ''
              });
              setShowEditProfileModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider border border-gray-300 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setShowDeleteClientModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-bold uppercase tracking-wider border border-red-200 transition-colors cursor-pointer"
            title="Permanently remove client"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Deactivated Notice Banner if inactive */}
      {client.status === 'Deactivated' && (
        <div className="p-4 bg-red-50 border-l-4 border-l-red-600 text-xs text-red-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-wider">Client Portal Access Is Currently Deactivated</p>
            <p>
              Users signing in with <strong className="font-mono bg-red-100 px-1 py-0.5">{client.email}</strong> will receive an explicit 403 Access Denied notice upon logging in. Underlying docket history is retained safely for firm regulatory compliance. Click <strong>"Reactivate Portal"</strong> to restore client access.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs for Client-Visible Information Management */}
      <div className="bg-white border border-gray-200 px-6 py-2 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dockets')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'dockets'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Assigned Dockets ({clientCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'updates'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Proceedings Minutes ({allClientUpdates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'documents'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Client Documents ({allClientDocuments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'notices'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Client Notices & Advisories ({allClientNotices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Profile Dossier</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-400 font-mono hidden md:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strict Client Separation Active</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DOCKETS & CASE INFORMATION                              */}
      {/* ============================================================== */}
      {activeTab === 'dockets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Client-Visible Legal Dockets</h3>
              <p className="text-xs text-gray-500">
                Manage matter status, procedural stage, regulatory deadlines/hearings, and strategic objectives visible strictly to {client.name}.
              </p>
            </div>
            <button
              onClick={openAddDocket}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Link New Docket to Client</span>
            </button>
          </div>

          {clientCases.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No dockets linked to this client yet</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Create a new case docket or link an existing matter to {client.email} so they can track proceedings.
              </p>
              <button
                onClick={openAddDocket}
                className="mt-2 px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Onboard First Docket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {clientCases.map(c => (
                <div key={c.id} className="bg-white border border-gray-200 p-6 shadow-xs space-y-4 hover:border-gray-400 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-black bg-gray-100 px-2.5 py-0.5 border border-gray-300" title="Firm Docket / File Reference Number">
                          File Ref: {c.docketNumber || c.caseNumber}
                        </span>
                        {c.suitNumber ? (
                          <span className="font-mono text-xs font-bold text-[#990000] bg-red-50 px-2.5 py-0.5 border border-red-200" title="Court Suit / Official Proceeding Number">
                            Suit No: {c.suitNumber}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 border border-gray-200" title="Non-Litigation / Advisory Matter">
                            Suit No: N/A (Non-Court)
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                          {c.status}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-gray-100 text-gray-800 border-gray-300">
                          {c.practiceArea}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">&bull; Filed / Initiated: {c.filingDate}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-black">{c.title}</h4>
                      <p className="text-xs text-gray-600 font-medium">
                        Forum / Authority: <span className="text-black font-semibold">{c.courtJurisdiction || c.forumOrAuthority}</span>
                        {(c.judgeOrPanel || c.presidingOfficer) && (
                          <span> &bull; Presiding: <span className="text-gray-800">{c.judgeOrPanel || c.presidingOfficer}</span></span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <button
                        onClick={() => openEditDocket(c)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-[#990000] hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-gray-300 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Docket Info</span>
                      </button>
                      <button
                        onClick={() => setCaseToDelete(c)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete docket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary / Brief */}
                  <div className="p-4 bg-gray-50 border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500">Current Matter / Procedural Stage:</span>
                      <span className="font-semibold text-black">{c.stage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500">Upcoming Milestone / Deadline / Hearing:</span>
                      <span className="font-mono font-bold text-[#990000]">{c.nextHearingDate || 'Schedule / Fixture Pending'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Client-Visible Brief Summary:</p>
                      <p className="text-gray-700 leading-relaxed font-light">{c.summary}</p>
                    </div>
                  </div>

                  {/* Quick Docket Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span><strong>{c.recentUpdates?.length || 0}</strong> Proceedings Minutes</span>
                      <span><strong>{c.documents?.length || 0}</strong> Electronic Documents</span>
                      <span><strong>{c.clientNotices?.length || 0}</strong> Client Notices</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCaseForUpdate(c.id);
                          setActiveTab('updates');
                        }}
                        className="text-[#990000] font-bold uppercase text-[11px] hover:underline cursor-pointer"
                      >
                        + Log Minute &rarr;
                      </button>
                      <span>&bull;</span>
                      <button
                        onClick={() => {
                          setSelectedCaseForDoc(c.id);
                          setActiveTab('documents');
                        }}
                        className="text-[#990000] font-bold uppercase text-[11px] hover:underline cursor-pointer"
                      >
                        + File Process &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PROCEEDINGS MINUTES & CASE UPDATES                      */}
      {/* ============================================================== */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Client Case Updates & Proceedings</h3>
              <p className="text-xs text-gray-500">
                Record, modify, or remove case developments for {client.name}. Choose whether each update is Client Visible or Internal/Confidential.
              </p>
            </div>
            {clientCases.length > 0 ? (
              <button
                onClick={() => openAddUpdate()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ADD CASE UPDATE</span>
              </button>
            ) : (
              <button
                onClick={openAddDocket}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
                title="A docket must be created first before an update can be saved"
              >
                <Plus className="w-4 h-4" />
                <span>+ Link Docket First</span>
              </button>
            )}
          </div>

          {allClientUpdates.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center space-y-3">
              <Activity className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No case updates recorded for {client.name} yet</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Click &ldquo;ADD CASE UPDATE&rdquo; above to record court proceedings, rulings, filings, settlement developments, or client instructions.
              </p>
              {clientCases.length > 0 && (
                <button
                  onClick={() => openAddUpdate()}
                  className="mt-2 px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  ADD FIRST CASE UPDATE
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {allClientUpdates.map(upd => {
                const isInternal = upd.visibility === 'Internal/Confidential';
                return (
                  <div key={upd.id} className="bg-white border border-gray-200 p-5 space-y-3 hover:border-black transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-black">{upd.title}</span>
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] border border-gray-200">
                            {upd.caseNumber}
                          </span>
                          {upd.type && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-mono border border-blue-200">
                              {upd.type}
                            </span>
                          )}
                          {/* Visibility Badge */}
                          {isInternal ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Internal / Confidential</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                              <Eye className="w-3 h-3 text-emerald-700" />
                              <span>Client Visible</span>
                            </span>
                          )}
                          {upd.caseStatus && (
                            <span className="px-1.5 py-0.5 bg-gray-50 text-gray-700 text-[10px] font-mono border border-gray-200">
                              Docket Status: {upd.caseStatus}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {upd.date} &bull; Recorded by: <strong>{upd.author}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => openEditUpdate(upd.caseId, upd)}
                          className="flex items-center gap-1 text-xs text-gray-700 hover:text-black font-bold uppercase cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <span>&bull;</span>
                        <button
                          onClick={() => onDeleteUpdate(upd.caseId, upd.id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold uppercase cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-light bg-gray-50 p-3 border border-gray-100">
                      {upd.notes}
                    </p>

                    {/* Next Action / Step */}
                    {upd.nextAction && (
                      <div className="text-[11px] text-gray-700 bg-white p-2.5 border border-gray-200">
                        <span className="font-semibold text-[#990000]">Next Action:</span> {upd.nextAction}
                        {upd.nextActionDate && (
                          <span className="font-mono text-gray-500 ml-1.5">({upd.nextActionDate})</span>
                        )}
                      </div>
                    )}

                    {/* Attachment / Reference */}
                    {upd.attachmentName && (
                      <div className="text-[11px] text-gray-600 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-[#990000]" />
                        <span>Attachment / Process Reference: <strong>{upd.attachmentName}</strong></span>
                      </div>
                    )}

                    {/* Additional Remarks */}
                    {upd.additionalRemarks && (
                      <p className="text-[11px] text-gray-500 italic bg-amber-50/50 p-2 border border-amber-100">
                        Remarks: {upd.additionalRemarks}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CLIENT DOCUMENTS & ELECTRONIC PROCESSES                 */}
      {/* ============================================================== */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Electronic Court Filings & Processes</h3>
              <p className="text-xs text-gray-500">
                Upload court process references, update certification status, or remove files visible to {client.name}.
              </p>
            </div>
            {clientCases.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCaseForDoc(clientCases[0].id);
                  setShowAddDocModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>File Process for Client</span>
              </button>
            )}
          </div>

          {allClientDocuments.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No documents registered for {client.name} yet</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Documents filed by lead counsel will appear directly in this client's Document Vault.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allClientDocuments.map(doc => (
                <div key={doc.id} className="bg-white border border-gray-200 p-5 space-y-3 flex flex-col justify-between hover:border-black transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200">
                        {doc.caseNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {doc.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-black leading-snug">{doc.title}</h4>
                    <p className="text-xs text-gray-500 font-mono">Category: {doc.category} &bull; Filed: {doc.filingDate}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Lifecycle status advancement button */}
                      <button
                        onClick={() => {
                          const nextStatus: CaseDocument['status'] = 
                            doc.status === 'Drafting' ? 'Served' :
                            doc.status === 'Served' ? 'Filed' : 'Certified';
                          onEditDocument(doc.caseId, { ...doc, status: nextStatus });
                          showToast(`Advanced ${doc.title} to ${nextStatus}.`);
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-[#990000] hover:text-white text-gray-800 text-[10px] font-bold uppercase transition-colors"
                        title="Advance document status"
                      >
                        Advance &rarr;
                      </button>
                    </div>

                    <button
                      onClick={() => onDeleteDocument(doc.caseId, doc.id)}
                      className="text-red-600 hover:text-red-800 font-bold uppercase text-[10px]"
                    >
                      Delete Process
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CLIENT NOTICES & ADVISORIES                             */}
      {/* ============================================================== */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Direct Messages & Privileged Advisories</h3>
              <p className="text-xs text-gray-500">
                Post confidential advisories, hearing briefings, or urgent notifications displayed directly on {client.name}’s dashboard.
              </p>
            </div>
            {clientCases.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCaseForNotice(clientCases[0].id);
                  setShowAddNoticeModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post Direct Notice</span>
              </button>
            )}
          </div>

          {allClientNotices.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center space-y-3">
              <Bell className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No notices posted for {client.name} yet</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Notices appear prominently on the client’s legal dashboard as direct communication from lead counsel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allClientNotices.map(notice => (
                <div key={notice.id} className="bg-white border border-gray-200 p-5 space-y-2 border-l-4 border-l-[#990000] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-black">{notice.title}</span>
                      <span className={`px-2 py-0.2 text-[10px] font-mono uppercase font-bold border ${
                        notice.priority === 'Urgent'
                          ? 'bg-red-100 text-red-900 border-red-300'
                          : notice.priority === 'Privileged'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {notice.priority}
                      </span>
                      <span className="text-xs font-mono text-gray-500">[{notice.caseNumber}]</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-gray-400">{notice.date}</span>
                      <button
                        onClick={() => onDeleteNotice(notice.caseId, notice.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-bold uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-light bg-gray-50 p-3 border border-gray-100">
                    {notice.message}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">Issued by: {notice.sender}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PROFILE DOSSIER                                         */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-black">Client Institutional Dossier</h3>
              <p className="text-xs text-gray-500">Corporate client onboarding credentials and registry data.</p>
            </div>
            <button
              onClick={() => {
                setClientForm({
                  name: client.name,
                  email: client.email,
                  organization: client.organization,
                  representative: client.representative,
                  phone: client.phone,
                  address: client.address,
                  notes: client.notes || ''
                });
                setShowEditProfileModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Company / Entity Name:</span>
                <p className="text-sm font-bold text-black">{client.name}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Corporate Group / Organization:</span>
                <p className="text-sm font-medium text-black">{client.organization}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Authenticated Registered Email:</span>
                <p className="text-sm font-mono font-bold text-[#990000]">{client.email}</p>
                <span className="text-[10px] text-gray-400">Client uses this exact email to access their private legal dashboard.</span>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Authorized Representative:</span>
                <p className="text-sm text-black">{client.representative}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Official Contact Phone:</span>
                <p className="text-sm text-black">{client.phone}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Operating Headquarters / Address:</span>
                <p className="text-sm text-gray-700">{client.address}</p>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Client Status:</span>
                <span className={`px-2 py-0.5 font-bold uppercase text-[10px] border ${
                  client.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}>
                  {client.status}
                </span>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] tracking-wider block mb-1">Onboarding Notes:</span>
                <p className="text-gray-600 bg-gray-50 p-3 border border-gray-100">{client.notes || 'None recorded.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT CLIENT PROFILE                                     */}
      {/* ============================================================== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 border-t-4 border-[#990000] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">Edit Client Profile</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClientProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Registered Client Email (Login Key) *</label>
                <input
                  type="email"
                  required
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Changing this email will route login authentication to the new address.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Organization</label>
                  <input
                    type="text"
                    value={clientForm.organization}
                    onChange={(e) => setClientForm({ ...clientForm, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Representative</label>
                  <input
                    type="text"
                    value={clientForm.representative}
                    onChange={(e) => setClientForm({ ...clientForm, representative: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Headquarters / Address</label>
                  <input
                    type="text"
                    value={clientForm.address}
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-black text-white font-bold uppercase"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT DOCKET                                       */}
      {/* ============================================================== */}
      {(showAddDocketModal || editingCase) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-t-4 border-[#990000] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">
                {editingCase ? `Edit Docket: ${editingCase.caseNumber}` : `Link New Docket to ${client.name}`}
              </h3>
              <button
                onClick={() => {
                  setShowAddDocketModal(false);
                  setEditingCase(null);
                }}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocketSubmit} className="space-y-4 text-xs">
              {/* Practice Area Selector */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Firm Practice Area / Matter Track *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                  {PRACTICE_PRESETS.map((p) => {
                    const isSelected = docketForm.practiceArea === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setDocketForm({
                            ...docketForm,
                            practiceArea: p.name,
                            matterCategory: p.category,
                            courtJurisdiction: p.forum,
                            judgeOrPanel: p.presiding,
                            status: p.status,
                            stage: p.stage,
                            nextHearingDate: p.nextMilestone
                          });
                        }}
                        className={`p-2 text-left border rounded-xs transition-all cursor-pointer text-[11px] ${
                          isSelected
                            ? 'bg-[#990000] text-white border-[#990000] font-bold shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-400'
                        }`}
                      >
                        <span className="block truncate">{p.name}</span>
                        <span className={`block text-[9px] truncate ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                          {p.category.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Matter / Case Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Telecom - Statutory NDPA Compliance Audit & GAID Framework Implementation"
                  value={docketForm.title}
                  onChange={(e) => setDocketForm({ ...docketForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Docket / File Reference Number (Firm Ref) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TEP/NDPC/2026/0419"
                    value={docketForm.caseNumber}
                    onChange={(e) => setDocketForm({ ...docketForm, caseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#990000]"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Internal firm matter ref across all practice areas. Auto-generated if blank.
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Suit / Case Number (Court / Tribunal / Registry)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FHC/ABJ/CS/419/2026 or CAC/RC/2026/..."
                    value={docketForm.suitNumber}
                    onChange={(e) => setDocketForm({ ...docketForm, suitNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#990000]"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Associated with court or regulatory proceedings. Leave blank for non-contentious / advisory.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Matter Status *</label>
                  <select
                    value={docketForm.status}
                    onChange={(e) => setDocketForm({ ...docketForm, status: e.target.value as CaseStatus })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Active Advisory / Retainer">Active Advisory / Retainer</option>
                    <option value="Regulatory Audit & Compliance Review">Regulatory Audit & Compliance Review</option>
                    <option value="Transactional Drafting & Negotiation">Transactional Drafting & Negotiation</option>
                    <option value="Statutory Filing & Licensing">Statutory Filing & Licensing</option>
                    <option value="Pre-Charge Investigation & Defense">Pre-Charge Investigation & Defense</option>
                    <option value="Arbitration in Progress">Arbitration in Progress</option>
                    <option value="Settlement Discussions">Settlement Discussions</option>
                    <option value="Pre-Trial Discovery">Pre-Trial Discovery</option>
                    <option value="Active Trial">Active Trial</option>
                    <option value="Closed / Decided">Closed / Decided</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Filing / Inception Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OCT 07, 2026"
                    value={docketForm.filingDate}
                    onChange={(e) => setDocketForm({ ...docketForm, filingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              {/* Forum / Regulatory Authority / Court */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase tracking-wider text-gray-700">
                    Forum / Regulatory Authority / Jurisdiction / Registry *
                  </label>
                  <span className="text-[10px] text-gray-400">Quick presets:</span>
                </div>
                {/* Fast venue chips */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {[
                    'Corporate Affairs Commission (CAC)',
                    'Nigeria Data Protection Commission (NDPC)',
                    'Federal Inland Revenue Service (FIRS)',
                    'Central Bank of Nigeria (CBN)',
                    'NUPRC (Petroleum Commission)',
                    'EFCC Directorate, Abuja',
                    'Arbitral Tribunal (ICC / NICArb)',
                    'Federal High Court, Abuja Division',
                    'Court of Appeal'
                  ].map((forumName) => (
                    <button
                      key={forumName}
                      type="button"
                      onClick={() => setDocketForm({ ...docketForm, courtJurisdiction: forumName })}
                      className="px-2 py-0.5 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-xs transition-colors"
                    >
                      {forumName.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nigeria Data Protection Commission (NDPC) / CAC / Federal High Court"
                  value={docketForm.courtJurisdiction}
                  onChange={(e) => setDocketForm({ ...docketForm, courtJurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Presiding Authority / Lead Regulator / Panel / Judge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. National Commissioner & CEO (NDPC) / Registrar-General / Hon. Justice"
                    value={docketForm.judgeOrPanel}
                    onChange={(e) => setDocketForm({ ...docketForm, judgeOrPanel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Current Matter / Procedural Stage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DPIA Privacy Audit & Remediation / Due Diligence / Pleadings"
                    value={docketForm.stage}
                    onChange={(e) => setDocketForm({ ...docketForm, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Initiation / Filing Date</label>
                  <input
                    type="text"
                    value={docketForm.filingDate}
                    onChange={(e) => setDocketForm({ ...docketForm, filingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Next Milestone / Statutory Deadline / Hearing Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NOV 15, 2026 - Statutory NDPC Audit Filing Deadline"
                    value={docketForm.nextHearingDate}
                    onChange={(e) => setDocketForm({ ...docketForm, nextHearingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Client-Visible Brief Summary & Legal Objectives *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Substantive factual matrix, regulatory requirements, commercial covenants, and legal objectives visible on the client's dashboard."
                  value={docketForm.summary}
                  onChange={(e) => setDocketForm({ ...docketForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDocketModal(false);
                    setEditingCase(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-black text-white font-bold uppercase"
                >
                  {editingCase ? 'Save Changes' : 'Create & Link Docket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: RECORD / EDIT CASE UPDATE                               */}
      {/* ============================================================== */}
      {showAddUpdateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl p-6 sm:p-8 border-t-4 border-[#990000] shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
                  <h3 className="font-serif font-bold text-lg text-black">
                    {editingUpdate ? 'Edit Case Update' : 'Record Case Update'}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Matter: <span className="font-semibold text-black">{client.name}</span> &bull; {client.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddUpdateModal(false);
                  setEditingUpdate(null);
                }}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {clientCases.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>No Registered Cases or Dockets Available</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Under firm protocol, a case update cannot be saved without associating it with a specific client and case/docket. Please link or create a case docket for <strong>{client.name}</strong> first.
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    type="button"
                    onClick={() => setShowAddUpdateModal(false)}
                    className="px-3 py-1.5 border border-amber-300 text-amber-900 text-xs font-bold uppercase cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUpdateModal(false);
                      openAddDocket();
                    }}
                    className="px-4 py-1.5 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase cursor-pointer"
                  >
                    + Link New Docket to Client
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddUpdateSubmit} className="space-y-4 text-xs">
                {/* 1. Target Docket Selector */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Select Case / Docket *
                  </label>
                  <select
                    value={selectedCaseForUpdate}
                    onChange={(e) => setSelectedCaseForUpdate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000] font-medium"
                  >
                    {clientCases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} &bull; {c.title.length > 50 ? `${c.title.slice(0, 50)}...` : c.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    This update will be permanently linked to this docket in Firestore.
                  </p>
                </div>

                {/* 2. Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7">
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Update Title / Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ruling on Interlocutory Injunction Delivered"
                      value={updateForm.title}
                      onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Update Type / Category *
                    </label>
                    <select
                      value={updateForm.type}
                      onChange={(e) => setUpdateForm({ ...updateForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    >
                      <option value="Court Hearing">Court Hearing / Proceedings</option>
                      <option value="Court Ruling / Judgment">Court Ruling / Judgment</option>
                      <option value="Filing of Processes">Filing of Processes</option>
                      <option value="Service of Court Documents">Service of Court Documents</option>
                      <option value="Adjournment">Adjournment</option>
                      <option value="Settlement Development">Settlement Development</option>
                      <option value="Correspondence">Correspondence</option>
                      <option value="Regulatory Development">Regulatory Development</option>
                      <option value="Investigative Development">Investigative Development</option>
                      <option value="Client Instruction">Client Instruction</option>
                      <option value="Legal Milestone">Legal Milestone</option>
                      <option value="Next Steps">Next Steps</option>
                      <option value="Change in Case Status">Change in Case Status</option>
                      <option value="Other Significant Development">Other Significant Development</option>
                    </select>
                  </div>
                </div>

                {/* 3. Date & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Date of Update *
                    </label>
                    <input
                      type="text"
                      required
                      value={updateForm.date}
                      onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Author / Lead Counsel
                    </label>
                    <input
                      type="text"
                      value={updateForm.author}
                      onChange={(e) => setUpdateForm({ ...updateForm, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                {/* 4. Description / Details */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Description & Proceeding Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Comprehensive description of the court hearing, ruling, filing, settlement development, or instructions..."
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>

                {/* 5. Case Status (Optional status change) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Update Case Status (Optional)
                    </label>
                    <select
                      value={updateForm.caseStatus}
                      onChange={(e) => setUpdateForm({ ...updateForm, caseStatus: e.target.value as CaseStatus | '' })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    >
                      <option value="">-- Keep Current Docket Status --</option>
                      <option value="Active Trial">Active Trial</option>
                      <option value="Pre-Trial Discovery">Pre-Trial Discovery</option>
                      <option value="Regulatory Review">Regulatory Review</option>
                      <option value="Arbitration in Progress">Arbitration in Progress</option>
                      <option value="Settlement Discussions">Settlement Discussions</option>
                      <option value="Closed / Decided">Closed / Decided</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Next Action / Procedural Step
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Filing of Written Address"
                      value={updateForm.nextAction}
                      onChange={(e) => setUpdateForm({ ...updateForm, nextAction: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                {/* 6. Next Action Date & Document Reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Next Action Date / Deadline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NOV 24, 2026 at 09:30 AM"
                      value={updateForm.nextActionDate}
                      onChange={(e) => setUpdateForm({ ...updateForm, nextActionDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Documents or Attachments Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Certified True Copy of Ruling.pdf"
                      value={updateForm.attachmentName}
                      onChange={(e) => setUpdateForm({ ...updateForm, attachmentName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                {/* 7. Additional Remarks */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Additional Remarks / Counsel Observations
                  </label>
                  <input
                    type="text"
                    placeholder="Confidential remarks, case risk notes, or strategic instructions"
                    value={updateForm.additionalRemarks}
                    onChange={(e) => setUpdateForm({ ...updateForm, additionalRemarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>

                {/* 8. Visibility: Client Visible vs Internal/Confidential */}
                <div className="p-3 bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block font-bold uppercase tracking-wider text-gray-800">
                    Visibility & Access Control *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label
                      onClick={() => setUpdateForm({ ...updateForm, visibility: 'Client Visible' })}
                      className={`p-3 border flex items-start gap-2.5 cursor-pointer transition-all ${
                        updateForm.visibility === 'Client Visible'
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={updateForm.visibility === 'Client Visible'}
                        onChange={() => setUpdateForm({ ...updateForm, visibility: 'Client Visible' })}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-900">
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Client Visible</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-normal leading-tight">
                          Automatically synchronizes in real-time to {client.name}&rsquo;s Client Dashboard.
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setUpdateForm({ ...updateForm, visibility: 'Internal/Confidential' })}
                      className={`p-3 border flex items-start gap-2.5 cursor-pointer transition-all ${
                        updateForm.visibility === 'Internal/Confidential'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        checked={updateForm.visibility === 'Internal/Confidential'}
                        onChange={() => setUpdateForm({ ...updateForm, visibility: 'Internal/Confidential' })}
                        className="mt-0.5 text-amber-600"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-900">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Internal / Confidential</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-normal leading-tight">
                          Visible ONLY to authorized Firm/Admin users. NEVER shown to the client.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUpdateModal(false);
                      setEditingUpdate(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#990000] hover:bg-black text-white font-bold uppercase transition-colors cursor-pointer"
                  >
                    {editingUpdate ? 'Save Update Changes' : 'Record Case Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD DOCUMENT                                            */}
      {/* ============================================================== */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 border-t-4 border-[#990000] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">File Court Process for Client</h3>
              <button onClick={() => setShowAddDocModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Target Client Docket *</label>
                <select
                  value={selectedCaseForDoc}
                  onChange={(e) => setSelectedCaseForDoc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                >
                  {clientCases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appellant's Reply Brief on Points of Law"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value as CaseDocument['category'] })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Brief of Argument">Brief of Argument</option>
                    <option value="Originating Summons">Originating Summons</option>
                    <option value="Affidavit">Affidavit</option>
                    <option value="Ruling">Ruling</option>
                    <option value="Compliance Audit">Compliance Audit</option>
                    <option value="Settlement Draft">Settlement Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Filing Status</label>
                  <select
                    value={docForm.status}
                    onChange={(e) => setDocForm({ ...docForm, status: e.target.value as CaseDocument['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Drafting">Drafting</option>
                    <option value="Served">Served</option>
                    <option value="Filed">Filed</option>
                    <option value="Certified">Certified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Official Court Filing Date</label>
                  <input
                    type="text"
                    value={docForm.filingDate}
                    onChange={(e) => setDocForm({ ...docForm, filingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">File Size / Seal</label>
                  <input
                    type="text"
                    value={docForm.fileSize}
                    onChange={(e) => setDocForm({ ...docForm, fileSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 font-mono focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-black text-white font-bold uppercase"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: POST CLIENT NOTICE / ADVISORY                           */}
      {/* ============================================================== */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 border-t-4 border-[#990000] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">Post Direct Advisory for Client</h3>
              <button onClick={() => setShowAddNoticeModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Target Client Docket *</label>
                <select
                  value={selectedCaseForNotice}
                  onChange={(e) => setSelectedCaseForNotice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                >
                  {clientCases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Advisory Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Privileged Pre-Trial Strategy Advisory"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Priority Classification</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as ClientNotice['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Privileged">Privileged</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Issuing Counsel</label>
                  <input
                    type="text"
                    value={noticeForm.sender}
                    onChange={(e) => setNoticeForm({ ...noticeForm, sender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-700 mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Confidential advisory instructions or case preparation notice visible on client dashboard."
                  value={noticeForm.message}
                  onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-black text-white font-bold uppercase"
                >
                  Send to Client Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DEACTIVATE / REACTIVATE CLIENT CONFIRMATION             */}
      {/* ============================================================== */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 border-t-4 border-amber-600 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif font-bold text-lg text-black">
                {client.status === 'Active' ? 'Deactivate Client Portal Access?' : 'Reactivate Client Portal Access?'}
              </h3>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              {client.status === 'Active' ? (
                <>
                  <p className="font-bold">Immediate Access Revocation:</p>
                  <p>
                    Deactivating <strong className="text-black">{client.name}</strong> ({client.email}) will immediately prevent the client from accessing their legal dashboard.
                  </p>
                  <p className="text-gray-700">
                    <strong>Data Retention Guarantee:</strong> Underlying case records and electronic filings are safely retained in firm archives and will NOT be deleted.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold">Restore Client Portal Access:</p>
                  <p>
                    Reactivating will restore portal access for <strong className="text-black">{client.name}</strong> ({client.email}) to inspect their assigned matters.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-5 py-2 text-white text-xs font-bold uppercase ${
                  client.status === 'Active' ? 'bg-amber-700 hover:bg-black' : 'bg-emerald-700 hover:bg-black'
                }`}
              >
                {client.status === 'Active' ? 'Confirm Deactivation' : 'Confirm Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DELETE CLIENT CONFIRMATION                              */}
      {/* ============================================================== */}
      {showDeleteClientModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 border-t-4 border-red-600 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif font-bold text-lg text-black">Remove Client Profile?</h3>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-950 space-y-3">
              <p>
                Are you sure you want to remove <strong className="text-black">{client.name}</strong> ({client.email}) from the firm's client directory?
              </p>
              
              <div className="pt-2 border-t border-red-200/80">
                <label className="flex items-start gap-2 cursor-pointer font-bold text-red-900">
                  <input
                    type="checkbox"
                    checked={deleteClientWithCases}
                    onChange={(e) => setDeleteClientWithCases(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>Also permanently delete all ({clientCases.length}) underlying case dockets associated with this client.</span>
                </label>
                <p className="text-[10px] text-gray-600 mt-1 pl-5">
                  (Leave unchecked to preserve case files in the firm repository for regulatory compliance).
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteClientModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClientSubmit}
                className="px-5 py-2 bg-red-600 hover:bg-black text-white text-xs font-bold uppercase"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DELETE CASE CONFIRMATION                                */}
      {/* ============================================================== */}
      {caseToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 border-t-4 border-red-600 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-serif font-bold text-lg text-black">Delete Case Docket?</h3>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              Are you sure you want to permanently delete case <strong className="font-mono text-black">{caseToDelete.caseNumber}</strong> ({caseToDelete.title})? This will permanently remove the matter, filings, and minutes from this client's portal.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCaseToDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDeleteCase(caseToDelete.id);
                  setCaseToDelete(null);
                  showToast(`Docket ${caseToDelete.caseNumber} deleted.`);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-black text-white text-xs font-bold uppercase"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagementWorkspace;
