import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye,
  EyeOff,
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
  ArrowRight,
  RefreshCw,
  Send
} from 'lucide-react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut, 
  sendEmailVerification,
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
  getDocs,
  updateDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { LegalCase, CaseUpdate, CaseDocument, ClientProfile, UserRole } from '../types';
import AdminDashboard from '../components/AdminDashboard';
import ClientDashboard from '../components/ClientDashboard';

// =========================================================================
// STRICT ADMINISTRATOR AUTHORIZATION
// The following three accounts are designated administrators:
// - chiaghalam@gmail.com
// - admin@tep.com.ng
// - registry@tep.com.ng
// Other @tep.com.ng accounts must NOT automatically receive administrator privileges.
// They receive administrative access ONLY after explicit authorization by an existing admin.
// =========================================================================
import { 
  DESIGNATED_ADMIN_EMAILS, 
  isDesignatedAdminEmail, 
  isAssociatedAdminEmail, 
  verifyUserAuthorization, 
  UNREGISTERED_ERROR_MESSAGE 
} from '../src/authAuthorization';

export { DESIGNATED_ADMIN_EMAILS, isDesignatedAdminEmail, isAssociatedAdminEmail };

type AuthorizationState = 
  | 'idle' 
  | 'resolving' 
  | 'admin' 
  | 'client' 
  | 'unverified_email' 
  | 'unregistered' 
  | 'deactivated' 
  | 'error';

