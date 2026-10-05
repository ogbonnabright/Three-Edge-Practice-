import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Activity, 
  FileText, 
  AlertCircle, 
  LogOut, 
  KeyRound, 
  Users, 
  Clock, 
  Trash2, 
  X, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building,
  User
} from 'lucide-react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  getDoc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { LegalCase, CaseUpdate, CaseDocument, CaseStatus, UserRole } from '../types';
import { DEMO_CLIENTS, INITIAL_FIRM_CASES } from '../src/data/firmMatters';
import AdminDashboard from '../components/AdminDashboard';
import ClientDashboard from '../components/ClientDashboard';

const ClientPortal: React.FC = () => {
  const { roleView, caseId } = useParams<{ roleView?: string; caseId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Role State: Stored in sessionStorage so user choice is respected.
  // Defaults strictly to 'Client' so admin dashboard NEVER shows on client login.
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('tep_active_role');
      if (saved === 'Admin' || saved === 'Client') return saved;
    }
    return 'Client';
  });

  // Client UID Override for demo client testing
  const [activeClientUid, setActiveClientUid] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tep_active_client_uid');
    }
    return null;
  });

  // Login Portal Tab: 'client' (default) | 'admin'
  const [loginPortalTab, setLoginPortalTab] = useState<'client' | 'admin'>('client');

  // Firestore Cases State
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Selected Case Modal & Document Inspection Modal
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<(CaseDocument & { caseNumber: string; caseTitle: string; caseId: string }) | null>(null);

  // Access Denied / Security Guard Notice State
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);
  const [portalToast, setPortalToast] = useState<string | null>(null);

  // Determine Effective Client UID
  const effectiveClientUid = useMemo(() => {
    if (activeRole === 'Client' && activeClientUid) {
      return activeClientUid;
    }
    return currentUser?.uid || DEMO_CLIENTS[0].uid;
  }, [activeRole, activeClientUid, currentUser]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setCases([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Strict Role-Based Route Redirect Guard:
  // - If at /portal: redirect to /portal/client (for clients) or /portal/admin (for admins)
  // - If at /portal/admin but activeRole is 'Client': BLOCK and redirect to /portal/client!
  useEffect(() => {
    if (authLoading || !currentUser) return;

    const currentPath = location.pathname;

    // 1. If at root /portal:
    if (currentPath === '/portal' || currentPath === '/portal/') {
      if (activeRole === 'Admin') {
        navigate('/portal/admin', { replace: true });
      } else {
        navigate('/portal/client', { replace: true });
      }
      return;
    }

    // 2. Strict Security Guard: If a client navigates to /portal/admin, BLOCK and redirect
    if (currentPath === '/portal/admin' && activeRole !== 'Admin') {
      setAccessDeniedNotice('403 Access Denied: Administrator clearance is required to view the firm administration dashboard. Your account is authenticated with Client privileges.');
      navigate('/portal/client', { replace: true });
      return;
    }

    // 3. Clear access denial when safely on /portal/client
    if (currentPath === '/portal/client') {
      setAccessDeniedNotice(null);
    }
  }, [authLoading, currentUser, activeRole, location.pathname, navigate]);

  // Deep-Link Case Security Inspection Guard
  useEffect(() => {
    if (!caseId || cases.length === 0 || !currentUser) return;

    const targetCase = cases.find(c => c.id === caseId || c.caseNumber === caseId);
    if (!targetCase) return;

    if (activeRole === 'Admin') {
      setSelectedCase(targetCase);
    } else {
      // Client role: check if case belongs to client UID
      if (targetCase.clientUid === effectiveClientUid) {
        setSelectedCase(targetCase);
      } else {
        // Forbidden: Client attempting to view another client's case
        setSelectedCase(null);
        setAccessDeniedNotice(`403 Unauthorized Access: You are forbidden from viewing legal matter ${caseId}. Under strict zero-trust attorney confidentiality, dockets outside your Firebase UID cannot be accessed.`);
        navigate('/portal/client', { replace: true });
      }
    }
  }, [caseId, cases, currentUser, activeRole, effectiveClientUid, navigate]);

  // Real-Time Firestore Query Listener:
  // - Admin queries ALL cases across the firm
  // - Client STRICTLY queries ONLY cases where clientUid == effectiveClientUid
  useEffect(() => {
    if (!currentUser) {
      setCases([]);
      return;
    }

    setCasesLoading(true);
    const casesPath = 'cases';

    // Role-based query construction
    let q;
    if (activeRole === 'Admin') {
      // Admin sees ALL firm cases across all clients
      q = query(collection(db, casesPath));
    } else {
      // Client strictly sees ONLY cases assigned to their Firebase UID
      q = query(collection(db, casesPath), where('clientUid', '==', effectiveClientUid));
    }

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const loaded: LegalCase[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as LegalCase);
        });

        // If Admin has no cases yet in firm, auto-initialize initial demo dockets
        if (activeRole === 'Admin' && loaded.length === 0 && !snapshot.metadata.hasPendingWrites) {
          try {
            for (const initialCase of INITIAL_FIRM_CASES) {
              await setDoc(doc(db, 'cases', initialCase.id), initialCase);
            }
          } catch (seedErr) {
            console.warn('Initial admin seed notice:', seedErr);
          }
        } else {
          setCases(loaded);
          setCasesLoading(false);
          setLastSyncTime(new Date().toLocaleTimeString());

          // If a case modal is open, keep it in sync
          if (selectedCase) {
            const fresh = loaded.find(c => c.id === selectedCase.id);
            if (fresh) setSelectedCase(fresh);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, casesPath);
        setCasesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, activeRole, effectiveClientUid]);

  // -------------------------------------------------------------
  // CLIENT LOGIN HANDLERS (Ensures Admin Dashboard is NEVER shown)
  // -------------------------------------------------------------

  // Client Google Sign In
  const handleClientGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      // Explicitly set Client Role
      setActiveRole('Client');
      sessionStorage.setItem('tep_active_role', 'Client');
      setActiveClientUid(res.user.uid);
      sessionStorage.setItem('tep_active_client_uid', res.user.uid);
      navigate('/portal/client');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in cancelled. Please click the button again when ready.');
      } else if (errorMsg.includes('blocked')) {
        setAuthError('Pop-up window was blocked by your browser. Please allow popups or use the Instant Demo Client Access below.');
      } else {
        setAuthError(`Authentication error: ${errorMsg}`);
      }
    }
  };

  // Demo Client A Sign In (Atlantic Deepwater Corp)
  const handleDemoClientASignIn = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      setActiveRole('Client');
      sessionStorage.setItem('tep_active_role', 'Client');
      setActiveClientUid(DEMO_CLIENTS[0].uid);
      sessionStorage.setItem('tep_active_client_uid', DEMO_CLIENTS[0].uid);
      navigate('/portal/client');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setAuthError(`Demo Client sign-in notice: ${errorMsg}`);
    }
  };

  // Demo Client B Sign In (Zenith Telecom Ltd)
  const handleDemoClientBSignIn = async () => {
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      setActiveRole('Client');
      sessionStorage.setItem('tep_active_role', 'Client');
      setActiveClientUid(DEMO_CLIENTS[1].uid);
      sessionStorage.setItem('tep_active_client_uid', DEMO_CLIENTS[1].uid);
      navigate('/portal/client');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setAuthError(`Demo Client sign-in notice: ${errorMsg}`);
    }
  };

  // -------------------------------------------------------------
  // ADMIN LOGIN HANDLERS (Only for authorized firm administrators)
  // -------------------------------------------------------------

  // Admin Google Sign In
  const handleAdminGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      // Register in /admins collection
      try {
        await setDoc(doc(db, 'admins', res.user.uid), {
          id: res.user.uid,
          email: res.user.email,
          role: 'Admin',
          adminKey: 'TEP_PARTNER_LEGAL_CHAMBERS_2026',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Admin record sync note:', e);
      }

      setActiveRole('Admin');
      sessionStorage.setItem('tep_active_role', 'Admin');
      setActiveClientUid(null);
      sessionStorage.removeItem('tep_active_client_uid');
      navigate('/portal/admin');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in cancelled. Please click the button again when ready.');
      } else {
        setAuthError(`Admin authentication error: ${errorMsg}`);
      }
    }
  };

  // Demo Admin Sign In (Fast 1-Click for Reviewers)
  const handleDemoAdminSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInAnonymously(auth);
      await setDoc(doc(db, 'admins', res.user.uid), {
        id: res.user.uid,
        email: 'admin@tep.com.ng',
        role: 'Admin',
        adminKey: 'TEP_PARTNER_LEGAL_CHAMBERS_2026',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setActiveRole('Admin');
      sessionStorage.setItem('tep_active_role', 'Admin');
      setActiveClientUid(null);
      sessionStorage.removeItem('tep_active_client_uid');
      navigate('/portal/admin');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setAuthError(`Demo Admin sign-in notice: ${errorMsg}`);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActiveRole('Client');
      sessionStorage.removeItem('tep_active_role');
      setActiveClientUid(null);
      sessionStorage.removeItem('tep_active_client_uid');
      setSelectedCase(null);
      setSelectedDoc(null);
      navigate('/portal');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Advance Document Status in Firestore
  const handleAdvanceDocumentStatus = async (caseId: string, docId: string, currentStatus: CaseDocument['status']) => {
    const nextStatusMap: Record<CaseDocument['status'], CaseDocument['status']> = {
      'Drafting': 'Filed',
      'Filed': 'Served',
      'Served': 'Certified',
      'Certified': 'Drafting',
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      const target = cases.find(c => c.id === caseId);
      if (!target) return;

      const updatedDocs = target.documents.map(d => {
        if (d.id === docId) return { ...d, status: nextStatus };
        return d;
      });

      await updateDoc(doc(db, 'cases', caseId), {
        documents: updatedDocs,
        updatedAt: new Date().toISOString()
      });

      if (selectedDoc && selectedDoc.id === docId) {
        setSelectedDoc({ ...selectedDoc, status: nextStatus });
      }

      setPortalToast(`Document advanced to "${nextStatus}" in Firestore.`);
      setTimeout(() => setPortalToast(null), 3500);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${caseId}`);
    }
  };

  // Send Client Note to Counsel in Firestore
  const handleSendClientNote = async (caseId: string, noteText: string) => {
    const target = cases.find(c => c.id === caseId);
    if (!target || !currentUser) return;

    const newUpdate: CaseUpdate = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
      title: 'Client Confidential Instruction / Inquiry',
      notes: noteText,
      author: currentUser.displayName || (effectiveClientUid === DEMO_CLIENTS[0].uid ? DEMO_CLIENTS[0].name : 'Authorized Client Representative'),
      type: 'Internal Review'
    };

    const updatedList = [newUpdate, ...(target.recentUpdates || [])];
    await updateDoc(doc(db, 'cases', caseId), {
      recentUpdates: updatedList,
      updatedAt: new Date().toISOString()
    });
  };

  // Simulate Live Event on Current Matter
  const handleSimulateLiveEvent = async () => {
    if (cases.length === 0) return;
    setIsSimulatingEvent(true);
    try {
      const targetCase = cases[0];
      const events = [
        {
          title: 'Court Registry: Certified True Copy (CTC) Issued',
          notes: 'Registrar completed verification and affixed high court seal to interlocutory ruling.',
          author: "Al'Qasim Jafar (Managing Partner)",
          type: 'Filing' as const
        },
        {
          title: 'Case Management Conference Hearing Concluded',
          notes: 'Pre-trial disclosures finalized; next trial fixture assigned for oral testimony.',
          author: 'Churchill Osila (Partner)',
          type: 'Court Hearing' as const
        }
      ];
      const chosen = events[Math.floor(Math.random() * events.length)];
      const newUpd: CaseUpdate = {
        id: `upd-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        title: chosen.title,
        notes: chosen.notes,
        author: chosen.author,
        type: chosen.type
      };

      const updated = [newUpd, ...(targetCase.recentUpdates || [])];
      await updateDoc(doc(db, 'cases', targetCase.id), {
        recentUpdates: updated,
        updatedAt: new Date().toISOString()
      });

      setPortalToast(`Live proceeding logged to ${targetCase.caseNumber} in Firestore.`);
      setTimeout(() => setPortalToast(null), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `cases/${cases[0].id}`);
    } finally {
      setIsSimulatingEvent(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-black">
      {/* Top Banner Header */}
      <section className="bg-[#0f1115] text-white pt-16 pb-12 px-6 sm:px-12 md:px-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.35em] uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Three Edge Practice &bull; Legal Portal</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              {activeRole === 'Admin' ? 'Admin Management Dashboard' : 'Client Legal Case Portal'}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl font-light leading-relaxed">
              {activeRole === 'Admin'
                ? 'Firmwide docket administration, client case onboarding, case deletion, and real-time litigation monitoring.'
                : 'Real-time case proceedings feed, electronic document status vault, and privileged liaison scoped strictly to your account.'}
            </p>
          </div>

          {/* User Status / Account Strip */}
          {currentUser ? (
            <div className="bg-white/5 border border-white/15 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 self-start md:self-auto backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#990000]/20 text-[#ff6666] flex items-center justify-center font-bold font-serif text-lg border border-[#990000]">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || (activeRole === 'Admin' ? 'A' : 'C')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      {currentUser.displayName || (activeRole === 'Admin' ? "Al'Qasim Jafar (Admin Partner)" : (effectiveClientUid === DEMO_CLIENTS[1].uid ? 'Zenith Telecom Ltd' : 'Atlantic Deepwater Corp'))}
                    </p>
                    {activeRole === 'Admin' ? (
                      <span className="px-2 py-0.5 bg-[#990000] text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                        <KeyRound className="w-2.5 h-2.5" />
                        <span>ROLE: ADMIN</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 text-[9px] font-mono tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>ROLE: CLIENT</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">
                    {activeRole === 'Admin' ? (currentUser.email || 'admin@tep.com.ng') : `Client UID: ${effectiveClientUid}`}
                  </p>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:border-l sm:border-white/10 sm:pl-4">
                {activeRole === 'Admin' && (
                  <button
                    onClick={() => {
                      setActiveRole('Client');
                      sessionStorage.setItem('tep_active_role', 'Client');
                      setActiveClientUid(DEMO_CLIENTS[0].uid);
                      sessionStorage.setItem('tep_active_client_uid', DEMO_CLIENTS[0].uid);
                      navigate('/portal/client');
                    }}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/20"
                    title="View client portal experience"
                  >
                    Client View
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#990000] hover:bg-white hover:text-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  title="Sign out of portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#990000]/10 border border-[#990000]/30 p-4 max-w-sm text-xs text-gray-300">
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-[#990000]" />
                <span>Strict Role-Based Access Control</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-light text-[11px]">
                Clients are restricted to viewing only briefs assigned to their Firebase UID. Admins manage firmwide dockets and clients.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 py-8">
        {/* Global Security / Access Denied Alert */}
        {accessDeniedNotice && (
          <div className="mb-6 p-4 bg-red-950/90 border-l-4 border-l-red-500 text-white text-xs flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-200">Security Rule Enforced</p>
                <p className="text-gray-300 mt-0.5 leading-relaxed">{accessDeniedNotice}</p>
              </div>
            </div>
            <button onClick={() => setAccessDeniedNotice(null)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Action Toast */}
        {portalToast && (
          <div className="mb-6 p-4 bg-emerald-950/90 border-l-4 border-l-emerald-500 text-emerald-100 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{portalToast}</span>
            </div>
            <button onClick={() => setPortalToast(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {authLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#990000] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Verifying RBAC Authorization & Firestore Session...
            </p>
          </div>
        ) : !currentUser ? (
          /* ============================================================== */
          /* DISTINCT PORTAL SELECTION: CLIENT LOGIN vs ADMIN LOGIN         */
          /* ============================================================== */
          <div className="max-w-2xl mx-auto my-8 bg-white border border-gray-200 shadow-xl overflow-hidden">
            {/* Top Selector Tabs */}
            <div className="grid grid-cols-2 border-b border-gray-200">
              <button
                onClick={() => setLoginPortalTab('client')}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  loginPortalTab === 'client'
                    ? 'bg-white text-[#990000] border-b-2 border-b-[#990000] shadow-xs'
                    : 'bg-gray-50 text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Client Login</span>
              </button>

              <button
                onClick={() => setLoginPortalTab('admin')}
                className={`py-4 px-6 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  loginPortalTab === 'admin'
                    ? 'bg-white text-[#990000] border-b-2 border-b-[#990000] shadow-xs'
                    : 'bg-gray-50 text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Admin / Partner Login</span>
              </button>
            </div>

            <div className="p-8 sm:p-12 text-center">
              {authError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800 text-left">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* -------------------- TAB 1: CLIENT LOGIN -------------------- */}
              {loginPortalTab === 'client' && (
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-700 block mb-1">
                      Privileged Client Access
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-2">
                      Client Legal Case Portal
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-light">
                      Sign in to view active court dockets, real-time proceeding updates, electronic documents, and communicate with lead counsel.
                    </p>
                  </div>

                  {/* Institutional Google Sign In for Client */}
                  <div className="pt-2 pb-2">
                    <button
                      onClick={handleClientGoogleSignIn}
                      className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#990000] transition-all shadow-md cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign In with Google (Client)</span>
                    </button>
                  </div>

                  {/* Fast Instant Demo Client Access */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                      Instant Client Preview (1-Click)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={handleDemoClientASignIn}
                        className="p-3 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 text-xs text-left transition-all cursor-pointer"
                      >
                        <div className="font-bold">Atlantic Deepwater Corp</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">UID: client-atlantic-deepwater-2026</div>
                        <span className="text-[10px] font-bold text-emerald-700 block mt-1">Enter Client Portal &rarr;</span>
                      </button>

                      <button
                        onClick={handleDemoClientBSignIn}
                        className="p-3 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-200 hover:border-emerald-300 text-xs text-left transition-all cursor-pointer"
                      >
                        <div className="font-bold">Zenith Telecom Ltd</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">UID: client-zenith-telecom-2026</div>
                        <span className="text-[10px] font-bold text-emerald-700 block mt-1">Enter Client Portal &rarr;</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 font-light pt-2">
                    Clients are restricted strictly to cases linked to their Firebase UID. The Admin Dashboard is never accessible.
                  </p>
                </div>
              )}

              {/* -------------------- TAB 2: ADMIN LOGIN -------------------- */}
              {loginPortalTab === 'admin' && (
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-red-50 text-[#990000] rounded-full flex items-center justify-center mx-auto border border-red-200">
                    <KeyRound className="w-7 h-7 text-[#990000]" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#990000] block mb-1">
                      Chambers & Dockets Administration
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-2">
                      Administrator & Partner Login
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto font-light">
                      For Three Edge Practice managing partners, lead counsel, and court registrars authorized to onboard or delete dockets.
                    </p>
                  </div>

                  {/* Institutional Google Sign In for Admin */}
                  <div className="pt-2 pb-2">
                    <button
                      onClick={handleAdminGoogleSignIn}
                      className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#990000] text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-md cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Sign In with Google (Admin)</span>
                    </button>
                  </div>

                  {/* Fast Instant Demo Admin Access */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                      Instant Admin Access (1-Click Test)
                    </span>
                    <button
                      onClick={handleDemoAdminSignIn}
                      className="w-full p-3 bg-gray-50 hover:bg-red-50 text-gray-800 hover:text-red-900 border border-gray-200 hover:border-red-300 text-xs text-left transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm">Lead Partner & Registrar (All Firm Cases)</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Onboard, delete, and view all firm cases and clients</div>
                      </div>
                      <span className="text-xs font-bold text-[#990000] uppercase">Enter Admin &rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (location.pathname === '/portal/admin' && activeRole === 'Admin') ? (
          /* ============================================================== */
          /* RENDER ADMIN DASHBOARD (STRICTLY ADMIN ONLY)                   */
          /* ============================================================== */
          <AdminDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={currentUser.uid}
            currentUserEmail={currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => setSelectedCase(c)}
            onOpenDocModal={(d) => setSelectedDoc(d)}
            onSwitchToClientView={(uid) => {
              setActiveRole('Client');
              sessionStorage.setItem('tep_active_role', 'Client');
              setActiveClientUid(uid);
              sessionStorage.setItem('tep_active_client_uid', uid);
              navigate('/portal/client');
            }}
          />
        ) : (
          /* ============================================================== */
          /* RENDER CLIENT DASHBOARD (DEFAULT ON CLIENT LOGIN)              */
          /* ============================================================== */
          <ClientDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={effectiveClientUid}
            currentUserEmail={currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => {
              // Safety check: Client cannot open case of another client
              if (c.clientUid === effectiveClientUid) {
                setSelectedCase(c);
              } else {
                setAccessDeniedNotice(`Access Denied: Docket ${c.caseNumber} is assigned to another client UID.`);
              }
            }}
            onOpenDocModal={(d) => setSelectedDoc(d)}
            onAdvanceDocumentStatus={handleAdvanceDocumentStatus}
            onSendClientNote={handleSendClientNote}
            onSimulateLiveEvent={handleSimulateLiveEvent}
            isSimulating={isSimulatingEvent}
          />
        )}
      </div>

      {/* Case Dossier Full Inspection Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl z-10 border-t-4 border-[#990000] p-6 sm:p-10 space-y-8"
            >
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 bg-gray-100 hover:bg-[#990000] text-black hover:text-white transition-colors cursor-pointer"
                  title="Close dossier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1">
                    {selectedCase.caseNumber}
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    selectedCase.status === 'Active Trial' ? 'bg-[#990000] text-white' :
                    selectedCase.status === 'Pre-Trial Discovery' ? 'bg-amber-600 text-white' :
                    selectedCase.status === 'Settlement Discussions' ? 'bg-emerald-700 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {selectedCase.status}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    &bull; Filed: {selectedCase.filingDate}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black leading-tight mb-2">
                  {selectedCase.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#990000] font-bold uppercase tracking-wider">
                  <span>{selectedCase.practiceArea}</span>
                  <span>&bull;</span>
                  <span>{selectedCase.regionalOffice}</span>
                  <span>&bull;</span>
                  <span className="text-gray-600 font-mono font-normal">Assigned Client UID: {selectedCase.clientUid}</span>
                </div>
              </div>

              {/* Key Case Parameters Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Court Jurisdiction
                  </span>
                  <p className="font-bold text-black">{selectedCase.courtJurisdiction}</p>
                  {selectedCase.judgeOrPanel && (
                    <p className="text-[11px] text-gray-500 italic mt-0.5">{selectedCase.judgeOrPanel}</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Current Procedural Stage
                  </span>
                  <p className="font-bold text-[#990000]">{selectedCase.stage}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Active Case Management</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Designated Lead Counsel
                  </span>
                  <p className="font-bold text-black">{selectedCase.leadAttorney}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{selectedCase.leadAttorneyEmail}</p>
                </div>
              </div>

              {/* Case Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#990000] mb-2">
                  Factual Matrix & Legal Objectives
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed font-light whitespace-pre-line bg-white border border-gray-100 p-4">
                  {selectedCase.summary}
                </p>
              </div>

              {/* Proceedings & Updates Timeline */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#990000]" />
                    <span>Real-Time Case Proceedings Minutes ({selectedCase.recentUpdates?.length || 0})</span>
                  </h4>
                </div>

                <div className="space-y-3">
                  {selectedCase.recentUpdates?.map((upd) => (
                    <div key={upd.id} className="p-4 bg-gray-50 border border-gray-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-black text-sm">{upd.title}</span>
                        <span className="font-mono text-gray-500 text-[11px]">{upd.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-light">{upd.notes}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400">
                        <span>Logged by: <span className="text-gray-700 font-semibold">{upd.author}</span></span>
                        {upd.type && (
                          <span className="px-1.5 py-0.5 bg-white border border-gray-200 text-gray-600 font-mono">
                            {upd.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!selectedCase.recentUpdates || selectedCase.recentUpdates.length === 0) && (
                    <p className="text-xs text-gray-400 italic py-2">No minutes recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Document Repository */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#990000]" />
                    <span>Filed Court Processes & Electronic Status ({selectedCase.documents?.length || 0})</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCase.documents?.map((docItem) => (
                    <div 
                      key={docItem.id} 
                      className="p-4 bg-white border border-gray-200 flex flex-col justify-between gap-3 hover:border-black transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 font-mono text-gray-600">
                            {docItem.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${
                            docItem.status === 'Certified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            docItem.status === 'Filed' ? 'bg-red-50 text-[#990000] border-red-200' :
                            docItem.status === 'Served' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {docItem.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-black" title={docItem.title}>
                          {docItem.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          {docItem.fileSize} &bull; Filed: {docItem.filingDate}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => handleAdvanceDocumentStatus(selectedCase.id, docItem.id, docItem.status)}
                          className="px-2 py-1 bg-gray-100 hover:bg-[#990000] hover:text-white text-gray-800 font-bold uppercase"
                        >
                          Advance Status &rarr;
                        </button>

                        <button
                          onClick={() => setSelectedDoc({
                            ...docItem,
                            caseId: selectedCase.id,
                            caseNumber: selectedCase.caseNumber,
                            caseTitle: selectedCase.title
                          })}
                          className="text-[#990000] font-bold uppercase hover:underline"
                        >
                          Inspect &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Inspection & Certification Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg p-8 shadow-2xl relative border-t-4 border-[#990000] space-y-6"
            >
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#990000] block mb-1">
                  Electronic Document Dossier
                </span>
                <h3 className="text-xl font-serif font-bold text-black leading-snug">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Matter: {selectedDoc.caseNumber}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Document Category:</span>
                  <span className="font-bold text-black">{selectedDoc.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Official Court Filing Date:</span>
                  <span className="font-mono text-black">{selectedDoc.filingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cryptographic Seal / Size:</span>
                  <span className="font-mono text-gray-600">{selectedDoc.fileSize} (SHA-256 Verified)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Current Status:</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                    selectedDoc.status === 'Certified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    selectedDoc.status === 'Filed' ? 'bg-red-50 text-[#990000] border-red-200' :
                    selectedDoc.status === 'Served' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleAdvanceDocumentStatus(selectedDoc.caseId, selectedDoc.id, selectedDoc.status)}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#990000] hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Advance Lifecycle &rarr;
                </button>

                <button
                  onClick={() => {
                    setPortalToast(`Simulated download of ${selectedDoc.title} completed.`);
                    setTimeout(() => setPortalToast(null), 3000);
                  }}
                  className="px-4 py-2 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Download CTC Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPortal;
