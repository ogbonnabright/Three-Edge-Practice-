import { doc, getDoc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ClientProfile } from '../types';

// =========================================================================
// STRICT ADMINISTRATOR AUTHORIZATION
// The following three accounts are designated administrators:
// - chiaghalam@gmail.com
// - admin@tep.com.ng
// - registry@tep.com.ng
// Other @tep.com.ng accounts must NOT automatically receive administrator privileges.
// They receive administrative access ONLY after explicit authorization by an existing admin.
// =========================================================================
export const DESIGNATED_ADMIN_EMAILS = [
  'chiaghalam@gmail.com',
  'admin@tep.com.ng',
  'registry@tep.com.ng'
] as const;

export const isDesignatedAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized === 'chiaghalam@gmail.com' ||
    normalized === 'admin@tep.com.ng' ||
    normalized === 'registry@tep.com.ng'
  );
};

export const isAssociatedAdminEmail = isDesignatedAdminEmail;

export const UNREGISTERED_ERROR_MESSAGE = 
  "Access Denied: This account is not registered. Client accounts are provisioned exclusively by firm administrators for verified retainers. Please contact registry@tep.com.ng to request authorization.";

export type AuthVerificationResult = 
  | { status: 'admin'; role: 'designated_admin' | 'approved_admin' }
  | { status: 'client'; profile: ClientProfile }
  | { status: 'unverified'; message: string }
  | { status: 'unregistered'; message: string }
  | { status: 'deactivated'; message: string }
  | { status: 'error'; error: string };

/**
 * Pure authorization evaluation logic taking dependency-injected query providers
 * for standalone automated testability without live network dependency.
 * Enforces zero-trust authorization:
 * - Public self-registration is rejected.
 * - Access is permitted ONLY when an administrator has explicitly created the account.
 * - Domain-based automatic access is forbidden.
 * - Deactivated accounts are rejected immediately.
 */
export async function evaluateAuthorization(
  user: { uid: string; email: string | null; emailVerified: boolean },
  deps: {
    checkAdminDoc: (uid: string) => Promise<{ exists: boolean; data?: { role?: string; status?: string } }>;
    queryClientsByEmailOrUid: (email: string, uid: string) => Promise<ClientProfile | null>;
    queryCasesByEmail?: (email: string) => Promise<{ exists: boolean; clientAccess?: string; clientName?: string }>;
  }
): Promise<AuthVerificationResult> {
  const cleanEmail = (user.email || '').toLowerCase().trim();

  // 1. Require Verified Email
  if (!user.emailVerified) {
    return {
      status: 'unverified',
      message: 'Email verification is required before portal entry. Please verify your email address.'
    };
  }

  // 2. Designated Administrators
  if (isDesignatedAdminEmail(cleanEmail)) {
    return { status: 'admin', role: 'designated_admin' };
  }

  try {
    // 3. Explicitly Approved Additional Administrator
    const adminDoc = await deps.checkAdminDoc(user.uid);
    if (adminDoc.exists && adminDoc.data?.role === 'Admin' && adminDoc.data?.status === 'Active') {
      return { status: 'admin', role: 'approved_admin' };
    }

    // 4. Explicitly Approved Client Record in /clients
    // Access is possible ONLY when an administrator has explicitly created the client profile.
    const matchedClient = await deps.queryClientsByEmailOrUid(cleanEmail, user.uid);
    if (matchedClient) {
      if (matchedClient.status === 'Deactivated') {
        return {
          status: 'deactivated',
          message: 'Access Revoked: This client portal account has been deactivated. Underlying records remain confidential. Please contact registry@tep.com.ng.'
        };
      }
      if (matchedClient.status === 'Active') {
        return { status: 'client', profile: matchedClient };
      }
      return {
        status: 'deactivated',
        message: 'Access Suspended: This client registration is currently pending administrative activation. Please contact registry@tep.com.ng.'
      };
    }

    // 5. Unregistered Identity: No explicit administrator-created account exists.
    // Strictly reject all unregistered or self-created accounts.
    return {
      status: 'unregistered',
      message: UNREGISTERED_ERROR_MESSAGE
    };
  } catch (err: unknown) {
    // Fail Closed!
    return {
      status: 'error',
      error: 'Authorization registry check failed. Fail-closed security policy enforced. Please contact registry@tep.com.ng.'
    };
  }
}

/**
 * Production authorization verification function querying Firestore directly.
 */
export async function verifyUserAuthorization(user: {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}): Promise<AuthVerificationResult> {
  const cleanEmail = (user.email || '').toLowerCase().trim();

  // 1. Require verified email
  if (!user.emailVerified) {
    return {
      status: 'unverified',
      message: 'Email verification is required before portal entry. Please verify your email address.'
    };
  }

  // 2. Designated Administrators
  if (isDesignatedAdminEmail(cleanEmail)) {
    try {
      await setDoc(doc(db, 'admins', user.uid), {
        id: user.uid,
        email: cleanEmail,
        role: 'Admin',
        status: 'Active',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Admin record sync notice:', e);
    }
    return { status: 'admin', role: 'designated_admin' };
  }

  return evaluateAuthorization(user, {
    checkAdminDoc: async (uid: string) => {
      const snap = await getDoc(doc(db, 'admins', uid));
      return {
        exists: snap.exists(),
        data: snap.exists() ? (snap.data() as { role?: string; status?: string }) : undefined
      };
    },
    queryClientsByEmailOrUid: async (email: string, uid: string) => {
      let client: ClientProfile | null = null;
      const snapEmail = await getDocs(query(collection(db, 'clients'), where('email', '==', email)));
      snapEmail.forEach((d) => {
        client = { id: d.id, ...d.data() } as ClientProfile;
      });
      if (!client) {
        const snapUid = await getDocs(query(collection(db, 'clients'), where('uid', '==', uid)));
        snapUid.forEach((d) => {
          client = { id: d.id, ...d.data() } as ClientProfile;
        });
      }
      return client;
    },
    queryCasesByEmail: async (email: string) => {
      const snap = await getDocs(query(collection(db, 'cases'), where('clientEmail', '==', email)));
      if (snap.empty) {
        return { exists: false };
      }
      let clientAccess = 'Active';
      let clientName = '';
      snap.forEach((d) => {
        const data = d.data();
        if (data.clientAccess === 'Deactivated' || data.clientAccess === 'Revoked') {
          clientAccess = 'Deactivated';
        }
        if (data.clientName) clientName = data.clientName;
      });
      return { exists: true, clientAccess, clientName };
    }
  });
}
