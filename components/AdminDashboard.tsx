import React, { useState, useMemo } from 'react';
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
  Database
} from 'lucide-react';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { LegalCase, CaseUpdate, CaseDocument, CaseStatus } from '../types';
import { DEMO_CLIENTS, INITIAL_FIRM_CASES } from '../src/data/firmMatters';

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
  const [updateTypeFilter, setUpdateTypeFilter] = useState('All');

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<LegalCase | null>(null);
  const [deletingCase, setDeletingCase] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // New Matter Form
  const [newMatterForm, setNewMatterForm] = useState({
    title: '',
    caseNumber: '',
    selectedClientOption: DEMO_CLIENTS[0].uid,
    customClientUid: '',
    clientName: DEMO_CLIENTS[0].name,
    clientEmail: DEMO_CLIENTS[0].email,
    practiceArea: 'Compliance and Advisory / Regulatory Advocacy',
    regionalOffice: 'Abuja (Federal Capital Territory)',
    courtJurisdiction: 'Federal High Court, Abuja Division',
    judgeOrPanel: 'Hon. Justice M. A. Idris (Presiding)',
    status: 'Pre-Trial Discovery' as CaseStatus,
    stage: 'Intake Assessment & Statement of Claim Formulation',
    summary: '',
    initialUpdateTitle: 'Matter Formally Onboarded by Administrator',
    initialUpdateNotes: 'Retainer perfected; managing partner assigned to conduct litigation strategy.'
  });
  const [submittingMatter, setSubmittingMatter] = useState(false);

  // Aggregate Clients from Cases & Predefined
  const firmClients = useMemo(() => {
    const clientMap = new Map<string, {
      uid: string;
      name: string;
      email: string;
      organization: string;
      casesCount: number;
      activeCases: LegalCase[];
    }>();

    // Add predefined clients first
    DEMO_CLIENTS.forEach(dc => {
      clientMap.set(dc.uid, {
        uid: dc.uid,
        name: dc.name,
        email: dc.email,
        organization: dc.organization,
        casesCount: 0,
        activeCases: []
      });
    });

    // Populate from actual Firestore cases
    cases.forEach(c => {
      const existing = clientMap.get(c.clientUid);
      if (existing) {
        existing.casesCount++;
        existing.activeCases.push(c);
        if (c.clientName) existing.name = c.clientName;
        if (c.clientEmail) existing.email = c.clientEmail;
      } else {
        clientMap.set(c.clientUid, {
          uid: c.clientUid,
          name: c.clientName || 'Institutional Client',
          email: c.clientEmail || 'client@firm.ng',
          organization: c.clientName || 'Corporate Client',
          casesCount: 1,
          activeCases: [c]
        });
      }
    });

    return Array.from(clientMap.values());
  }, [cases]);

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
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.clientUid.toLowerCase().includes(q) ||
        c.courtJurisdiction.toLowerCase().includes(q) ||
        c.leadAttorney.toLowerCase().includes(q);

      return matchesStatus && matchesClient && matchesSearch;
    });
  }, [cases, statusFilter, clientFilter, searchQuery]);

  // Seed Initial Demo Dockets to Firestore
  const handleSeedInitialCases = async () => {
    setIsSeeding(true);
    try {
      for (const initialCase of INITIAL_FIRM_CASES) {
        await setDoc(doc(db, 'cases', initialCase.id), initialCase);
      }
      setAdminToast('Initialized 3 firm cases across Atlantic Deepwater and Zenith Telecom in Firestore.');
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
      const caseNumber = newMatterForm.caseNumber.trim() || `TEP-ADM-2026-${randomSeq}`;

      const newCase: LegalCase = {
        id: caseId,
        caseNumber,
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
            type: 'Filing'
          }
        ],
        documents: [
          {
            id: `doc-${Date.now()}`,
            title: `Originating Process - ${newMatterForm.title.slice(0, 35)}...`,
            category: 'Originating Summons',
            filingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            fileSize: '2.4 MB',
            status: 'Filed'
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
      setAdminToast(`Successfully onboarded case ${caseNumber} for client email: ${clientEmailClean}. Users logging in with this email will route directly to this matter.`);
      setTimeout(() => setAdminToast(null), 6000);

      // Reset form
      setNewMatterForm(prev => ({
        ...prev,
        title: '',
        caseNumber: '',
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

  // Simulate Live Court Event across Firm Matters
  const handleSimulateLiveCourtEvent = async () => {
    if (cases.length === 0) return;
    setIsSimulating(true);
    try {
      const targetCase = cases[Math.floor(Math.random() * cases.length)];
      const events = [
        {
          title: 'Court Registry: Certified True Copy (CTC) Sealed',
          notes: 'Chief Registrar completed formal verification and seal endorsement on the interlocutory injunction order.',
          author: "Al'Qasim Jafar (Managing Partner)",
          type: 'Filing' as const,
        },
        {
          title: 'Bench Ruling: Preliminary Objection Struck Out',
          notes: 'Presiding trial judge delivered bench ruling in favour of client, setting accelerated fixture for trial hearing.',
          author: 'Churchill Osila (Partner & Head of Office)',
          type: 'Court Hearing' as const,
        },
        {
          title: 'Joint Mediation Agreement Terms Initialed',
          notes: 'Counsel settled technical dispute parameters at Chambers; consent judgment draft prepared for registration.',
          author: 'Nweye R. Robinson (Partner)',
          type: 'Settlement Meeting' as const,
        }
      ];
      const selected = events[Math.floor(Math.random() * events.length)];
      const newUpd: CaseUpdate = {
        id: `upd-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        title: selected.title,
        notes: selected.notes,
        author: selected.author,
        type: selected.type
      };

      const updatedUpdates = [newUpd, ...(targetCase.recentUpdates || [])];
      await updateDoc(doc(db, 'cases', targetCase.id), {
        recentUpdates: updatedUpdates,
        updatedAt: new Date().toISOString()
      });

      setAdminToast(`Simulated live event logged to ${targetCase.caseNumber} (${targetCase.clientName})`);
      setTimeout(() => setAdminToast(null), 4500);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'cases');
    } finally {
      setIsSimulating(false);
    }
  };

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
            onClick={handleSimulateLiveCourtEvent}
            disabled={isSimulating || cases.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-[#990000] text-gray-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            title="Simulate live court event to test real-time Firestore listeners"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-amber-400' : 'text-[#ff7777]'}`} />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Live Court Event'}</span>
          </button>

          <button
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer"
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
            <span>Live Litigation Stream</span>
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
              <h3 className="text-xl font-serif font-bold text-black">Institutional Clients Directory</h3>
              <p className="text-xs text-gray-500 mt-1">
                Clients verified under Role-Based Access Control. Each client sees only matters assigned to their Firebase UID.
              </p>
            </div>
            <button
              onClick={() => {
                setShowOnboardModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard Case for a Client</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {firmClients.map(client => (
              <div key={client.uid} className="bg-white border border-gray-200 p-6 shadow-xs hover:border-[#990000] transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 border border-gray-300 text-black flex items-center justify-center font-bold font-serif text-lg">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-black">{client.name}</h4>
                      <p className="text-xs text-gray-500 font-light">{client.organization}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-300">
                    Client Role
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-mono text-[11px]">Firebase UID:</span>
                    <span className="font-mono text-gray-800 bg-gray-50 px-2 py-0.5 border border-gray-200 text-[11px] select-all">
                      {client.uid}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-medium text-black">{client.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Assigned Cases:</span>
                    <span className="font-bold text-[#990000]">{client.casesCount} Active Matters</span>
                  </div>
                </div>

                {/* Assigned Cases List */}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Assigned Dockets:</p>
                  {client.activeCases.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No matters assigned yet.</p>
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
                            className="text-[#990000] hover:underline font-bold text-[10px] uppercase"
                          >
                            Inspect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setNewMatterForm(prev => ({
                        ...prev,
                        selectedClientOption: client.uid,
                        clientName: client.name,
                        clientEmail: client.email
                      }));
                      setShowOnboardModal(true);
                    }}
                    className="text-xs font-bold text-[#990000] hover:text-black uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Onboard Matter for this Client</span>
                  </button>

                  {onSwitchToClientView && (
                    <button
                      onClick={() => onSwitchToClientView(client.uid)}
                      className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
                      title="Preview portal as this client would see it"
                    >
                      <span>Preview View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                <h3 className="text-xl font-serif font-bold text-black">Firmwide Real-Time Litigation Stream</h3>
              </div>
              <p className="text-xs text-gray-500">
                Live stream aggregating all filings, hearings, and regulatory notices across every firm matter.
              </p>
            </div>

            <button
              onClick={handleSimulateLiveCourtEvent}
              disabled={isSimulating || cases.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer self-start"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Live Event</span>
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
                    Practice Area
                  </label>
                  <select
                    value={newMatterForm.practiceArea}
                    onChange={(e) => setNewMatterForm({ ...newMatterForm, practiceArea: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Compliance and Advisory / Regulatory Advocacy">Compliance & Regulatory</option>
                    <option value="Energy & Natural Resources / Maritime Litigation">Energy & Maritime</option>
                    <option value="Dispute Resolution / Telecommunications and ICT">Dispute Resolution & ICT</option>
                    <option value="Banking, Finance and Taxation">Banking & Finance</option>
                    <option value="Real Estate and Infrastructure">Real Estate & Infrastructure</option>
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                  Court Jurisdiction & Panel
                </label>
                <input
                  type="text"
                  placeholder="e.g. Federal High Court, Court of Appeal, Supreme Court"
                  value={newMatterForm.courtJurisdiction}
                  onChange={(e) => setNewMatterForm({ ...newMatterForm, courtJurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                />
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
