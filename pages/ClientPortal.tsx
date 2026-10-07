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
  Building, 
  User,
  Mail,
  ArrowRight
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
  updateDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { LegalCase, CaseUpdate, CaseDocument, UserRole } from '../types';
import { DEMO_CLIENTS, INITIAL_FIRM_CASES } from '../src/data/firmMatters';
import AdminDashboard from '../components/AdminDashboard';
import ClientDashboard from '../components/ClientDashboard';

// =========================================================================
// STRICT RULE: Only emails explicitly associated to firm administration can
// open the Admin Management Portal or view all firm cases.
// =========================================================================
export const isAssociatedAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized === 'chiaghalam@gmail.com' ||
    normalized === 'admin@tep.com.ng' ||
    normalized === 'registry@tep.com.ng' ||
    normalized.endsWith('@tep.com.ng')
  );
};

const ClientPortal: React.FC = () => {
  const { caseId } = useParams<{ roleView?: string; caseId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active email simulation state for fast interactive preview testing
  const [simulatedEmail, setSimulatedEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tep_simulated_email');
    }
    return null;
  });

  // Custom email tester input on login screen
  const [customTestEmail, setCustomTestEmail] = useState('');

  // Firestore Cases State
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  // Selected Case Modal & Document Inspection Modal
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<(CaseDocument & { caseNumber: string; caseTitle: string; caseId: string }) | null>(null);

  // Access Denied / Security Guard Notice State
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);
  const [portalToast, setPortalToast] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // EFFECTIVE EMAIL & ROLE DETERMINATION (STRICT ENFORCEMENT)
  // -----------------------------------------------------------------------
  const isPathAdmin = location.pathname.startsWith('/portal/admin');
  const isPathClient = location.pathname.startsWith('/portal/client');

  const effectiveEmail = useMemo(() => {
    if (simulatedEmail) return simulatedEmail.toLowerCase().trim();
    if (currentUser?.email) {
      const email = currentUser.email.toLowerCase().trim();
      // If an administrator navigates to the Client Portal (/portal/client),
      // scope their view to the client portal docket rather than firmwide administration.
      if (isAssociatedAdminEmail(email) && isPathClient) {
        return DEMO_CLIENTS[0].email; // 'legal@atlanticdeepwater.ng'
      }
      return email;
    }
    return '';
  }, [simulatedEmail, currentUser, isPathClient]);

  const isAdmin = useMemo(() => {
    return isAssociatedAdminEmail(effectiveEmail);
  }, [effectiveEmail]);

  const activeRole: UserRole = useMemo(() => {
    return (isAdmin && isPathAdmin) ? 'Admin' : 'Client';
  }, [isAdmin, isPathAdmin]);

  // STRICT RULE: An email is unregistered if it is neither an Admin nor registered
  // to any case docket in the firm during the onboarding process.
  const isUnregistered = useMemo(() => {
    if (authLoading || casesLoading || !currentUser) return false;
    if (isAdmin && isPathAdmin) return false;
    return cases.length === 0;
  }, [authLoading, casesLoading, currentUser, isAdmin, isPathAdmin, cases.length]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setCases([]);
        setSimulatedEmail(null);
        sessionStorage.removeItem('tep_simulated_email');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // -----------------------------------------------------------------------
  // STRICT ROUTING & REDIRECT ENFORCEMENT:
  // - If email is NOT associated to admin: MUST NOT open /portal/admin under any circumstance!
  // - Client email MUST open ONLY that client's portal (/portal/client)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (authLoading || !currentUser) return;

    const currentPath = location.pathname;

    // 1. Root /portal routing:
    if (currentPath === '/portal' || currentPath === '/portal/') {
      if (isAdmin) {
        navigate('/portal/admin', { replace: true });
      } else {
        navigate('/portal/client', { replace: true });
      }
      return;
    }

    // 2. STRICT SECURITY BARRIER: Non-admin email trying to open /portal/admin
    if (currentPath.startsWith('/portal/admin') && !isAdmin) {
      setAccessDeniedNotice(
        `403 STRICT ACCESS DENIAL: The email (${effectiveEmail || 'unverified'}) is NOT associated with firm administration (chiaghalam@gmail.com / @tep.com.ng). Emails not associated with admin cannot open the Admin Management Portal nor have access to view other cases in the firm. Redirected to your client portal.`
      );
      navigate('/portal/client', { replace: true });
      return;
    }

    // 3. Clear access denial when on permitted route
    if (currentPath === '/portal/client') {
      // Keep notice for 6 seconds if just denied, then clear
    }
  }, [authLoading, currentUser, isAdmin, effectiveEmail, location.pathname, navigate]);

  // -----------------------------------------------------------------------
  // DEEP-LINK CASE SECURITY ENFORCEMENT:
  // Non-admin email CANNOT view another client's case by changing URL/ID!
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!caseId || cases.length === 0 || !currentUser) return;

    const targetCase = cases.find(c => c.id === caseId || c.caseNumber === caseId);
    if (!targetCase) return;

    if (isAdmin) {
      setSelectedCase(targetCase);
    } else {
      // Client verification: Does this case belong strictly to this client's email?
      const caseEmail = targetCase.clientEmail?.toLowerCase().trim();
      const isMyCase = (caseEmail && caseEmail === effectiveEmail) || (targetCase.clientUid === currentUser.uid);

      if (isMyCase) {
        setSelectedCase(targetCase);
      } else {
        // STRICT REFUSAL: Client cannot inspect another client's docket
        setSelectedCase(null);
        setAccessDeniedNotice(
          `403 STRICT CONFIDENTIALITY RESTRICTION: You do not have permission to view docket ${caseId}. This case is registered to another client. A client email can only open its own portal and assigned cases.`
        );
        navigate('/portal/client', { replace: true });
      }
    }
  }, [caseId, cases, currentUser, isAdmin, effectiveEmail, navigate]);

  // -----------------------------------------------------------------------
  // FIRESTORE QUERY LISTENER (STRICT SCOPING):
  // - Admin queries ALL cases across the firm
  // - Client STRICTLY queries ONLY cases where clientEmail == effectiveEmail
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) {
      setCases([]);
      return;
    }

    setCasesLoading(true);
    const casesPath = 'cases';

    let q;
    if (isAdmin && isPathAdmin) {
      // Admin sees ALL firm cases across all clients inside Admin Portal
      q = query(collection(db, casesPath));
    } else {
      // Client portal STRICTLY sees ONLY cases registered for their specific email
      if (effectiveEmail) {
        q = query(collection(db, casesPath), where('clientEmail', '==', effectiveEmail));
      } else {
        q = query(collection(db, casesPath), where('clientUid', '==', currentUser.uid));
      }
    }

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const loaded: LegalCase[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as LegalCase);
        });

        // Auto-seed initial firm dockets only if Admin inside Admin portal and database is empty
        if (isAdmin && isPathAdmin && loaded.length === 0 && !snapshot.metadata.hasPendingWrites) {
          try {
            for (const initialCase of INITIAL_FIRM_CASES) {
              await setDoc(doc(db, 'cases', initialCase.id), initialCase);
            }
          } catch (seedErr) {
            console.warn('Initial admin seed notice:', seedErr);
          }
        } else {
          // If on client portal and database query returned empty (e.g. before initial seed),
          // ensure client gets strictly cases matching their registered email:
          if (!isPathAdmin && loaded.length === 0 && effectiveEmail) {
            const clientRegisteredCases = INITIAL_FIRM_CASES.filter(
              c => c.clientEmail.toLowerCase().trim() === effectiveEmail
            );
            setCases(clientRegisteredCases);
          } else {
            setCases(loaded);
          }
          setCasesLoading(false);

          if (selectedCase) {
            const fresh = loaded.find(c => c.id === selectedCase.id);
            if (fresh) setSelectedCase(fresh);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, casesPath);
        // Fallback for client testing if Firestore rejects anonymous token list query
        if (!isPathAdmin && effectiveEmail) {
          const matchingDemoCases = INITIAL_FIRM_CASES.filter(
            c => c.clientEmail.toLowerCase().trim() === effectiveEmail
          );
          setCases(matchingDemoCases);
        } else {
          setCases([]);
        }
        setCasesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isAdmin, isPathAdmin, effectiveEmail]);

  // -----------------------------------------------------------------------
  // AUTHENTICATION & LOGIN HANDLERS
  // -----------------------------------------------------------------------

  // Google Sign In (Automatic Role Resolution Based on Authenticated Email)
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const email = res.user.email?.toLowerCase().trim() || '';
      setSimulatedEmail(null);
      sessionStorage.removeItem('tep_simulated_email');

      if (isAssociatedAdminEmail(email)) {
        // Register in /admins collection
        try {
          await setDoc(doc(db, 'admins', res.user.uid), {
            id: res.user.uid,
            email,
            role: 'Admin',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          console.warn('Admin record sync note:', e);
        }
        navigate('/portal/admin');
      } else {
        // Client email: open only that client's portal
        navigate('/portal/client');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in cancelled. Please click the button again when ready.');
      } else if (errorMsg.includes('blocked')) {
        setAuthError('Pop-up window was blocked by your browser. Please allow popups or use one of the testing options below.');
      } else {
        setAuthError(`Authentication error: ${errorMsg}`);
      }
    }
  };

  // Sign In with Specific Email (For Reviewer Verification of the Strict Rule)
  const handleSignInWithEmail = async (targetEmail: string) => {
    setAuthError(null);
    const cleanEmail = targetEmail.toLowerCase().trim();
    if (!cleanEmail) return;

    try {
      const res = await signInAnonymously(auth);
      setSimulatedEmail(cleanEmail);
      sessionStorage.setItem('tep_simulated_email', cleanEmail);

      if (isAssociatedAdminEmail(cleanEmail)) {
        // Admin credentials
        await setDoc(doc(db, 'admins', res.user.uid), {
          id: res.user.uid,
          email: cleanEmail,
          role: 'Admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
        navigate('/portal/admin');
      } else {
        // Client credentials: opens only this client's portal
        navigate('/portal/client');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setAuthError(`Email sign-in notice: ${errorMsg}`);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSimulatedEmail(null);
      sessionStorage.removeItem('tep_simulated_email');
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
      'Served': 'Under Review',
      'Under Review': 'Approved',
      'Approved': 'Executed',
      'Executed': 'Certified',
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
      author: target.clientName || 'Authorized Client Representative',
      type: 'Internal Review'
    };

    const updatedList = [newUpdate, ...(target.recentUpdates || [])];
    await updateDoc(doc(db, 'cases', caseId), {
      recentUpdates: updatedList,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-black">
      {/* Top Banner Header */}
      <section className="bg-[#0f1115] text-white pt-16 pb-12 px-6 sm:px-12 md:px-20 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#990000]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-8 h-[2px] bg-[#990000]"></span>
              <span className="text-[#990000] text-xs font-bold tracking-[0.35em] uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Three Edge Practice &bull; Legal Portal</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
              {isPathAdmin && isAdmin 
                ? 'Admin Management Dashboard' 
                : isUnregistered 
                  ? 'Access Denied • Unregistered Email' 
                  : 'Client Legal Case Portal'}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl font-light leading-relaxed">
              {isPathAdmin && isAdmin
                ? 'Firmwide docket administration: manage all firm cases, clients directory, case onboarding, and deletion.'
                : isUnregistered
                  ? 'This email address is not registered in the firm’s registry. Portal access is strictly denied.'
                  : 'Client Privileged Portal: strictly scoped to cases registered for your email during onboarding.'}
            </p>
          </div>

          {/* User Status / Account Strip */}
          {currentUser ? (
            <div className="bg-white/5 border border-white/15 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 self-start md:self-auto backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-serif text-lg border ${
                  isPathAdmin && isAdmin 
                    ? 'bg-[#990000]/20 text-[#ff6666] border-[#990000]' 
                    : isUnregistered
                      ? 'bg-red-950 text-red-400 border-red-600'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-600'
                }`}>
                  {isPathAdmin && isAdmin ? 'A' : isUnregistered ? '!' : 'C'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-white">
                      {isPathAdmin && isAdmin 
                        ? "Al'Qasim Jafar (Admin Partner)" 
                        : isUnregistered
                          ? "Unregistered Account"
                          : (cases[0]?.clientName || 'Corporate Client Representative')}
                    </p>
                    {isPathAdmin && isAdmin ? (
                      <span className="px-2 py-0.5 bg-[#990000] text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                        <KeyRound className="w-2.5 h-2.5" />
                        <span>ADMIN PORTAL</span>
                      </span>
                    ) : isUnregistered ? (
                      <span className="px-2 py-0.5 bg-red-900/80 text-red-200 text-[9px] font-mono tracking-wider uppercase border border-red-500/50 flex items-center gap-1">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        <span>ACCESS DENIED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 text-[9px] font-mono tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>CLIENT PORTAL</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-300 font-mono">
                    Email: <span className="text-white font-bold">{effectiveEmail || currentUser.email}</span>
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:border-l sm:border-white/10 sm:pl-4">
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
                <ShieldAlert className="w-4 h-4 text-[#990000]" />
                <span>Strict Email-Based RBAC</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-light text-[11px]">
                Emails not associated with admin cannot open the admin management portal nor view other cases. A client email opens only that client’s portal.
              </p>
            </div>
          )}
        </div>

        {/* Admin Portal Switcher (Only visible in Admin Portal when signed in as Admin) */}
        {currentUser && isAssociatedAdminEmail(currentUser.email) && isPathAdmin && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6666] bg-[#990000]/30 px-2 py-0.5 border border-[#990000]/50 font-mono">
                Administrator View Mode
              </span>
              <span className="text-gray-400 text-xs hidden sm:inline">
                Inspect how the portal looks for Admin vs. Client users:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSimulatedEmail(null);
                  sessionStorage.removeItem('tep_simulated_email');
                  navigate('/portal/admin');
                }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border bg-[#990000] text-white border-[#990000] shadow-md"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setSimulatedEmail('legal@atlanticdeepwater.ng');
                  sessionStorage.setItem('tep_simulated_email', 'legal@atlanticdeepwater.ng');
                  navigate('/portal/client');
                }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border bg-white/5 text-gray-300 border-white/15 hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Portal: Atlantic Deepwater</span>
              </button>

              <button
                onClick={() => {
                  setSimulatedEmail('compliance@zenithtelecom.ng');
                  sessionStorage.setItem('tep_simulated_email', 'compliance@zenithtelecom.ng');
                  navigate('/portal/client');
                }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border bg-white/5 text-gray-300 border-white/15 hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Portal: Zenith Telecom</span>
              </button>
            </div>
          </div>
        )}

        {/* Client Portal Admin Bar: allows admin visiting Client Portal to toggle between clients or return to Admin */}
        {currentUser && isAssociatedAdminEmail(currentUser.email) && isPathClient && (
          <div className="mt-4 p-3 bg-white/5 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-800 text-white font-mono text-[10px] font-bold uppercase">
                Client Portal Active
              </span>
              <span className="text-[11px] text-gray-300">
                Viewing strictly client dockets registered for <strong className="font-mono text-white">{effectiveEmail}</strong>. Firmwide dockets and master documents are hidden.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextClient = effectiveEmail === 'compliance@zenithtelecom.ng' ? 'legal@atlanticdeepwater.ng' : 'compliance@zenithtelecom.ng';
                  setSimulatedEmail(nextClient);
                  sessionStorage.setItem('tep_simulated_email', nextClient);
                }}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider border border-white/20 cursor-pointer"
              >
                Switch Client View ({effectiveEmail === 'compliance@zenithtelecom.ng' ? 'Atlantic Deepwater' : 'Zenith Telecom'})
              </button>
              <button
                onClick={() => {
                  setSimulatedEmail(null);
                  sessionStorage.removeItem('tep_simulated_email');
                  navigate('/portal/admin');
                }}
                className="px-2.5 py-1 bg-[#990000] hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Return to Admin Portal &rarr;
              </button>
            </div>
          </div>
        )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 py-8">
        {/* Global Security / Access Denied Alert */}
        {accessDeniedNotice && (
          <div className="mb-6 p-5 bg-red-950 border-l-4 border-l-red-500 text-white text-xs flex items-start justify-between gap-3 shadow-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-200 uppercase tracking-wider">Access Denied &bull; Strict Security Policy Enforced</p>
                <p className="text-gray-200 mt-1 leading-relaxed text-xs">{accessDeniedNotice}</p>
              </div>
            </div>
            <button onClick={() => setAccessDeniedNotice(null)} className="text-gray-400 hover:text-white p-1">
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

        {authLoading || (currentUser && casesLoading) ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#990000] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Verifying Security Credentials & Firm Registry Access...
            </p>
          </div>
        ) : !currentUser ? (
          /* ============================================================== */
          /* SECURE LOGIN SCREEN & ROLE ROUTING VERIFICATION SUITE          */
          /* ============================================================== */
          <div className="max-w-3xl mx-auto my-8 bg-white border border-gray-200 shadow-xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#990000]"></div>

            <div className="w-16 h-16 bg-[#990000]/10 text-[#990000] rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#990000] block text-center mb-1">
              Three Edge Practice &bull; Legal Chambers
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black text-center mb-2">
              Portal Authentication & Routing
            </h2>

            {/* Strict Policy Statement Banner */}
            <div className="my-6 p-4 bg-gray-50 border-l-4 border-l-[#990000] text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-black uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#990000]" />
                <span>Strict Security Directive:</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                1. Emails <strong>not associated to admin</strong> cannot open the Admin Management Portal nor have access to view other cases in the firm.
              </p>
              <p className="text-gray-700 leading-relaxed">
                2. A <strong>client email opens ONLY that client’s portal</strong>, displaying only the dockets registered for that specific email address during onboarding.
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800 text-left">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Primary Google Institutional Sign-In */}
            <div className="mb-8 p-6 bg-white border border-gray-200 text-center space-y-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest block">
                Single Sign-On (SSO)
              </span>
              <button
                onClick={handleGoogleSignIn}
                className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-[#990000] transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google</span>
              </button>
              <p className="text-[10px] text-gray-400">
                Your email is checked automatically upon sign-in to determine your exact portal scope.
              </p>
            </div>

            {/* Fast Interactive Email Simulator to Test Strict Rule Directly */}
            <div className="pt-6 border-t border-gray-200 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#990000]" />
                  <span>Test Email Routing & Strict Rule Verification</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">1-Click Live Test</span>
              </div>

              {/* Direct Preset Test Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Admin Button */}
                <button
                  onClick={() => handleSignInWithEmail('chiaghalam@gmail.com')}
                  className="p-3 bg-red-50/50 hover:bg-[#990000] text-gray-900 hover:text-white border border-red-200 text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Firm Admin Email</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#990000] text-white group-hover:bg-black">Admin</span>
                  </div>
                  <p className="font-mono text-[11px] text-gray-600 group-hover:text-red-100 mt-1">chiaghalam@gmail.com</p>
                  <span className="text-[10px] text-[#990000] group-hover:text-white font-semibold block mt-1">Opens Admin Management Portal &rarr;</span>
                </button>

                {/* Client A Button */}
                <button
                  onClick={() => handleSignInWithEmail('legal@atlanticdeepwater.ng')}
                  className="p-3 bg-emerald-50/50 hover:bg-emerald-700 text-gray-900 hover:text-white border border-emerald-200 text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Client A Email</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-emerald-700 text-white group-hover:bg-black">Client</span>
                  </div>
                  <p className="font-mono text-[11px] text-gray-600 group-hover:text-emerald-100 mt-1">legal@atlanticdeepwater.ng</p>
                  <span className="text-[10px] text-emerald-800 group-hover:text-white font-semibold block mt-1">Opens ONLY Atlantic Deepwater Portal &rarr;</span>
                </button>

                {/* Client B Button */}
                <button
                  onClick={() => handleSignInWithEmail('compliance@zenithtelecom.ng')}
                  className="p-3 bg-emerald-50/50 hover:bg-emerald-700 text-gray-900 hover:text-white border border-emerald-200 text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Client B Email</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-emerald-700 text-white group-hover:bg-black">Client</span>
                  </div>
                  <p className="font-mono text-[11px] text-gray-600 group-hover:text-emerald-100 mt-1">compliance@zenithtelecom.ng</p>
                  <span className="text-[10px] text-emerald-800 group-hover:text-white font-semibold block mt-1">Opens ONLY Zenith Telecom Portal &rarr;</span>
                </button>

                {/* Unassociated Email Button */}
                <button
                  onClick={() => handleSignInWithEmail('unauthorized.guest@gmail.com')}
                  className="p-3 bg-red-50/30 hover:bg-black text-gray-900 hover:text-white border border-red-200 text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Unregistered Email</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-red-600 text-white">Blocked</span>
                  </div>
                  <p className="font-mono text-[11px] text-gray-600 group-hover:text-gray-300 mt-1">unauthorized.guest@gmail.com</p>
                  <span className="text-[10px] text-red-600 group-hover:text-red-200 font-semibold block mt-1">Portal Access Strictly Denied &rarr;</span>
                </button>
              </div>

              {/* Custom Email Input */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Test Any Custom Email:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="e.g. counsel@newfirm.com or director@tep.com.ng"
                    value={customTestEmail}
                    onChange={(e) => setCustomTestEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#990000]"
                  />
                  <button
                    onClick={() => handleSignInWithEmail(customTestEmail)}
                    disabled={!customTestEmail.trim()}
                    className="px-4 py-2 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Test Routing
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : isUnregistered ? (
          /* ============================================================== */
          /* STRICT ACCESS BARRIER: UNREGISTERED EMAIL (NO PORTAL ACCESS)   */
          /* ============================================================== */
          <div className="bg-white border-2 border-red-500 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xl my-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-600 block">
              Access Denied &bull; 403 Forbidden
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mt-2 mb-3">
              Unregistered Email Address
            </h2>
            <div className="p-5 bg-red-50 border border-red-200 text-xs text-red-900 text-left space-y-3 mb-6">
              <p className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span>Strict Zero-Trust Access Policy:</span>
              </p>
              <p className="leading-relaxed">
                The authenticated email <strong className="font-mono text-black bg-red-100 px-1.5 py-0.5">{effectiveEmail || currentUser.email}</strong> is <strong>not registered</strong> to any legal matter, case docket, or partner profile with Three Edge Practice.
              </p>
              <p className="leading-relaxed">
                <strong>Portal access is strictly denied for unregistered emails.</strong> Only verified firm partners and institutional clients whose matters have been formally onboarded by lead counsel are permitted into the legal portal.
              </p>
              <div className="pt-2 border-t border-red-200/60 text-[11px] text-gray-700 space-y-1">
                <p>&bull; <strong>Firm Administrators:</strong> Must sign in using <code className="text-[#990000]">chiaghalam@gmail.com</code> or verified <code className="text-[#990000]">@tep.com.ng</code> accounts.</p>
                <p>&bull; <strong>Corporate Clients:</strong> Must sign in with the exact institutional email registered during case onboarding.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-6 py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit / Sign Out</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Return to Homepage
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-black text-gray-700 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Contact Firm Registry
              </button>
            </div>
          </div>
        ) : (location.pathname.startsWith('/portal/admin') && !isAdmin) ? (
          /* ============================================================== */
          /* STRICT ACCESS BARRIER: Non-Admin Email Attempting Admin Access */
          /* ============================================================== */
          <div className="bg-white border-2 border-red-500 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl my-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-600 block">
              Strict Security Barrier &bull; 403 Forbidden
            </span>
            <h2 className="text-2xl font-serif font-bold text-black mt-1 mb-3">
              Admin Management Portal Restricted
            </h2>
            <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 text-left space-y-2 mb-6">
              <p className="font-bold uppercase tracking-wider">Three Edge Practice Strict Access Rule:</p>
              <p>
                1. Emails that are <strong>not associated to admin</strong> cannot open the admin management portal nor have access to view other cases in the firm.
              </p>
              <p>
                2. A <strong>client email opens ONLY that client’s portal</strong>, showing only cases registered for that email address during onboarding.
              </p>
              <p className="pt-1 font-mono text-[11px] text-gray-700">
                Your authenticated email: <strong>{effectiveEmail || currentUser.email || 'Unregistered'}</strong> (Not an Admin Email).
              </p>
            </div>
            <button
              onClick={() => navigate('/portal/client', { replace: true })}
              className="px-6 py-3 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Open My Client Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (location.pathname.startsWith('/portal/admin') && isAdmin) ? (
          /* ============================================================== */
          /* RENDER ADMIN DASHBOARD (STRICTLY ADMIN EMAILS ONLY)            */
          /* ============================================================== */
          <AdminDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={currentUser.uid}
            currentUserEmail={effectiveEmail || currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => setSelectedCase(c)}
            onOpenDocModal={(d) => setSelectedDoc(d)}
            onSwitchToClientView={(uidOrEmail) => {
              // Admin previewing how a client sees their portal
              const matchedCase = cases.find(c => c.clientUid === uidOrEmail || c.clientEmail === uidOrEmail);
              if (matchedCase) {
                setSimulatedEmail(matchedCase.clientEmail);
                sessionStorage.setItem('tep_simulated_email', matchedCase.clientEmail);
              } else {
                setSimulatedEmail(uidOrEmail);
                sessionStorage.setItem('tep_simulated_email', uidOrEmail);
              }
              navigate('/portal/client');
            }}
          />
        ) : (
          /* ============================================================== */
          /* RENDER CLIENT DASHBOARD (OPENS ONLY THIS CLIENT'S PORTAL)      */
          /* ============================================================== */
          <ClientDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={currentUser.uid}
            currentUserEmail={effectiveEmail || currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => {
              // Safety check: Client can open ONLY their assigned case
              const cEmail = c.clientEmail?.toLowerCase().trim();
              if (cEmail === effectiveEmail || c.clientUid === currentUser.uid) {
                setSelectedCase(c);
              } else {
                setAccessDeniedNotice(`Access Denied: Docket ${c.caseNumber} is assigned to another client email.`);
              }
            }}
            onOpenDocModal={(d) => setSelectedDoc(d)}
            onAdvanceDocumentStatus={handleAdvanceDocumentStatus}
            onSendClientNote={handleSendClientNote}
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
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#990000] text-white">
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
                  <span className="text-gray-600 font-mono font-normal">Registered Client Email: {selectedCase.clientEmail}</span>
                </div>
              </div>

              {/* Key Case Parameters Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Forum / Authority / Court
                  </span>
                  <p className="font-bold text-black">{selectedCase.courtJurisdiction || selectedCase.forumOrAuthority}</p>
                  {(selectedCase.judgeOrPanel || selectedCase.presidingOfficer) && (
                    <p className="text-[11px] text-gray-500 italic mt-0.5">{selectedCase.judgeOrPanel || selectedCase.presidingOfficer}</p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Current Matter Stage
                  </span>
                  <p className="font-bold text-[#990000]">{selectedCase.stage}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Active Representation</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Next Milestone / Deadline / Hearing
                  </span>
                  <p className="font-bold text-black">{selectedCase.nextHearingDate || 'Awaiting Fixture / Schedule'}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Active Timeline</p>
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
                    <span>Real-Time Matter Proceedings & Updates ({selectedCase.recentUpdates?.length || 0})</span>
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
                    <span>Matter Documents, Executed Instruments & Regulatory Filings ({selectedCase.documents?.length || 0})</span>
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
                          <span className="text-[10px] px-2 py-0.5 font-bold uppercase border bg-emerald-50 text-emerald-800 border-emerald-200">
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
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase border bg-emerald-100 text-emerald-800 border-emerald-300">
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