const ClientPortal: React.FC = () => {
  const { caseId } = useParams<{ roleView?: string; caseId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication & Authorization State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthorizationState>('idle');
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  // Sign In / Password Reset State (Public self-registration permanently disabled)
  const [authMode, setAuthMode] = useState<'login' | 'forgot_password'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Firestore Cases State (strictly genuine data only)
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  // Modals & Notices
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<(CaseDocument & { caseNumber: string; caseTitle: string; caseId: string }) | null>(null);
  const [accessDeniedNotice, setAccessDeniedNotice] = useState<string | null>(null);
  const [portalToast, setPortalToast] = useState<string | null>(null);

  const isPathAdmin = location.pathname.startsWith('/portal/admin');
  const isPathClient = location.pathname.startsWith('/portal/client');

  // -------------------------------------------------------------------------
  // 1. GENUINE AUTHENTICATION & ZERO-TRUST AUTHORIZATION RESOLUTION
  // -------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setCases([]);
        setAuthLoading(false);
        setVerificationSent(false);
        return;
      }

      setAuthLoading(true);
      const authResult = await verifyUserAuthorization(user);

      if (authResult.status === 'unverified') {
        // Enforce verified email at boundary
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setCases([]);
        setAuthLoading(false);
        setAuthError('Institutional security protocols mandate verified email before portal entry. Please verify your email address.');
        return;
      }

      if (authResult.status === 'unregistered') {
        // REJECT UNREGISTERED USERS AT LOGIN BOUNDARY
        // Do not redirect to dashboard or display post-login access denied screen
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setCases([]);
        setAuthLoading(false);
        setAuthError(UNREGISTERED_ERROR_MESSAGE);
        return;
      }

      if (authResult.status === 'deactivated') {
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setCases([]);
        setAuthLoading(false);
        setAuthError(authResult.message);
        return;
      }

      if (authResult.status === 'error') {
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setCases([]);
        setAuthLoading(false);
        setAuthError(authResult.error);
        return;
      }

      // Authorized Identity
      setCurrentUser(user);
      if (authResult.status === 'admin') {
        setAuthState('admin');
      } else {
        setAuthState('client');
        setClientProfile(authResult.profile);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // -------------------------------------------------------------------------
  // 2. SECURE DASHBOARD ROUTING & PROTECTED URL GUARDS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (authLoading || authState === 'resolving' || authState === 'idle') return;

    const currentPath = location.pathname;

    // Root /portal routing
    if (currentPath === '/portal' || currentPath === '/portal/') {
      if (authState === 'admin') {
        navigate('/portal/admin', { replace: true });
      } else if (authState === 'client') {
        navigate('/portal/client', { replace: true });
      }
      return;
    }

    // Direct URL Guard: Non-admin attempting to access /portal/admin
    if (currentPath.startsWith('/portal/admin') && authState !== 'admin') {
      setAccessDeniedNotice(
        `403 STRICT ACCESS DENIAL: The authenticated account (${currentUser?.email || 'unverified'}) is NOT an authorized firm administrator. Administrative routes are protected by server-side access controls.`
      );
      if (authState === 'client') {
        navigate('/portal/client', { replace: true });
      }
      return;
    }
  }, [authLoading, authState, currentUser, location.pathname, navigate]);

  // -------------------------------------------------------------------------
  // 3. CONFIDENTIALITY DEEP-LINK CASE GUARD
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!caseId || cases.length === 0 || !currentUser) return;

    const targetCase = cases.find(c => c.id === caseId || c.caseNumber === caseId);
    if (!targetCase) return;

    if (authState === 'admin') {
      setSelectedCase(targetCase);
    } else if (authState === 'client') {
      const caseEmail = targetCase.clientEmail?.toLowerCase().trim();
      const userEmail = (currentUser.email || '').toLowerCase().trim();
      const isMyCase = (caseEmail && caseEmail === userEmail) || (targetCase.clientUid === currentUser.uid);

      if (isMyCase) {
        setSelectedCase(targetCase);
      } else {
        setSelectedCase(null);
        setAccessDeniedNotice(
          `403 CONFIDENTIALITY RESTRICTION: You do not have permission to view docket ${caseId}. This matter is registered to another client identity.`
        );
        navigate('/portal/client', { replace: true });
      }
    }
  }, [caseId, cases, currentUser, authState, navigate]);

  // -------------------------------------------------------------------------
  // 4. FIRESTORE DATA LOADING (GENUINE DATA ONLY — NO AUTOMATIC SEEDING)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser || (authState !== 'admin' && authState !== 'client')) {
      setCases([]);
      return;
    }

    setCasesLoading(true);
    const casesPath = 'cases';

    let q;
    if (authState === 'admin' && isPathAdmin) {
      // Authorized administrator loads all firm matters
      q = query(collection(db, casesPath));
    } else {
      // Approved client loads ONLY matters matching their authenticated verified email
      const userEmail = (currentUser.email || '').toLowerCase().trim();
      q = query(collection(db, casesPath), where('clientEmail', '==', userEmail));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: LegalCase[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as LegalCase);
        });

        // Genuine state: display honest records stored in Firebase (never substitute demo data)
        setCases(loaded);
        setCasesLoading(false);

        if (selectedCase) {
          const fresh = loaded.find(c => c.id === selectedCase.id);
          if (fresh) setSelectedCase(fresh);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, casesPath);
        setCases([]);
        setCasesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, authState, isPathAdmin]);

  // -------------------------------------------------------------------------
  // 5. AUTHENTICATION HANDLERS
  // -------------------------------------------------------------------------
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail || !authPassword) {
      setAuthError('Please enter both your email address and password.');
      return;
    }
    setIsSubmittingAuth(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
      const user = cred.user;
      if (!user) {
        setIsSubmittingAuth(false);
        return;
      }

      // Verify authorization at boundary
      const authResult = await verifyUserAuthorization(user);

      if (authResult.status === 'unverified') {
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setAuthError('Institutional security protocols mandate verified email before portal entry. Please verify your email address.');
        return;
      }

      if (authResult.status === 'unregistered') {
        // REJECT UNREGISTERED USER AT THE LOGIN BOUNDARY
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setAuthError(UNREGISTERED_ERROR_MESSAGE);
        return;
      }

      if (authResult.status === 'deactivated') {
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setClientProfile(null);
        setAuthError(authResult.message);
        return;
      }

      if (authResult.status === 'error') {
        await signOut(auth);
        setCurrentUser(null);
        setAuthState('idle');
        setAuthError(authResult.error);
        return;
      }

      // Authorized!
      setCurrentUser(user);
      if (authResult.status === 'admin') {
        setAuthState('admin');
        navigate('/portal/admin');
      } else {
        setAuthState('client');
        setClientProfile(authResult.profile);
        navigate('/portal/client');
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. If you are not yet registered, please contact registry@tep.com.ng to request authorization.');
      } else if (code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (code === 'auth/user-disabled') {
        setAuthError('This account has been disabled. Please contact firm administration.');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('Too many failed sign-in attempts. Please try again later or reset your password.');
      } else {
        setAuthError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);
    if (!authEmail.trim()) {
      setAuthError('Please enter your registered email address to receive password reset instructions.');
      return;
    }
    setIsSubmittingAuth(true);
    try {
      await sendPasswordResetEmail(auth, authEmail.trim());
      setAuthSuccessMessage(`Password reset instructions dispatched to ${authEmail.trim()}. Please check your email inbox.`);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/user-not-found') {
        setAuthError('No registered account found with that email address.');
      } else {
        setAuthError(err instanceof Error ? err.message : 'Unable to send password reset email.');
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSelectedCase(null);
      setSelectedDoc(null);
      navigate('/portal');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleSendVerification = async () => {
    if (!currentUser) return;
    try {
      await sendEmailVerification(currentUser);
      setVerificationSent(true);
      setPortalToast('Verification email dispatched. Please check your inbox and reload.');
      setTimeout(() => setPortalToast(null), 5000);
    } catch (err: unknown) {
      setAuthError(`Verification dispatch failed: ${err instanceof Error ? err.message : String(err)}`);
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

      setPortalToast(`Document status advanced to "${nextStatus}".`);
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
      author: target.clientName || clientProfile?.name || 'Authorized Client Representative',
      type: 'Client Instruction',
      visibility: 'Client Visible'
    };

    const updatedList = [newUpdate, ...(target.recentUpdates || [])];
    await updateDoc(doc(db, 'cases', caseId), {
      recentUpdates: updatedList,
      updatedAt: new Date().toISOString()
    });
  };

  // -------------------------------------------------------------------------
  // 6. RENDER
  // -------------------------------------------------------------------------
  // Loading State
  if (authLoading) {
    return (
      <div className="bg-[#f7f8fa] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#990000] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Connecting to Chambers Portal...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // UNAUTHENTICATED: CLEAN SIGN IN & CREATE ACCOUNT VIEW
  // All extraneous disclaimers, text walls & simulated principles removed.
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="bg-[#f7f8fa] min-h-screen text-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Firm Logo & Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <span className="text-3xl font-bold tracking-tight text-black flex items-center font-serif">
                TEP<span className="w-2 h-2 rounded-full bg-[#990000] ml-1"></span>
              </span>
            </div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#990000] uppercase mb-1">
              Three Edge Practice
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
              {authMode === 'login' && 'Sign in to Client Portal'}
              {authMode === 'forgot_password' && 'Reset your Password'}
            </h2>
            <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto">
              {authMode === 'login' && 'Enter your administrator-issued email and password to access privileged case dockets.'}
              {authMode === 'forgot_password' && 'Enter your registered email to receive official password reset instructions.'}
            </p>
          </div>

          {/* Clean Card */}
          <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-gray-200 shadow-xl rounded-xs relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#990000]"></div>

            {authError && (
              <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-l-red-600 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMessage && (
              <div className="mb-5 p-3.5 bg-emerald-50 border-l-4 border-l-emerald-600 flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{authSuccessMessage}</span>
              </div>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 pl-10 border border-gray-300 text-xs focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot_password'); setAuthError(null); setAuthSuccessMessage(null); }}
                      className="text-[11px] text-[#990000] hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-gray-300 text-xs focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 px-4 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmittingAuth ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* Institutional Access Notice */}
                <div className="pt-6 mt-6 border-t border-gray-100 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#990000]" />
                    <span>Administrator-Controlled Access</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto font-light">
                    Client accounts are provisioned exclusively by firm administrators for verified retainers. Public self-registration is permanently disabled.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Awaiting onboarding credentials? Contact <span className="font-mono text-gray-600 select-all">registry@tep.com.ng</span>
                  </p>
                </div>
              </form>
            )}

            {authMode === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 pl-10 border border-gray-300 text-xs focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3 px-4 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingAuth ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Password Reset Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="pt-5 mt-5 border-t border-gray-100 text-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccessMessage(null); }}
                    className="text-xs font-bold text-gray-600 hover:text-black transition-colors cursor-pointer"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED PORTAL VIEW
  // =========================================================================
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
                {authState === 'admin' && isPathAdmin
                  ? 'Admin Management Dashboard'
                  : authState === 'deactivated'
                    ? 'Access Denied • Account Deactivated'
                    : authState === 'unverified_email'
                      ? 'Verification Required • Email Confirmation'
                      : 'Client Legal Case Portal'}
              </h1>

              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl font-light leading-relaxed">
                {authState === 'admin' && isPathAdmin
                  ? 'Firmwide docket administration: client registry, matter onboarding, official case management, and court records.'
                  : authState === 'deactivated'
                    ? 'This client registration has been deactivated. Underlying client documents remain confidential.'
                    : authState === 'unverified_email'
                      ? 'Institutional security protocols mandate verified email before protected legal records can be accessed.'
                      : 'Client Privileged Portal: strictly scoped to matters assigned to your verified client identity.'}
              </p>
            </div>

            {/* Authenticated User Status Strip */}
            {currentUser && (
              <div className="bg-white/5 border border-white/15 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 self-start md:self-auto backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-serif text-lg border ${
                    authState === 'admin'
                      ? 'bg-[#990000]/20 text-[#ff6666] border-[#990000]'
                      : authState === 'client'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                        : 'bg-red-950 text-red-400 border-red-600'
                  }`}>
                    {authState === 'admin' ? 'A' : authState === 'client' ? 'C' : '!'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {authState === 'admin'
                          ? (currentUser.displayName || "Authorized Administrator")
                          : authState === 'client'
                            ? (clientProfile?.name || cases[0]?.clientName || currentUser.displayName || 'Authorized Client Representative')
                            : 'Unprivileged Identity'}
                      </p>
                      {authState === 'admin' ? (
                        <span className="px-2 py-0.5 bg-[#990000] text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                          <KeyRound className="w-2.5 h-2.5" />
                          <span>ADMIN AUTHORIZED</span>
                        </span>
                      ) : authState === 'client' ? (
                        <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 text-[9px] font-mono tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>CLIENT PORTAL</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-900/80 text-red-200 text-[9px] font-mono tracking-wider uppercase border border-red-500/50 flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" />
                          <span>ACCESS DENIED</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-300 font-mono">
                      Email: <span className="text-white font-bold">{currentUser.email}</span>
                      {currentUser.emailVerified && (
                        <span className="ml-1.5 text-[10px] text-emerald-400 font-sans font-semibold">(Verified)</span>
                      )}
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
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 py-8">
        {/* Global Security / Access Denied Notice */}
        {accessDeniedNotice && (
          <div className="mb-6 p-5 bg-red-950 border-l-4 border-l-red-500 text-white text-xs flex items-start justify-between gap-3 shadow-xl">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-200 uppercase tracking-wider">Security Policy Enforced</p>
                <p className="text-gray-200 mt-1 leading-relaxed text-xs">{accessDeniedNotice}</p>
              </div>
            </div>
            <button onClick={() => setAccessDeniedNotice(null)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
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
            <button onClick={() => setPortalToast(null)} className="text-emerald-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {authState === 'resolving' || casesLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#990000] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Verifying Security Credentials & Authorizations...
            </p>
          </div>
        ) : authState === 'unverified_email' ? (
          /* ================================================================ */
          /* ACCESS DENIED: UNVERIFIED EMAIL                                  */
          /* ================================================================ */
          <div className="bg-white border-2 border-amber-500 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xl my-8">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-300">
              <Mail className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 block">
              Email Verification Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mt-2 mb-3">
              Unverified Email Account
            </h2>
            <div className="p-5 bg-amber-50 border border-amber-200 text-xs text-amber-950 text-left space-y-3 mb-6">
              <p className="leading-relaxed">
                The authenticated account <strong className="font-mono text-black bg-amber-100 px-1.5 py-0.5">{currentUser.email}</strong> is not yet verified. Three Edge Practice security rules strictly require email verification before any client matter records can be decrypted or accessed.
              </p>
              <p className="leading-relaxed text-gray-700">
                Please verify your email address via the link sent to your inbox. Once verified, refresh this screen to proceed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSendVerification}
                disabled={verificationSent}
                className="w-full sm:w-auto px-6 py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{verificationSent ? 'Verification Dispatched' : 'Resend Verification Link'}</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>I Have Verified, Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-black text-gray-700 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : authState === 'deactivated' ? (
          /* ================================================================ */
          /* ACCESS DENIED: DEACTIVATED / SUSPENDED ACCOUNT                   */
          /* ================================================================ */
          <div className="bg-white border-2 border-red-500 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xl my-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-300">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-600 block">
              Access Suspended &bull; 403 Forbidden
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mt-2 mb-3">
              Account Deactivated
            </h2>
            <div className="p-5 bg-red-50 border border-red-200 text-xs text-red-900 text-left space-y-3 mb-6">
              <p className="leading-relaxed">
                Portal access for <strong className="font-mono text-black bg-red-100 px-1.5 py-0.5">{currentUser.email}</strong> has been suspended or deactivated by firm administration.
              </p>
              <p className="leading-relaxed">
                Deactivated accounts are denied access to all case dockets, documents, and proceedings even when a valid authentication session is active.
              </p>
              <p className="leading-relaxed text-gray-700">
                To restore portal privileges, please contact firm administration at <code className="font-mono text-[#990000]">registry@tep.com.ng</code>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto px-6 py-3 bg-[#990000] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : authState === 'error' ? (
          /* ================================================================ */
          /* AUTHORIZATION / DATABASE ERROR STATE (FAIL CLOSED)               */
          /* ================================================================ */
          <div className="bg-white border-2 border-red-400 p-8 text-center max-w-xl mx-auto shadow-xl my-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-black">Authorization Service Error</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              An error occurred while verifying your permissions. Access is denied in accordance with fail-closed security protocols.
            </p>
            {authError && <p className="text-xs font-mono text-red-700 bg-red-50 p-2 border border-red-200">{authError}</p>}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#990000] text-white text-xs font-bold uppercase tracking-wider hover:bg-black cursor-pointer"
            >
              Retry Verification
            </button>
          </div>
        ) : (location.pathname.startsWith('/portal/admin') && authState === 'admin') ? (
          /* ================================================================ */
          /* ADMIN DASHBOARD (STRICTLY AUTHORIZED ADMINISTRATORS ONLY)        */
          /* ================================================================ */
          <AdminDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={currentUser.uid}
            currentUserEmail={currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => setSelectedCase(c)}
            onOpenDocModal={(d) => setSelectedDoc(d)}
          />
        ) : (
          /* ================================================================ */
          /* CLIENT DASHBOARD (APPROVED ACTIVE CLIENT ONLY)                   */
          /* ================================================================ */
          <ClientDashboard
            cases={cases}
            casesLoading={casesLoading}
            currentUserUid={currentUser.uid}
            currentUserEmail={currentUser.email}
            currentUserName={currentUser.displayName}
            onOpenCaseModal={(c) => {
              const cEmail = c.clientEmail?.toLowerCase().trim();
              const userEmail = (currentUser.email || '').toLowerCase().trim();
              if (cEmail === userEmail || c.clientUid === currentUser.uid) {
                setSelectedCase(c);
              } else {
                setAccessDeniedNotice(`Access Denied: Docket ${c.caseNumber} is assigned to another client identity.`);
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
                  <span className="text-gray-600 font-mono font-normal">Assigned Client: {selectedCase.clientEmail}</span>
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
                    Next Milestone / Hearing
                  </span>
                  <p className="font-bold text-black">{selectedCase.nextHearingDate || 'Awaiting Fixture'}</p>
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
                    <span>Real-Time Proceedings & Updates ({selectedCase.recentUpdates?.length || 0})</span>
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
                    <p className="text-xs text-gray-400 italic py-2">No updates recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Document Repository */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#990000]" />
                    <span>Matter Documents & Regulatory Filings ({selectedCase.documents?.length || 0})</span>
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
                          className="px-2 py-1 bg-gray-100 hover:bg-[#990000] hover:text-white text-gray-800 font-bold uppercase cursor-pointer"
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
                          className="text-[#990000] font-bold uppercase hover:underline cursor-pointer"
                        >
                          Inspect &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!selectedCase.documents || selectedCase.documents.length === 0) && (
                    <p className="text-xs text-gray-400 italic py-2">No documents attached yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Inspection Modal */}
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
                className="absolute top-6 right-6 text-gray-400 hover:text-black cursor-pointer"
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
                  <span className="text-gray-500">Recorded Size:</span>
                  <span className="font-mono text-gray-600">{selectedDoc.fileSize}</span>
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
                  className="px-4 py-2 bg-gray-100 hover:bg-[#990000] hover:text-white text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Advance Lifecycle &rarr;
                </button>

                <button
                  onClick={() => {
                    setPortalToast(`Document record verified: ${selectedDoc.title}`);
                    setTimeout(() => setPortalToast(null), 3000);
                  }}
                  className="px-4 py-2 bg-black hover:bg-[#990000] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Verify Seal
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
