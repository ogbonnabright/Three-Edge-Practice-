import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Activity, 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Scale, 
  Clock3, 
  MessageSquare, 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  Building, 
  AlertCircle,
  FileCheck2,
  Lock,
  Zap,
  Mail
} from 'lucide-react';
import { LegalCase, CaseUpdate, CaseDocument, CaseStatus } from '../types';

interface ClientDashboardProps {
  cases: LegalCase[];
  casesLoading: boolean;
  currentUserUid: string;
  currentUserEmail: string | null;
  currentUserName: string | null;
  onOpenCaseModal: (legalCase: LegalCase) => void;
  onOpenDocModal: (doc: CaseDocument & { caseNumber: string; caseTitle: string; caseId: string }) => void;
  onAdvanceDocumentStatus: (caseId: string, docId: string, currentStatus: CaseDocument['status']) => void;
  onSendClientNote: (caseId: string, noteText: string) => Promise<void>;
  onSimulateLiveEvent?: () => void;
  isSimulating?: boolean;
}

type ClientTab = 'dashboard' | 'cases' | 'documents' | 'hearings';

const ClientDashboard: React.FC<ClientDashboardProps> = ({
  cases,
  casesLoading,
  currentUserUid,
  currentUserEmail,
  currentUserName,
  onOpenCaseModal,
  onOpenDocModal,
  onAdvanceDocumentStatus,
  onSendClientNote,
  onSimulateLiveEvent,
  isSimulating = false
}) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('dashboard');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [docStatusFilter, setDocStatusFilter] = useState('All');
  const [updateTypeFilter, setUpdateTypeFilter] = useState('All');
  const [updateCaseFilter, setUpdateCaseFilter] = useState('All');

  // Note to Counsel Modal
  const [selectedCaseForNote, setSelectedCaseForNote] = useState<LegalCase | null>(null);
  const [clientNoteText, setClientNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState(false);

  const normalizedEmail = (currentUserEmail || '').toLowerCase().trim();

  // Helper to verify if a case belongs to this client (by email registered during onboarding OR by UID)
  const isCaseAssignedToThisClient = (c: LegalCase) => {
    if (normalizedEmail && c.clientEmail) {
      if (c.clientEmail.toLowerCase().trim() === normalizedEmail) return true;
    }
    if (currentUserUid && c.clientUid === currentUserUid) return true;
    return false;
  };

  // Filtered client cases strictly assigned to this email / UID
  const clientCases = useMemo(() => {
    return cases.filter(isCaseAssignedToThisClient);
  }, [cases, normalizedEmail, currentUserUid]);

  // Aggregated updates for client's cases ONLY
  const aggregatedUpdates = useMemo(() => {
    const list: (CaseUpdate & { caseId: string; caseNumber: string; caseTitle: string; leadAttorney: string })[] = [];
    clientCases.forEach(c => {
      c.recentUpdates?.forEach(u => {
        list.push({
          ...u,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          leadAttorney: c.leadAttorney
        });
      });
    });
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clientCases]);

  // Filtered updates
  const filteredUpdates = useMemo(() => {
    return aggregatedUpdates.filter(upd => {
      const matchesType = updateTypeFilter === 'All' || upd.type === updateTypeFilter;
      const matchesCase = updateCaseFilter === 'All' || upd.caseId === updateCaseFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        upd.title.toLowerCase().includes(q) ||
        upd.notes.toLowerCase().includes(q) ||
        upd.caseNumber.toLowerCase().includes(q) ||
        upd.author.toLowerCase().includes(q);

      return matchesType && matchesCase && matchesSearch;
    });
  }, [aggregatedUpdates, updateTypeFilter, updateCaseFilter, searchQuery]);

  // Aggregated documents for client's cases ONLY
  const aggregatedDocuments = useMemo(() => {
    const list: (CaseDocument & { caseId: string; caseNumber: string; caseTitle: string; leadAttorney: string })[] = [];
    clientCases.forEach(c => {
      c.documents?.forEach(d => {
        list.push({
          ...d,
          caseId: c.id,
          caseNumber: c.caseNumber,
          caseTitle: c.title,
          leadAttorney: c.leadAttorney
        });
      });
    });
    return list;
  }, [clientCases]);

  // Document Metrics
  const documentMetrics = useMemo(() => {
    let certified = 0;
    let filed = 0;
    let served = 0;
    let drafting = 0;
    aggregatedDocuments.forEach(d => {
      if (d.status === 'Certified') certified++;
      else if (d.status === 'Filed') filed++;
      else if (d.status === 'Served') served++;
      else if (d.status === 'Drafting') drafting++;
    });
    return { certified, filed, served, drafting, total: aggregatedDocuments.length };
  }, [aggregatedDocuments]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return aggregatedDocuments.filter(d => {
      const matchesStatus = docStatusFilter === 'All' || d.status.toLowerCase() === docStatusFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.caseNumber.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [aggregatedDocuments, docStatusFilter, searchQuery]);

  // Filtered client cases for table/cards
  const filteredCases = useMemo(() => {
    return clientCases.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.courtJurisdiction.toLowerCase().includes(q) ||
        c.leadAttorney.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [clientCases, statusFilter, searchQuery]);

  // Submit Note to Counsel
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForNote || !clientNoteText.trim()) return;
    setSendingNote(true);
    try {
      await onSendClientNote(selectedCaseForNote.id, clientNoteText.trim());
      setNoteSuccess(true);
      setClientNoteText('');
      setTimeout(() => {
        setNoteSuccess(false);
        setSelectedCaseForNote(null);
      }, 2000);
    } catch (err) {
      console.error('Error submitting client note:', err);
    } finally {
      setSendingNote(false);
    }
  };

  const clientCorporateName = clientCases[0]?.clientName || currentUserName || 'Authorized Client Representative';

  return (
    <div className="space-y-8">
      {/* Client Identity & Onboarding Email Routing Notice */}
      <div className="bg-white border border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-black text-sm">
                {clientCases.length > 0 ? `${clientCorporateName}` : 'Client Legal Portal'}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono uppercase font-bold tracking-wider border border-emerald-300">
                Client Role
              </span>
              {clientCases.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-mono border border-gray-200">
                  {clientCases.length} Onboarded Matter{clientCases.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>Authenticated Registered Email:</span>
              <span className="font-mono text-black font-semibold bg-gray-100 px-1.5 py-0.2 border border-gray-200">
                {normalizedEmail || currentUserUid}
              </span>
              <span className="text-gray-400">&bull; Scoped strictly to cases registered for this email during onboarding.</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSimulateLiveEvent && clientCases.length > 0 && (
            <button
              onClick={onSimulateLiveEvent}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-[#990000] text-gray-800 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-gray-300 disabled:opacity-50"
              title="Test real-time update reactivity on your matter"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-amber-500' : 'text-[#990000]'}`} />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Court Event'}</span>
            </button>
          )}

          <div className="text-[11px] text-gray-400 bg-gray-50 px-3 py-1.5 border border-gray-200 font-mono">
            Zero-Trust Isolation Active
          </div>
        </div>
      </div>

      {/* If No Cases are registered for this email during onboarding */}
      {!casesLoading && clientCases.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 sm:p-14 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Mail className="w-7 h-7 text-amber-600" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#990000] block">
            Access Verification Protocol
          </span>
          <h3 className="font-serif font-bold text-2xl text-black">
            No Legal Matters Registered for this Email
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
            You are authenticated as <strong className="text-black font-mono">{normalizedEmail || currentUserUid}</strong>. 
            However, no legal briefs or cases have been onboarded to this email address by firm administrators.
          </p>

          <div className="p-5 bg-gray-50 border border-gray-200 text-xs text-gray-600 max-w-lg mx-auto text-left space-y-2">
            <p className="font-bold text-black uppercase tracking-wider text-[11px]">How Email Routing Works:</p>
            <p className="flex items-start gap-2">
              <span className="text-[#990000] font-bold">&bull;</span>
              <span><strong>Firm Emails:</strong> (e.g. <code className="text-[#990000]">chiaghalam@gmail.com</code> or <code className="text-[#990000]">@tep.com.ng</code>) route automatically to the <strong>Admin Dashboard</strong> with firmwide management.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#990000] font-bold">&bull;</span>
              <span><strong>Client Emails:</strong> Route to the <strong>Client Dashboard</strong> showing only the cases registered for that specific email address during onboarding.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#990000] font-bold">&bull;</span>
              <span><strong>Resolution:</strong> If your company is represented by Three Edge Practice, contact your lead counsel to register <strong className="text-black font-mono">{normalizedEmail}</strong> to your docket.</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-[#990000]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Active Matters</p>
                <Briefcase className="w-4 h-4 text-[#990000]" />
              </div>
              <p className="text-3xl font-serif font-bold text-black">{clientCases.length}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-1">Registered for {normalizedEmail || 'your account'}</p>
            </div>

            <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Docket Updates</p>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-serif font-bold text-black">{aggregatedUpdates.length}</p>
              <p className="text-[11px] text-blue-700 font-semibold mt-1">Real-time proceedings logged</p>
            </div>

            <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Documents</p>
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-serif font-bold text-black">{documentMetrics.total}</p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                {documentMetrics.certified} Certified &bull; {documentMetrics.filed} Filed
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-6 shadow-xs border-l-4 border-l-amber-600 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Hearing</p>
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-black truncate">
                  {clientCases.find(c => c.nextHearingDate)?.nextHearingDate?.split(' at ')[0] || 'Pending Fixture'}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span className="font-mono text-[10px]">{clientCases[0]?.caseNumber || 'Ready'}</span>
                <button 
                  onClick={() => setActiveTab('hearings')}
                  className="font-bold text-[#990000] hover:underline cursor-pointer"
                >
                  View Calendar &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Client Dashboard Navigation Tabs */}
          <div className="bg-white border border-gray-200 px-6 py-2 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                  activeTab === 'dashboard'
                    ? 'border-[#990000] text-[#990000] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Live Litigation Stream</span>
              </button>

              <button
                onClick={() => setActiveTab('cases')}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                  activeTab === 'cases'
                    ? 'border-[#990000] text-[#990000] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Legal Matters ({clientCases.length})</span>
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
                <span>Document Vault ({aggregatedDocuments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hearings')}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
                  activeTab === 'hearings'
                    ? 'border-[#990000] text-[#990000] bg-gray-50'
                    : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Court Calendar</span>
              </button>
            </div>

            {/* Security Notice for Client */}
            <div className="text-[11px] text-gray-400 font-mono hidden sm:flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Email-Scoped Isolation Active</span>
            </div>
          </div>

          {/* Tab 1: Live Litigation Stream & Status Matrix */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 Cols): Real-Time Updates Feed */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-gray-200 p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </span>
                        <h3 className="font-serif font-bold text-lg text-black">
                          Live Case Proceedings
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Real-time updates on your matters registered for {normalizedEmail}.
                      </p>
                    </div>
                  </div>

                  {/* Feed Content */}
                  {filteredUpdates.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <Activity className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs font-bold text-gray-600">No proceedings recorded yet for your matters</p>
                      <p className="text-[11px] text-gray-400">Updates will appear in real time as your lead counsel files court papers.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredUpdates.map(upd => (
                        <div key={upd.id} className="p-4 bg-gray-50 border border-gray-200 hover:border-[#990000] transition-colors space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              upd.type === 'Court Hearing' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              upd.type === 'Filing' ? 'bg-red-100 text-[#990000] border border-red-300' :
                              upd.type === 'Settlement Meeting' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                              'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}>
                              {upd.type || 'Filing'}
                            </span>
                            <span className="font-mono text-gray-400 text-[11px]">{upd.date}</span>
                          </div>

                          <h4 className="font-bold text-sm text-black">{upd.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-light">{upd.notes}</p>

                          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                            <span className="font-mono">{upd.caseNumber}</span>
                            <span>Author: <strong>{upd.author}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (5 Cols): Document Status Pipeline & Quick Liaison */}
              <div className="lg:col-span-5 space-y-6">
                {/* Document Lifecycle Pipeline */}
                <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-black flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#990000]" />
                    <span>Document Status Pipeline</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Official court processing lifecycle for your legal filings.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        <span className="text-xs font-bold text-emerald-900 uppercase">Certified True Copies (CTC)</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 text-sm">{documentMetrics.certified}</span>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#990000]"></span>
                        <span className="text-xs font-bold text-[#990000] uppercase">Filed Processes</span>
                      </div>
                      <span className="font-mono font-bold text-[#990000] text-sm">{documentMetrics.filed}</span>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-blue-900 uppercase">Served on Respondents</span>
                      </div>
                      <span className="font-mono font-bold text-blue-800 text-sm">{documentMetrics.served}</span>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                        <span className="text-xs font-bold text-amber-900 uppercase">Drafting & Review</span>
                      </div>
                      <span className="font-mono font-bold text-amber-800 text-sm">{documentMetrics.drafting}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Counsel Note Box */}
                <div className="bg-[#0f1115] text-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-[#990000]">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Direct Counsel Liaison</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-light">
                    Need urgent clarification or have new instruction for your lead counsel regarding your docket?
                  </p>

                  {clientCases.length > 0 && (
                    <button
                      onClick={() => setSelectedCaseForNote(clientCases[0])}
                      className="w-full py-2.5 bg-[#990000] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Send Confidential Note to Counsel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: My Legal Dockets */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCases.map(c => (
                  <div key={c.id} className="bg-white border border-gray-200 p-6 shadow-xs hover:border-[#990000] transition-colors space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-black">{c.caseNumber}</span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">Filed: {c.filingDate}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        c.status === 'Active Trial' ? 'bg-[#990000] text-white' :
                        c.status === 'Pre-Trial Discovery' ? 'bg-amber-600 text-white' :
                        c.status === 'Settlement Discussions' ? 'bg-emerald-700 text-white' : 'bg-gray-800 text-white'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-black">{c.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 font-light leading-relaxed">{c.summary}</p>

                    <div className="p-3 bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registered Email:</span>
                        <span className="font-mono font-medium text-black">{c.clientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Jurisdiction:</span>
                        <span className="font-medium text-black text-right truncate max-w-[200px]">{c.courtJurisdiction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lead Attorney:</span>
                        <span className="font-bold text-black">{c.leadAttorney}</span>
                      </div>
                      {c.nextHearingDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Next Hearing:</span>
                          <span className="font-bold text-[#990000]">{c.nextHearingDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCaseForNote(c)}
                        className="text-xs text-gray-600 hover:text-black font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Note to Counsel</span>
                      </button>

                      <button
                        onClick={() => onOpenCaseModal(c)}
                        className="px-3.5 py-1.5 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        View Docket Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Document Vault */}
          {activeTab === 'documents' && (
            <div className="bg-white border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-black">Electronic Document Vault</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Encrypted court pleadings, affidavits, and rulings registered for {normalizedEmail}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Status Filter:</span>
                  <select
                    value={docStatusFilter}
                    onChange={(e) => setDocStatusFilter(e.target.value)}
                    className="border border-gray-300 text-xs px-2.5 py-1.5 bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Certified">Certified (CTC)</option>
                    <option value="Filed">Filed</option>
                    <option value="Served">Served</option>
                    <option value="Drafting">Drafting</option>
                  </select>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f1115] text-white text-[11px] uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Suit Number</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Filing Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 font-bold text-black max-w-xs">
                        {d.title}
                        <span className="block text-[10px] text-gray-400 font-normal">{d.fileSize}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-black">{d.caseNumber}</td>
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
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => onAdvanceDocumentStatus(d.caseId, d.id, d.status)}
                          className="px-2 py-1 bg-gray-100 hover:bg-[#990000] hover:text-white text-gray-700 text-[10px] font-bold uppercase tracking-wider"
                          title="Advance document along lifecycle (Drafting -> Filed -> Served -> Certified)"
                        >
                          Advance &rarr;
                        </button>
                        <button
                          onClick={() => onOpenDocModal(d)}
                          className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#990000]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Court Calendar */}
          {activeTab === 'hearings' && (
            <div className="bg-white border border-gray-200 p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="font-serif font-bold text-base text-black">Imminent Court Fixtures</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scheduled hearings, witness depositions, and case management conferences for your matters.
                </p>
              </div>

              <div className="space-y-4">
                {clientCases.map(c => (
                  <div key={c.id} className="p-4 bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-black">{c.caseNumber}</span>
                      <h4 className="font-bold text-sm text-black mt-0.5">{c.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{c.courtJurisdiction} &bull; {c.judgeOrPanel || 'Presiding Judge'}</p>
                    </div>

                    <div className="text-right sm:border-l sm:border-gray-200 sm:pl-6">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">Hearing Date:</span>
                      <span className="font-bold text-sm text-[#990000]">{c.nextHearingDate || 'Awaiting Fixture'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Send Note to Counsel Modal */}
      {selectedCaseForNote && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-t-4 border-t-[#990000] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-black">Confidential Note to Lead Counsel</h4>
              <button onClick={() => setSelectedCaseForNote(null)} className="text-gray-400 hover:text-black">
                &times;
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Regarding Matter: <strong className="text-black">{selectedCaseForNote.caseNumber}</strong> ({selectedCaseForNote.title})
            </p>

            {noteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Instruction submitted directly to {selectedCaseForNote.leadAttorney}.</span>
              </div>
            ) : (
              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1">
                    Your Confidential Instruction / Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter message for your designated partner..."
                    value={clientNoteText}
                    onChange={(e) => setClientNoteText(e.target.value)}
                    className="w-full p-3 border border-gray-300 text-xs focus:outline-none focus:border-[#990000]"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseForNote(null)}
                    className="px-4 py-2 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingNote}
                    className="px-5 py-2 bg-[#990000] text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>{sendingNote ? 'Sending...' : 'Send Note'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
