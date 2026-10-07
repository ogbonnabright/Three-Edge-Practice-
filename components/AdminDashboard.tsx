import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Activity, 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Scale, 
  Building, 
  Mail, 
  Fingerprint, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ChevronRight,
  Database,
  UserPlus,
  Settings,
  Lock,
  Unlock,
  UserCheck,
  PlusCircle
} from 'lucide-react';
import { doc, setDoc, deleteDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { LegalCase, CaseUpdate, CaseDocument, CaseStatus, ClientProfile, ClientNotice, ClientStatus } from '../types';
import { DEMO_CLIENTS, INITIAL_FIRM_CASES } from '../src/data/firmMatters';
import ClientManagementWorkspace from './ClientManagementWorkspace';

interface AdminDashboardProps {
  cases: LegalCase[];
  casesLoading: boolean;
  currentUserUid: string;
  currentUserEmail: string | null;
  currentUserName: string | null;
  onOpenCaseModal: (legalCase: LegalCase) => void;
  onOpenDocModal: (doc: CaseDocument & { caseNumber: string; caseTitle: string; caseId: string }) => void;
  onSwitchToClientView?: (clientUid: string) => void;
}

type AdminTab = 'cases' | 'clients' | 'stream' | 'documents';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cases,
  casesLoading,
  currentUserUid,
  currentUserEmail,
  currentUserName,
  onOpenCaseModal,
  onOpenDocModal,
  onSwitchToClientView
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('cases');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('All');
  const [updateTypeFilter, setUpdateTypeFilter] = useState('All');

  // Modals & Individual Client Workspace
  const [selectedClientForWorkspace, setSelectedClientForWorkspace] = useState<ClientProfile | null>(null);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<'dockets' | 'updates' | 'documents' | 'notices' | 'profile'>('dockets');
  const [workspaceInitialOpenAddUpdate, setWorkspaceInitialOpenAddUpdate] = useState(false);
  const [showSelectClientForUpdateModal, setShowSelectClientForUpdateModal] = useState(false);
  const [clientSearchForUpdate, setClientSearchForUpdate] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [submittingClient, setSubmittingClient] = useState(false);

  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<LegalCase | null>(null);
  const [deletingCase, setDeletingCase] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Firestore Client Profiles State
  const [firestoreClients, setFirestoreClients] = useState<ClientProfile[]>([]);

  // Add Client Form State
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    organization: '',
    representative: '',
    phone: '',
    address: '',
    notes: '',
    createInitialDocket: true,
    initialDocketTitle: '',
    initialDocketNumber: '',
    practiceArea: 'Compliance and Advisory / Regulatory Advocacy'
  });

  // Subscribe to Firestore 'clients' collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'clients'),
      (snapshot) => {
        const loaded: ClientProfile[] = [];
        snapshot.forEach((snap) => {
          loaded.push({ id: snap.id, ...snap.data() } as ClientProfile);
        });
        if (loaded.length > 0) {
          setFirestoreClients(loaded);
        }
      },
      (err) => {
        console.warn('Clients listener note:', err);
      }
    );
    return () => unsub();
  }, []);

  // New Matter Form
  const [newMatterForm, setNewMatterForm] = useState({
    title: '',
    caseNumber: '',
    docketNumber: '',
    suitNumber: '',
    selectedClientOption: DEMO_CLIENTS[0].id || DEMO_CLIENTS[0].uid || '',
    customClientUid: '',
    clientName: DEMO_CLIENTS[0].name,
    clientEmail: DEMO_CLIENTS[0].email,
    practiceArea: 'Compliance and Advisory',
    regionalOffice: 'Abuja (Federal Capital Territory)',
    courtJurisdiction: 'Nigeria Data Protection Commission (NDPC) / CAC',
    judgeOrPanel: 'National Commissioner / Registrar-General',
    status: 'Regulatory Audit & Compliance Review' as CaseStatus,
    stage: 'Regulatory Compliance Audit & Impact Assessment',
    summary: '',
    initialUpdateTitle: 'Matter Formally Onboarded by Administrator',
    initialUpdateNotes: 'Retainer perfected; managing partner assigned to lead matter strategy and regulatory engagement.'
  });
  const [submittingMatter, setSubmittingMatter] = useState(false);

  // Aggregate Clients from Firestore, Cases & Predefined
  const firmClients = useMemo(() => {
    const clientMap = new Map<string, ClientProfile & { casesCount: number; activeCases: LegalCase[] }>();

    // 1. Add predefined clients first
    DEMO_CLIENTS.forEach(dc => {
      const cId = dc.id || dc.uid || dc.email;
      clientMap.set(cId, {
        ...dc,
        id: cId,
        uid: cId,
        casesCount: 0,
        activeCases: []
      });
    });

    // 2. Merge Firestore clients collection
    firestoreClients.forEach(fc => {
      const cId = fc.id || fc.uid || fc.email;
      const existing = clientMap.get(cId) || Array.from(clientMap.values()).find(
        c => c.email.toLowerCase() === fc.email.toLowerCase()
      );
      if (existing) {
        clientMap.set(existing.id, {
          ...existing,
          ...fc,
          id: existing.id,
          uid: existing.id
        });
      } else {
        clientMap.set(cId, {
          ...fc,
          id: cId,
          uid: cId,
          casesCount: 0,
          activeCases: []
        });
      }
    });

    // 3. Populate and link from actual Firestore cases
    cases.forEach(c => {
      const cUid = c.clientUid || c.clientEmail;
      const existing = clientMap.get(cUid) || Array.from(clientMap.values()).find(
        cl => cl.email.toLowerCase() === (c.clientEmail || '').toLowerCase()
      );
      if (existing) {
        existing.casesCount++;
        existing.activeCases.push(c);
        if (c.clientName) existing.name = c.clientName;
        if (c.clientEmail) existing.email = c.clientEmail;
        if (c.clientAccess === 'Deactivated' && existing.status === 'Active') {
          // Keep synced if deactivation applied to case
          existing.status = 'Deactivated';
        }
      } else {
        const newClient: ClientProfile & { casesCount: number; activeCases: LegalCase[] } = {
          id: c.clientUid || `client-${Date.now()}`,
          uid: c.clientUid || `client-${Date.now()}`,
          name: c.clientName || 'Institutional Client',
          email: c.clientEmail || 'client@firm.ng',
          organization: c.clientName || 'Corporate Client',
          representative: 'Authorized Representative',
          phone: '+234 800 000 0000',
          address: 'Federal Republic of Nigeria',
          status: (c.clientAccess === 'Deactivated' || c.clientAccess === 'Revoked') ? 'Deactivated' : 'Active',
          registeredAt: c.filingDate || '2026-01-01',
          casesCount: 1,
          activeCases: [c]
        };
        clientMap.set(newClient.id, newClient);
      }
    });

    return Array.from(clientMap.values());
  }, [cases, firestoreClients]);

  // Filtered clients for "ADD CASE UPDATE" client-selection modal
  const filteredClientsForUpdate = useMemo(() => {
    const q = clientSearchForUpdate.toLowerCase().trim();
    if (!q) return firmClients;
    return firmClients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.organization && c.organization.toLowerCase().includes(q))
    );
  }, [firmClients, clientSearchForUpdate]);

  // Aggregate All Proceedings across all cases
  const allProceedings = useMemo(() => {
    const list: (CaseUpdate & { caseId: string; caseNumber: string; caseTitle: string; clientName: string; clientUid: string })[] = [];
    cases.forEach(c => {
      c.recentUpdates?.forEach(u => {
        list.push({
          ...u,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          clientName: c.clientName,
          clientUid: c.clientUid
        });
      });
    });
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cases]);

  // Aggregate All Documents across all cases
  const allDocuments = useMemo(() => {
    const list: (CaseDocument & { caseId: string; caseNumber: string; caseTitle: string; clientName: string; clientUid: string })[] = [];
    cases.forEach(c => {
      c.documents?.forEach(d => {
        list.push({
          ...d,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          clientName: c.clientName,
          clientUid: c.clientUid
        });
      });
    });
    return list;
  }, [cases]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesClient = clientFilter === 'All' || c.clientUid === clientFilter;
      const matchesPractice = practiceAreaFilter === 'All' || c.practiceArea.toLowerCase().includes(practiceAreaFilter.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        (c.docketNumber && c.docketNumber.toLowerCase().includes(q)) ||
        (c.suitNumber && c.suitNumber.toLowerCase().includes(q)) ||
        (c.practiceArea && c.practiceArea.toLowerCase().includes(q)) ||
        c.clientName.toLowerCase().includes(q) ||
        c.clientUid.toLowerCase().includes(q) ||
        c.courtJurisdiction.toLowerCase().includes(q) ||
        c.leadAttorney.toLowerCase().includes(q);

      return matchesStatus && matchesClient && matchesPractice && matchesSearch;
    });
  }, [cases, statusFilter, clientFilter, practiceAreaFilter, searchQuery]);

  // Seed Initial Demo Dockets to Firestore
  const handleSeedInitialCases = async () => {
    setIsSeeding(true);
    try {
      for (const initialCase of INITIAL_FIRM_CASES) {
        await setDoc(doc(db, 'cases', initialCase.id), initialCase);
      }
      setAdminToast('Initialized firm dockets across all practice areas in Firestore.');
      setTimeout(() => setAdminToast(null), 4500);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'cases');
    } finally {
      setIsSeeding(false);
    }
  };

  // Onboard New Case / Brief Handler
  const handleOnboardCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterForm.title.trim()) return;

    setSubmittingMatter(true);
    try {
      const clientEmailClean = (newMatterForm.clientEmail.trim() || 'legal@clientcorp.ng').toLowerCase();
      const assignedUid = newMatterForm.selectedClientOption === 'custom' 
        ? (newMatterForm.customClientUid.trim() || `client-${Date.now()}`)
        : newMatterForm.selectedClientOption;

      const caseId = `case-${Date.now()}`;
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const prefix = newMatterForm.practiceArea.toLowerCase().includes('tax') ? 'TEP/TAX/2026' :
                     newMatterForm.practiceArea.toLowerCase().includes('compliance') ? 'TEP/NDPC/2026' :
                     newMatterForm.practiceArea.toLowerCase().includes('corporate') ? 'TEP/CORP/2026' :
                     newMatterForm.practiceArea.toLowerCase().includes('criminal') ? 'TEP/DEF/2026' :
                     newMatterForm.practiceArea.toLowerCase().includes('energy') ? 'TEP/ENR/2026' : 'TEP/MAT/2026';
      const docketNumber = newMatterForm.docketNumber.trim() || newMatterForm.caseNumber.trim() || `${prefix}/${randomSeq}`;
      const suitNumber = newMatterForm.suitNumber.trim() || undefined;

      const isDispute = newMatterForm.practiceArea.toLowerCase().includes('dispute') || newMatterForm.practiceArea.toLowerCase().includes('litigation');
      const isCompliance = newMatterForm.practiceArea.toLowerCase().includes('compliance');
      const isCorporate = newMatterForm.practiceArea.toLowerCase().includes('corporate') && !newMatterForm.practiceArea.toLowerCase().includes('criminal');

      const initialDocCategory = isDispute ? 'Originating Summons' :
                                 isCompliance ? 'Data Protection (NDPA) Framework' :
                                 isCorporate ? 'Commercial Contract / Transaction Draft' :
                                 'Legal Opinion / Advisory Memo';
      const initialDocTitle = isDispute ? `Originating Process - ${newMatterForm.title.slice(0, 35)}...` :
                             isCompliance ? `Statutory Compliance Audit Scope - ${newMatterForm.title.slice(0, 30)}...` :
                             isCorporate ? `Transaction Structuring Agreement - ${newMatterForm.title.slice(0, 30)}...` :
                             `Advisory Memorandum & Scope - ${newMatterForm.title.slice(0, 30)}...`;

      const initialUpdateType = isDispute ? 'Filing' :
                               isCompliance ? 'Regulatory Development' :
                               isCorporate ? 'Legal Milestone' : 'Internal Review';

      const newCase: LegalCase = {
        id: caseId,
        caseNumber: docketNumber,
        docketNumber,
        suitNumber,
        title: newMatterForm.title.trim(),
        clientUid: assignedUid,
        clientName: newMatterForm.clientName.trim() || 'Institutional Client',
        clientEmail: clientEmailClean,
        practiceArea: newMatterForm.practiceArea,
        leadAttorney: "Al'Qasim Jafar (Managing Partner)",
        leadAttorneyEmail: 'a.jafar@tep.com.ng',
        regionalOffice: newMatterForm.regionalOffice,
        status: newMatterForm.status,
        stage: newMatterForm.stage,
        filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        courtJurisdiction: newMatterForm.courtJurisdiction.trim(),
        judgeOrPanel: newMatterForm.judgeOrPanel.trim(),
        summary: newMatterForm.summary.trim() || 'Matter instituted for administrative compliance and client representation.',
        recentUpdates: [
          {
            id: `upd-${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            title: newMatterForm.initialUpdateTitle.trim() || 'Matter Formally Onboarded by Administrator',
            notes: newMatterForm.initialUpdateNotes.trim() || `Docket created and verified by Three Edge Practice registry for client email ${clientEmailClean}.`,
            author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
            type: initialUpdateType
          }
        ],
        documents: [
          {
            id: `doc-${Date.now()}`,
            title: initialDocTitle,
            category: initialDocCategory,
            filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            fileSize: '2.4 MB',
            status: isDispute ? 'Filed' : 'Drafting'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'cases', caseId), newCase);

      // Record client profile in /users collection
      try {
        await setDoc(doc(db, 'users', assignedUid), {
          id: assignedUid,
          email: clientEmailClean,
          displayName: newMatterForm.clientName.trim() || 'Institutional Client',
          role: 'Client',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('User record note:', err);
      }

      setShowOnboardModal(false);
      setAdminToast(`Successfully onboarded docket ${docketNumber} for client email: ${clientEmailClean}. Users logging in with this email will route directly to this matter.`);
      setTimeout(() => setAdminToast(null), 6000);

      // Reset form
      setNewMatterForm(prev => ({
        ...prev,
        title: '',
        caseNumber: '',
        docketNumber: '',
        suitNumber: '',
        summary: ''
      }));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'cases');
    } finally {
      setSubmittingMatter(false);
    }
  };

  // Delete Case Handler (Admin Only)
  const handleDeleteCase = async () => {
    if (!caseToDelete) return;
    setDeletingCase(true);
    try {
      const caseId = caseToDelete.id;
      const caseNum = caseToDelete.caseNumber;
      await deleteDoc(doc(db, 'cases', caseId));
      setCaseToDelete(null);
      setAdminToast(`Case ${caseNum} permanently deleted by Administrator.`);
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `cases/${caseToDelete.id}`);
    } finally {
      setDeletingCase(false);
    }
  };

  // -------------------------------------------------------------------------
  // CLIENT MANAGEMENT WORKSPACE HANDLERS (ADMIN AUTHORITY ONLY)
  // -------------------------------------------------------------------------

  // Register New Client Profile to Firestore
  const handleCreateNewClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newClientForm.email.toLowerCase().trim();
    if (!cleanEmail || !newClientForm.name.trim()) return;

    setSubmittingClient(true);
    try {
      const clientId = `client-${Date.now()}`;
      const newProfile: ClientProfile = {
        id: clientId,
        uid: clientId,
        name: newClientForm.name.trim(),
        email: cleanEmail,
        organization: newClientForm.organization.trim() || newClientForm.name.trim(),
        representative: newClientForm.representative.trim() || 'Managing Counsel / Rep',
        phone: newClientForm.phone.trim() || '+234 (0) 900 000 0000',
        address: newClientForm.address.trim() || 'Federal Republic of Nigeria',
        status: 'Active',
        registeredAt: new Date().toISOString().split('T')[0],
        notes: newClientForm.notes.trim()
      };

      // Save client profile to Firestore 'clients' collection
      await setDoc(doc(db, 'clients', clientId), newProfile);

      // If initial docket requested, create it and link to this client
      if (newClientForm.createInitialDocket) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const caseNumber = newClientForm.initialDocketNumber.trim() || `TEP-FCT-2026-${randomNum}`;
        const initialCase: LegalCase = {
          id: `case-${Date.now()}`,
          caseNumber,
          title: newClientForm.initialDocketTitle.trim() || `${newClientForm.name} Retainer Representation & Regulatory Compliance`,
          clientUid: clientId,
          clientName: newClientForm.name.trim(),
          clientEmail: cleanEmail,
          practiceArea: newClientForm.practiceArea,
          leadAttorney: "Al'Qasim Jafar (Managing Partner)",
          leadAttorneyEmail: 'a.jafar@tep.com.ng',
          regionalOffice: 'Abuja (Federal Capital Territory)',
          status: 'Pre-Trial Discovery',
          stage: 'Intake Assessment & Preliminary Pleadings',
          filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
          nextHearingDate: 'NOV 20, 2026 at 09:30 AM',
          courtJurisdiction: 'Federal High Court, Abuja Judicial Division',
          judgeOrPanel: 'Hon. Justice Presiding',
          summary: `Official legal matter onboarded for ${newClientForm.name}. Counsel designated to conduct litigation and regulatory compliance strategy.`,
          recentUpdates: [
            {
              id: `upd-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
              title: 'Client Profile Created & Retainer Registered',
              notes: `Formal client profile registered by administrator for ${cleanEmail}. Docket initialized in firm registry.`,
              author: currentUserName || "Al'Qasim Jafar (Managing Partner)",
              type: 'Filing'
            }
          ],
          documents: [
            {
              id: `doc-${Date.now()}`,
              title: 'Originating Legal Summons & Retainer Agreement',
              category: 'Originating Summons',
              filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
              fileSize: '1.9 MB',
              status: 'Filed'
            }
          ],
          clientAccess: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'cases', initialCase.id), initialCase);
      }

      setShowAddClientModal(false);
      setAdminToast(`Successfully registered client ${newClientForm.name} (${cleanEmail}). The client can now log in using that registered email and see only their assigned information.`);
      setTimeout(() => setAdminToast(null), 6000);

      // Reset
      setNewClientForm({
        name: '',
        email: '',
        organization: '',
        representative: '',
        phone: '',
        address: '',
        notes: '',
        createInitialDocket: true,
        initialDocketTitle: '',
        initialDocketNumber: '',
        practiceArea: 'Compliance and Advisory / Regulatory Advocacy'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'clients');
    } finally {
      setSubmittingClient(false);
    }
  };

  // Toggle Client Status (Active <-> Deactivated)
  const handleToggleClientStatus = async (clientId: string, newStatus: 'Active' | 'Deactivated') => {
    try {
      // 1. Update status in Firestore clients collection
      await setDoc(doc(db, 'clients', clientId), { status: newStatus }, { merge: true });

      // 2. Find target client to get their email
      const targetClient = firmClients.find(c => c.id === clientId || c.uid === clientId);
      const targetEmail = targetClient?.email?.toLowerCase().trim();

      // 3. Update all cases for this client with new clientAccess status
      const associatedCases = cases.filter(c => 
        c.clientUid === clientId || 
        (targetEmail && c.clientEmail?.toLowerCase().trim() === targetEmail)
      );

      for (const c of associatedCases) {
        await updateDoc(doc(db, 'cases', c.id), {
          clientAccess: newStatus,
          updatedAt: new Date().toISOString()
        });
      }

      if (selectedClientForWorkspace && (selectedClientForWorkspace.id === clientId || selectedClientForWorkspace.uid === clientId)) {
        setSelectedClientForWorkspace(prev => prev ? { ...prev, status: newStatus } : null);
      }

      setAdminToast(
        newStatus === 'Deactivated'
          ? `Client deactivated. Portal access immediately revoked for ${targetClient?.email || clientId}. Data retained securely in firm registry.`
          : `Client reactivated. Portal access restored for ${targetClient?.email || clientId}.`
      );
      setTimeout(() => setAdminToast(null), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `clients/${clientId}`);
    }
  };

  // Delete Client Profile (with explicit choice to retain or delete cases)
  const handleDeleteClientProfile = async (clientId: string, deleteCases: boolean) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));

      if (deleteCases) {
        const targetClient = firmClients.find(c => c.id === clientId || c.uid === clientId);
        const targetEmail = targetClient?.email?.toLowerCase().trim();
        const associatedCases = cases.filter(c => 
          c.clientUid === clientId || 
          (targetEmail && c.clientEmail?.toLowerCase().trim() === targetEmail)
        );
        for (const c of associatedCases) {
          await deleteDoc(doc(db, 'cases', c.id));
        }
      }

      setSelectedClientForWorkspace(null);
      setAdminToast(`Client profile removed from firm registry.${deleteCases ? ' Underlying cases deleted.' : ' Underlying cases retained in archive.'}`);
      setTimeout(() => setAdminToast(null), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `clients/${clientId}`);
    }
  };

  // Save Case from Workspace
  const handleSaveCaseFromWorkspace = async (legalCase: LegalCase) => {
    try {
      await setDoc(doc(db, 'cases', legalCase.id), legalCase, { merge: true });
      setAdminToast(`Docket ${legalCase.caseNumber} saved successfully in Firestore.`);
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${legalCase.id}`);
    }
  };

  // Add Update to Case
  const handleAddUpdateToCase = async (caseId: string, update: CaseUpdate) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.recentUpdates || [];
      const updateData: Record<string, unknown> = {
        recentUpdates: [update, ...existing],
        updatedAt: new Date().toISOString()
      };
      if (update.caseStatus) {
        updateData.status = update.caseStatus;
      }
      if (update.nextActionDate && update.type === 'Court Hearing') {
        updateData.nextHearingDate = update.nextActionDate;
      }
      await updateDoc(doc(db, 'cases', caseId), updateData);
      setAdminToast(
        update.visibility === 'Client Visible'
          ? `Case update logged & synced to ${target?.clientName || 'client'}'s dashboard (${target?.caseNumber}).`
          : `Internal confidential case update saved for ${target?.caseNumber || 'matter'}.`
      );
      setTimeout(() => setAdminToast(null), 4500);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Edit Update in Case
  const handleEditUpdate = async (caseId: string, update: CaseUpdate) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.recentUpdates || [];
      const updated = existing.map(u => u.id === update.id ? update : u);
      const updateData: Record<string, unknown> = {
        recentUpdates: updated,
        updatedAt: new Date().toISOString()
      };
      if (update.caseStatus) {
        updateData.status = update.caseStatus;
      }
      if (update.nextActionDate && update.type === 'Court Hearing') {
        updateData.nextHearingDate = update.nextActionDate;
      }
      await updateDoc(doc(db, 'cases', caseId), updateData);
      setAdminToast(`Case update modified for ${target?.caseNumber || 'matter'}.`);
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Delete Update from Case
  const handleDeleteUpdate = async (caseId: string, updateId: string) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.recentUpdates || [];
      const filtered = existing.filter(u => u.id !== updateId);
      await updateDoc(doc(db, 'cases', caseId), {
        recentUpdates: filtered,
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Proceedings minute removed.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Add Document to Case
  const handleAddDocumentToCase = async (caseId: string, docItem: CaseDocument) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.documents || [];
      await updateDoc(doc(db, 'cases', caseId), {
        documents: [docItem, ...existing],
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Court document added to client dossier.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Edit Document in Case
  const handleEditDocument = async (caseId: string, docItem: CaseDocument) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.documents || [];
      const updated = existing.map(d => d.id === docItem.id ? docItem : d);
      await updateDoc(doc(db, 'cases', caseId), {
        documents: updated,
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Court document record updated.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Delete Document from Case
  const handleDeleteDocument = async (caseId: string, docId: string) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.documents || [];
      const filtered = existing.filter(d => d.id !== docId);
      await updateDoc(doc(db, 'cases', caseId), {
        documents: filtered,
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Court document removed from dossier.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Add Notice to Case
  const handleAddNoticeToCase = async (caseId: string, notice: ClientNotice) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.clientNotices || [];
      await updateDoc(doc(db, 'cases', caseId), {
        clientNotices: [notice, ...existing],
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Client notice published to client dashboard.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Delete Notice from Case
  const handleDeleteNotice = async (caseId: string, noticeId: string) => {
    try {
      const target = cases.find(c => c.id === caseId);
      const existing = target?.clientNotices || [];
      const filtered = existing.filter(n => n.id !== noticeId);
      await updateDoc(doc(db, 'cases', caseId), {
        clientNotices: filtered,
        updatedAt: new Date().toISOString()
      });
      setAdminToast('Client notice removed.');
      setTimeout(() => setAdminToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // If a client is selected for individual management, render dedicated ClientManagementWorkspace!
  if (selectedClientForWorkspace) {
    const clientCasesForWorkspace = cases.filter(c => 
      c.clientUid === selectedClientForWorkspace.id ||
      c.clientUid === selectedClientForWorkspace.uid ||
      (c.clientEmail && c.clientEmail.toLowerCase().trim() === selectedClientForWorkspace.email.toLowerCase().trim())
    );

    return (
      <ClientManagementWorkspace
        client={selectedClientForWorkspace}
        clientCases={clientCasesForWorkspace}
        initialTab={workspaceInitialTab}
        initialOpenAddUpdate={workspaceInitialOpenAddUpdate}
        onBack={() => {
          setSelectedClientForWorkspace(null);
          setWorkspaceInitialOpenAddUpdate(false);
          setWorkspaceInitialTab('dockets');
        }}
        onUpdateClient={async (updated) => {
          await setDoc(doc(db, 'clients', updated.id), updated, { merge: true });
          setSelectedClientForWorkspace(updated);
        }}
        onToggleClientStatus={handleToggleClientStatus}
        onDeleteClient={handleDeleteClientProfile}
        onSaveCase={handleSaveCaseFromWorkspace}
        onDeleteCase={async (cId) => {
          await deleteDoc(doc(db, 'cases', cId));
        }}
        onAddUpdateToCase={handleAddUpdateToCase}
        onEditUpdate={handleEditUpdate}
        onDeleteUpdate={handleDeleteUpdate}
        onAddDocumentToCase={handleAddDocumentToCase}
        onEditDocument={handleEditDocument}
        onDeleteDocument={handleDeleteDocument}
        onAddNoticeToCase={handleAddNoticeToCase}
        onDeleteNotice={handleDeleteNotice}
        onSwitchToClientView={(email) => {
          if (onSwitchToClientView) {
            onSwitchToClientView(email);
          }
        }}
        currentUserName={currentUserName}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Privilege Notification Banner */}
      <div className="bg-[#0f1115] text-white p-5 border-l-4 border-l-[#990000] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#990000]/20 text-[#ff6666] flex items-center justify-center border border-[#990000]/40">
            <ShieldCheck className="w-5 h-5 text-[#990000]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">Admin Dashboard &bull; Firmwide Legal Matters</span>
              <span className="px-2 py-0.5 bg-[#990000] text-white text-[9px] font-mono uppercase font-bold tracking-widest">
                Full RBAC Access
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Authenticated Administrator: <span className="text-gray-200 font-mono">{currentUserEmail || currentUserUid}</span> &bull; Authorized to onboard, reassign, or delete client briefs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setClientSearchForUpdate('');
              setShowSelectClientForUpdateModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            title="Record a significant case development for a registered client"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ADD CASE UPDATE</span>
          </button>

          <button
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Case / Brief</span>
          </button>
        </div>
      </div>

      {/* Admin Action Toast */}
      {adminToast && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{adminToast}</span>
          </div>
          <button onClick={() => setAdminToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-[#990000]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Firm Dockets</p>
            <Briefcase className="w-4 h-4 text-[#990000]" />
          </div>
          <p className="text-3xl font-serif font-bold text-black">{cases.length}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Across all clients & divisions</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Firm Clients</p>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-black">{firmClients.length}</p>
          <p className="text-[11px] text-indigo-700 font-semibold mt-1">Registered Client Firebase UIDs</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Firmwide Updates</p>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-black">{allProceedings.length}</p>
          <p className="text-[11px] text-blue-700 font-semibold mt-1">Recorded court proceedings</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Documents</p>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-black">{allDocuments.length}</p>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">Filed & Certified Court Processes</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white border border-gray-200 px-6 py-2 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'cases'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>All Firm Cases ({cases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'clients'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Firm Clients Directory ({firmClients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'stream'
                ? 'border-[#990000] text-[#990000] bg-gray-50'
                : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Matters & Practice Stream</span>
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
            <span>All Documents ({allDocuments.length})</span>
          </button>
        </div>

        {/* Quick Database Seeder if empty or needed */}
        {cases.length === 0 && (
          <button
            onClick={handleSeedInitialCases}
            disabled={isSeeding}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSeeding ? 'Seeding...' : 'Initialize Firm Demo Dockets'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: All Firm Cases Table & Management */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search case, suit number, client, attorney..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500 font-bold uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#990000]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active Trial">Active Trial</option>
                  <option value="Pre-Trial Discovery">Pre-Trial Discovery</option>
                  <option value="Settlement Discussions">Settlement Discussions</option>
                  <option value="Regulatory Review">Regulatory Review</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold uppercase">Client:</span>
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="border border-gray-300 px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-[#990000] max-w-[180px] truncate"
                >
                  <option value="All">All Clients</option>
                  {firmClients.map(cl => (
                    <option key={cl.uid} value={cl.uid}>
                      {cl.name} ({cl.uid.slice(0, 14)}...)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cases Table */}
          {casesLoading ? (
            <div className="p-16 bg-white border border-gray-200 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#990000] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">Loading Firm Legal Dockets...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="bg-white border border-gray-200 p-12 text-center space-y-4">
              <Scale className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-black">No Legal Dockets Match Criteria</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                No cases match the selected filters or search query. Click Onboard Case below to add a new matter.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setShowOnboardModal(true)}
                  className="px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black"
                >
                  Onboard First Matter
                </button>
                <button
                  onClick={handleSeedInitialCases}
                  className="px-4 py-2 bg-gray-100 text-black border border-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
                >
                  Load Sample Cases
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f1115] text-white text-[11px] uppercase tracking-wider font-mono">
                    <tr>
                      <th className="py-3 px-4">Suit & Docket</th>
                      <th className="py-3 px-4">Title of Matter</th>
                      <th className="py-3 px-4">Client Assignment (Firebase UID)</th>
                      <th className="py-3 px-4">Status & Stage</th>
                      <th className="py-3 px-4">Lead Attorney</th>
                      <th className="py-3 px-4 text-right">Actions (Admin Only)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                          {c.caseNumber}
                          <span className="block text-[10px] text-gray-400 font-sans font-normal mt-0.5">
                            Filed: {c.filingDate}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-bold text-black line-clamp-2">{c.title}</p>
                          <span className="inline-block text-[10px] text-gray-500 mt-1">
                            {c.courtJurisdiction}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-black flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            <span>{c.clientName}</span>
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 border border-gray-200 max-w-[190px] truncate" title={c.clientUid}>
                              UID: {c.clientUid}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'Active Trial' ? 'bg-[#990000] text-white' :
                            c.status === 'Pre-Trial Discovery' ? 'bg-amber-600 text-white' :
                            c.status === 'Settlement Discussions' ? 'bg-emerald-700 text-white' : 'bg-gray-800 text-white'
                          }`}>
                            {c.status}
                          </span>
                          <span className="block text-[10px] text-gray-500 mt-1 line-clamp-1">
                            {c.stage}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                          {c.leadAttorney}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => onOpenCaseModal(c)}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-black text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            title="Inspect complete docket dossier"
                          >
                            <Eye className="w-3 h-3 inline mr-1" />
                            <span>Dossier</span>
                          </button>

                          <button
                            onClick={() => setCaseToDelete(c)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-[#990000] text-red-700 hover:text-white border border-red-200 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            title="Admin Only: Delete case from firm records"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Firm Clients Directory & Management */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-[#990000]" />
                <h3 className="text-xl font-serif font-bold text-black">Institutional Clients Directory & Access Management</h3>
              </div>
              <p className="text-xs text-gray-500">
                Authorized Admin Control: Add new clients, deactivate client access, and manage individual client dockets and dashboards.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAddClientModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Client Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowOnboardModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard Case Docket</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {firmClients.map(client => {
              const isDeactivated = client.status === 'Deactivated';
              return (
                <div 
                  key={client.id || client.uid} 
                  className={`bg-white border p-6 shadow-xs transition-all space-y-4 ${
                    isDeactivated 
                      ? 'border-red-300 bg-red-50/20' 
                      : 'border-gray-200 hover:border-[#990000]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 border flex items-center justify-center font-bold font-serif text-lg ${
                        isDeactivated
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-gray-100 text-black border-gray-300'
                      }`}>
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-black flex items-center gap-2">
                          <span>{client.name}</span>
                        </h4>
                        <p className="text-xs text-gray-500 font-light">{client.organization}</p>
                      </div>
                    </div>
                    <div>
                      {isDeactivated ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider border border-red-300 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-red-600" />
                          <span>Deactivated</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Active Client</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-[11px]">Client Registered Email:</span>
                      <span className="font-mono font-bold text-black bg-gray-50 px-2 py-0.5 border border-gray-200 text-[11px] select-all">
                        {client.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Representative:</span>
                      <span className="font-medium text-gray-800">{client.representative || 'Authorized Counsel'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Assigned Legal Matters:</span>
                      <span className="font-bold text-[#990000]">{client.casesCount} Active Matters</span>
                    </div>
                  </div>

                  {/* Assigned Cases List */}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Linked Dockets:</p>
                    {client.activeCases.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No dockets assigned yet. Click "Onboard Docket" below.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {client.activeCases.map(c => (
                          <div key={c.id} className="p-2 bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-mono font-bold text-black">{c.caseNumber}</span>
                              <span className="text-gray-500 text-[11px] block line-clamp-1">{c.title}</span>
                            </div>
                            <button
                              onClick={() => onOpenCaseModal(c)}
                              className="text-[#990000] hover:underline font-bold text-[10px] uppercase cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Main Action Bar for Individual Client */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Primary Button: Open Dedicated Client Management Page */}
                    <button
                      onClick={() => setSelectedClientForWorkspace(client)}
                      className="px-3.5 py-1.5 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Open dedicated management page to add, edit, or delete items on this client's dashboard"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Manage Client Page</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Toggle Deactivate / Reactivate Status */}
                      <button
                        onClick={() => handleToggleClientStatus(client.id, isDeactivated ? 'Active' : 'Deactivated')}
                        className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1 transition-colors cursor-pointer ${
                          isDeactivated
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                        }`}
                        title={isDeactivated ? 'Reactivate portal access for this client' : 'Deactivate this client immediately to prevent portal access while retaining records'}
                      >
                        {isDeactivated ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{isDeactivated ? 'Reactivate' : 'Deactivate'}</span>
                      </button>

                      {/* Onboard Docket Button */}
                      <button
                        onClick={() => {
                          setNewMatterForm(prev => ({
                            ...prev,
                            selectedClientOption: client.id,
                            clientName: client.name,
                            clientEmail: client.email
                          }));
                          setShowOnboardModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
                        title="Onboard matter for this client"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Docket</span>
                      </button>

                      {/* Preview Button */}
                      {onSwitchToClientView && (
                        <button
                          onClick={() => onSwitchToClientView(client.email || client.id)}
                          className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Preview Client Dashboard exactly as seen by this client"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Live Firmwide Litigation Stream */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <h3 className="text-xl font-serif font-bold text-black">Firmwide Real-Time Matters & Practice Stream</h3>
              </div>
              <p className="text-xs text-gray-500">
                Live stream aggregating all filings, regulatory audits, transaction milestones, and court proceedings across every firm matter.
              </p>
            </div>

            <button
              onClick={() => {
                setClientSearchForUpdate('');
                setShowSelectClientForUpdateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer self-start shadow-sm"
              title="Record a significant case development for a registered client"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>ADD CASE UPDATE</span>
            </button>
          </div>

          <div className="space-y-4">
            {allProceedings.map(proc => (
              <div key={proc.id} className="bg-white border border-gray-200 p-5 shadow-xs hover:border-gray-400 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      proc.type === 'Court Hearing' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      proc.type === 'Filing' ? 'bg-red-100 text-[#990000] border border-red-300' :
                      proc.type === 'Settlement Meeting' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {proc.type || 'Filing'}
                    </span>
                    <span className="font-mono text-xs font-bold text-black">{proc.caseNumber}</span>
                    <span className="text-xs text-gray-400">&bull;</span>
                    <span className="text-xs text-gray-500 truncate max-w-xs">{proc.clientName}</span>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{proc.date}</span>
                </div>

                <h4 className="text-sm font-bold text-black mb-1.5">{proc.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light mb-3">{proc.notes}</p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
                  <span>Author / Counsel: <strong className="text-gray-700">{proc.author}</strong></span>
                  <span className="font-mono">Client UID: {proc.clientUid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Master Documents Vault */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-black">Master Document Vault</h3>
              <p className="text-xs text-gray-500 mt-1">
                Complete audit trail of filed court processes, certified true copies, and draft instruments.
              </p>
            </div>
            <div className="text-xs text-gray-600">
              Total Recorded Documents: <strong>{allDocuments.length}</strong>
            </div>
          </div>

          <div className="bg-white border border-gray-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f1115] text-white text-[11px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Docket & Client</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Filing Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allDocuments.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-black max-w-xs">
                      {d.title}
                      <span className="block text-[10px] text-gray-400 font-normal">{d.fileSize}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-black">{d.caseNumber}</span>
                      <span className="block text-[10px] text-gray-500">{d.clientName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{d.category}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">{d.filingDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        d.status === 'Certified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        d.status === 'Filed' ? 'bg-red-50 text-[#990000] border-red-200' :
                        d.status === 'Served' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenDocModal(d)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-black hover:text-white text-black text-[11px] font-bold uppercase transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard New Case Modal (ADMIN ONLY) */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-t-4 border-t-[#990000] w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowOnboardModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#990000] text-xs font-bold uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Matter Intake</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-black mb-1">Onboard New Legal Case / Brief</h3>
            <p className="text-xs text-gray-500 mb-6">
              Only authorized firm administrators can register new dockets in Firestore and link them to a client Firebase UID.
            </p>

            <form onSubmit={handleOnboardCase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Matter Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Telecom Ltd v. Regulatory Agency (5G Spectrum Appeal)"
                  value={newMatterForm.title}
                  onChange={(e) => setNewMatterForm({ ...newMatterForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Suit / Case Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TEP-ABJ-2026-9402"
                    value={newMatterForm.caseNumber}
                    onChange={(e) => setNewMatterForm({ ...newMatterForm, caseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                  <span className="text-[10px] text-gray-400">Leave blank to auto-generate</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Assign to Client / Select Entity *
                  </label>
                  <select
                    value={newMatterForm.selectedClientOption}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = DEMO_CLIENTS.find(dc => dc.uid === val);
                      if (matched) {
                        setNewMatterForm({
                          ...newMatterForm,
                          selectedClientOption: val,
                          clientName: matched.name,
                          clientEmail: matched.email
                        });
                      } else {
                        setNewMatterForm({
                          ...newMatterForm,
                          selectedClientOption: 'custom',
                          clientName: '',
                          clientEmail: ''
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                  >
                    {DEMO_CLIENTS.map(dc => (
                      <option key={dc.uid} value={dc.uid}>
                        {dc.name} ({dc.email})
                      </option>
                    ))}
                    <option value="custom">+ Register New Client Email & Entity</option>
                  </select>
                </div>
              </div>

              {/* Client Email & Identity Form (Primary Routing Key) */}
              <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#990000] tracking-wider flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Client Routing Email (Primary Auth Identifier)</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Routes to Client Dashboard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Client Registered Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. legal@clientcorp.ng"
                      value={newMatterForm.clientEmail}
                      onChange={(e) => setNewMatterForm({ ...newMatterForm, clientEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-xs font-mono bg-white focus:outline-none focus:border-[#990000]"
                    />
                    <span className="text-[10px] text-gray-400">Users logging in with this email will route directly to this case.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Client Entity / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Atlantic Deepwater Corp"
                      value={newMatterForm.clientName}
                      onChange={(e) => setNewMatterForm({ ...newMatterForm, clientName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                {newMatterForm.selectedClientOption === 'custom' && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Custom Client Firebase UID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated if left blank (e.g. client-alpha-2026)"
                      value={newMatterForm.customClientUid}
                      onChange={(e) => setNewMatterForm({ ...newMatterForm, customClientUid: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 text-xs font-mono bg-white focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Firm Practice Group / Practice Area *
                  </label>
                  <select
                    value={newMatterForm.practiceArea}
                    onChange={(e) => {
                      const pa = e.target.value;
                      let defaultForum = 'Nigeria Data Protection Commission (NDPC) / CAC';
                      let defaultPresiding = 'National Commissioner / Registrar-General';
                      let defaultStage = 'Regulatory Compliance Audit & Impact Assessment';
                      let defaultStatus: CaseStatus = 'Regulatory Audit & Compliance Review';
                      if (pa.includes('Corporate')) {
                        defaultForum = 'Corporate Affairs Commission (CAC) / SEC';
                        defaultPresiding = 'Registrar-General / Transaction Directorate';
                        defaultStage = 'Contract Drafting, Due Diligence & Negotiation';
                        defaultStatus = 'Transactional Drafting & Negotiation';
                      } else if (pa.includes('Criminal') || pa.includes('Defense')) {
                        defaultForum = 'EFCC Legal & Prosecution Directorate / Special Operations';
                        defaultPresiding = 'Director of Legal & Prosecution';
                        defaultStage = 'Pre-Charge Investigation, Document Production & Defense';
                        defaultStatus = 'Pre-Charge Investigation & Defense';
                      } else if (pa.includes('Tax')) {
                        defaultForum = 'Federal Inland Revenue Service (FIRS) - Large Tax Office';
                        defaultPresiding = 'Director of Corporate Tax Audit';
                        defaultStage = 'Tax Assessment Reconciliation & Advance Ruling Advisory';
                        defaultStatus = 'Active Advisory / Retainer';
                      } else if (pa.includes('Energy')) {
                        defaultForum = 'NUPRC / Federal High Court (Admiralty Jurisdiction)';
                        defaultPresiding = 'Commission Chief Executive / Admiralty Judge';
                        defaultStage = 'Concession Review & Statutory Compliance';
                        defaultStatus = 'Active Advisory / Retainer';
                      } else if (pa.includes('Dispute')) {
                        defaultForum = 'Federal High Court, Abuja Judicial Division';
                        defaultPresiding = 'Hon. Justice Presiding';
                        defaultStage = 'Pleadings Exchange & Substantive Hearing';
                        defaultStatus = 'Active Trial';
                      }
                      setNewMatterForm({
                        ...newMatterForm,
                        practiceArea: pa,
                        courtJurisdiction: defaultForum,
                        judgeOrPanel: defaultPresiding,
                        stage: defaultStage,
                        status: defaultStatus
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Compliance and Advisory">Compliance & Regulatory Advisory (NDPA, AML/CFT, IDEC)</option>
                    <option value="General Corporate/Commercial Legal Support">General Corporate / Commercial Legal Support & M&A</option>
                    <option value="Corporate Criminal Defense">Corporate Criminal Defense & White-Collar Practice</option>
                    <option value="Tax Advisory & Fiscal Structuring">Tax Advisory & Fiscal Optimization</option>
                    <option value="Energy, Maritime & Natural Resources">Energy, Maritime & Natural Resources (PIA 2021)</option>
                    <option value="IT Law, Tech Regulatory & Data Protection">IT Law, Tech Regulatory, Fintech & IP</option>
                    <option value="Government Relations, Public Policy & ESG">Government Relations, Public Policy & ESG</option>
                    <option value="Dispute Resolution & Commercial Advocacy">Dispute Resolution & Commercial Advocacy / Arbitration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Regional Office
                  </label>
                  <select
                    value={newMatterForm.regionalOffice}
                    onChange={(e) => setNewMatterForm({ ...newMatterForm, regionalOffice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Abuja (Federal Capital Territory)">Abuja Head Office</option>
                    <option value="Port Harcourt (Rivers State)">Port Harcourt Office</option>
                    <option value="Lagos (Commercial Hub)">Lagos Office</option>
                    <option value="Kano (Northern Regional Hub)">Kano Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Forum / Regulatory Authority / Court / Venue *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CAC / NDPC / FIRS / EFCC / Federal High Court"
                    value={newMatterForm.courtJurisdiction}
                    onChange={(e) => setNewMatterForm({ ...newMatterForm, courtJurisdiction: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Presiding Authority / Lead Regulator / Panel / Judge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. National Commissioner / Registrar-General / Hon. Justice"
                    value={newMatterForm.judgeOrPanel}
                    onChange={(e) => setNewMatterForm({ ...newMatterForm, judgeOrPanel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Case Summary & Legal Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Concise brief of issues for determination and expected legal remedies..."
                  value={newMatterForm.summary}
                  onChange={(e) => setNewMatterForm({ ...newMatterForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMatter}
                  className="px-6 py-2.5 bg-[#990000] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                  {submittingMatter ? 'Onboarding to Firestore...' : 'Onboard Case (Save to Firestore)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Client Profile Modal (ADMIN EXCLUSIVE) */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-t-4 border-t-[#990000] w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddClientModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#990000] text-xs font-bold uppercase tracking-widest mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Admin Registry Intake</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-black mb-1">Register New Client Profile</h3>
            <p className="text-xs text-gray-500 mb-6">
              Exclusive Admin Function: Register a new client profile, record their email address, and link them to their case docket. The client will subsequently be able to log in using that registered email and see only the information assigned to them.
            </p>

            <form onSubmit={handleCreateNewClient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Client Name / Entity *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Energy Resources Plc"
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Registered Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. legal@nexusenergy.ng"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#990000]"
                  />
                  <span className="text-[10px] text-gray-400">Primary auth identifier for client portal sign-in.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Organization / Holding Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Holdings International"
                    value={newClientForm.organization}
                    onChange={(e) => setNewClientForm({ ...newClientForm, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Contact Representative / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engr. Kunle Adeleke (Chief Operating Officer)"
                    value={newClientForm.representative}
                    onChange={(e) => setNewClientForm({ ...newClientForm, representative: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Telephone / Direct Line
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 123 4567"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Registered Office Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Plot 18 Commercial Boulevard, Victoria Island, Lagos"
                    value={newClientForm.address}
                    onChange={(e) => setNewClientForm({ ...newClientForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Retainer Terms & Confidential Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on client onboarding, billing parameters, or privileged representation context..."
                  value={newClientForm.notes}
                  onChange={(e) => setNewClientForm({ ...newClientForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Initial Docket Linking Option */}
              <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClientForm.createInitialDocket}
                    onChange={(e) => setNewClientForm({ ...newClientForm, createInitialDocket: e.target.checked })}
                    className="w-4 h-4 text-[#990000] focus:ring-[#990000] border-gray-300 rounded"
                  />
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Immediately Initialize & Link a Case Docket for this Client
                  </span>
                </label>

                {newClientForm.createInitialDocket && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                        Initial Matter Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nexus Energy Resources v. Federal Regulatory Agency"
                        value={newClientForm.initialDocketTitle}
                        onChange={(e) => setNewClientForm({ ...newClientForm, initialDocketTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Suit / Case Number
                        </label>
                        <input
                          type="text"
                          placeholder="Leave blank to auto-generate"
                          value={newClientForm.initialDocketNumber}
                          onChange={(e) => setNewClientForm({ ...newClientForm, initialDocketNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Practice Area
                        </label>
                        <select
                          value={newClientForm.practiceArea}
                          onChange={(e) => setNewClientForm({ ...newClientForm, practiceArea: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                        >
                          <option value="Compliance and Advisory">Compliance & Regulatory Advisory (NDPA, AML/CFT)</option>
                          <option value="General Corporate/Commercial Legal Support">General Corporate / Commercial Support</option>
                          <option value="Corporate Criminal Defense">Corporate Criminal Defense & Investigations</option>
                          <option value="Tax Advisory & Fiscal Structuring">Tax Advisory & Fiscal Optimization</option>
                          <option value="Energy, Maritime & Natural Resources">Energy, Maritime & Natural Resources</option>
                          <option value="IT Law, Tech Regulatory & Data Protection">IT Law, Tech Regulatory & Startups</option>
                          <option value="Government Relations, Public Policy & ESG">Government Relations & ESG</option>
                          <option value="Dispute Resolution & Commercial Advocacy">Dispute Resolution & Commercial Advocacy</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-5 py-2.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClient}
                  className="px-6 py-2.5 bg-[#990000] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingClient ? 'Registering to Firestore...' : 'Register Client Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SELECT CLIENT FOR CASE UPDATE                           */}
      {/* ============================================================== */}
      {showSelectClientForUpdateModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-t-4 border-t-[#990000] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#990000]"></span>
                  <h3 className="font-serif font-bold text-lg text-black uppercase tracking-wide">
                    ADD CASE UPDATE &bull; SELECT CLIENT
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select the registered client whose case matter has a new development or proceeding. You will then select their specific case docket and record the update.
                </p>
              </div>
              <button
                onClick={() => setShowSelectClientForUpdateModal(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search registered client by company, name, or registered email..."
                value={clientSearchForUpdate}
                onChange={(e) => setClientSearchForUpdate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-[#990000]"
                autoFocus
              />
            </div>

            {/* Client Directory List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredClientsForUpdate.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border border-gray-200 space-y-3">
                  <Users className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">No registered clients found matching your query</p>
                  <p className="text-[11px] text-gray-500">
                    Register a new client profile first or adjust your search filter.
                  </p>
                  <button
                    onClick={() => {
                      setShowSelectClientForUpdateModal(false);
                      setShowAddClientModal(true);
                    }}
                    className="px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    + Register New Client
                  </button>
                </div>
              ) : (
                filteredClientsForUpdate.map(client => {
                  const clientCasesCount = cases.filter(c =>
                    c.clientUid === client.id ||
                    c.clientUid === client.uid ||
                    (c.clientEmail && c.clientEmail.toLowerCase().trim() === client.email.toLowerCase().trim())
                  ).length;

                  return (
                    <div
                      key={client.id}
                      className="p-4 border border-gray-200 hover:border-[#990000] bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-black">{client.name}</h4>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                            client.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-mono text-gray-700">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {client.email}
                          </span>
                          <span>&bull;</span>
                          <span className="font-medium text-gray-600">{client.organization}</span>
                          <span>&bull;</span>
                          <span className="font-bold text-[#990000]">
                            {clientCasesCount} Linked Docket{clientCasesCount === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedClientForWorkspace(client);
                          setWorkspaceInitialTab('updates');
                          setWorkspaceInitialOpenAddUpdate(true);
                          setShowSelectClientForUpdateModal(false);
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                      >
                        <span>Select Client &rarr;</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
              <span className="text-gray-400">
                {filteredClientsForUpdate.length} Client{filteredClientsForUpdate.length === 1 ? '' : 's'} Available
              </span>
              <button
                type="button"
                onClick={() => setShowSelectClientForUpdateModal(false)}
                className="px-4 py-1.5 border border-gray-300 text-gray-700 font-bold uppercase cursor-pointer hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (ADMIN ONLY) */}
      {caseToDelete && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-t-4 border-t-red-600 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-base uppercase tracking-wider">Confirm Case Deletion</h4>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete docket <strong className="text-black">{caseToDelete.caseNumber}</strong>:
            </p>
            <div className="p-3 bg-red-50 border border-red-200 text-xs space-y-1">
              <p className="font-bold text-black">{caseToDelete.title}</p>
              <p className="text-gray-500 font-mono text-[11px]">Assigned Client UID: {caseToDelete.clientUid}</p>
            </div>

            <p className="text-[11px] text-gray-400">
              This action expunges all documents, updates, and records for this suit in Cloud Firestore. This action is restricted to administrators.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setCaseToDelete(null)}
                disabled={deletingCase}
                className="px-4 py-2 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCase}
                disabled={deletingCase}
                className="px-5 py-2 bg-red-600 hover:bg-black text-white text-xs font-bold uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                {deletingCase ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
