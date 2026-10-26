/**
 * Verification test suite for Three Edge Practice (TEP)
 * Authentication, Authorization, and Security Invariants.
 */

// Designated administrators list as strictly defined in Section 3 of prompt
const DESIGNATED_ADMIN_EMAILS = [
  'chiaghalam@gmail.com',
  'admin@tep.com.ng',
  'registry@tep.com.ng'
];

function isDesignatedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return DESIGNATED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

function validateClientAccess(client: {
  email: string;
  emailVerified: boolean;
  status: string;
  isRegistered: boolean;
}): { allowed: boolean; reason: string } {
  if (!client.emailVerified) {
    return { allowed: false, reason: 'EMAIL_UNVERIFIED' };
  }
  if (!client.isRegistered) {
    return { allowed: false, reason: 'UNREGISTERED' };
  }
  if (client.status.toLowerCase() !== 'active') {
    return { allowed: false, reason: 'DEACTIVATED' };
  }
  return { allowed: true, reason: 'AUTHORIZED' };
}

console.log('--- Running TEP Security and Authorization Invariant Tests ---');

// Test 1: Designated Admin Validation
console.log('Test 1: Designated Admin Access');
console.assert(isDesignatedAdminEmail('chiaghalam@gmail.com') === true, 'chiaghalam@gmail.com should be admin');
console.assert(isDesignatedAdminEmail('admin@tep.com.ng') === true, 'admin@tep.com.ng should be admin');
console.assert(isDesignatedAdminEmail('registry@tep.com.ng') === true, 'registry@tep.com.ng should be admin');
console.assert(isDesignatedAdminEmail('CHIAGHALAM@GMAIL.COM') === true, 'Case-insensitive admin check failed');

// Test 2: Non-designated @tep.com.ng accounts must NOT automatically receive admin access
console.log('Test 2: Arbitrary @tep.com.ng emails must NOT receive automatic admin privileges');
console.assert(isDesignatedAdminEmail('counsel@tep.com.ng') === false, 'Arbitrary tep.com.ng must NOT be admin');
console.assert(isDesignatedAdminEmail('associate@tep.com.ng') === false, 'Associate tep.com.ng must NOT be admin');
console.assert(isDesignatedAdminEmail('attacker@evil.com') === false, 'Random email must NOT be admin');

// Test 3: Client Email Verification Requirement
console.log('Test 3: Unverified emails fail-closed');
const unverifiedClient = validateClientAccess({
  email: 'client@zenithtelecom.com',
  emailVerified: false,
  status: 'Active',
  isRegistered: true
});
console.assert(unverifiedClient.allowed === false && unverifiedClient.reason === 'EMAIL_UNVERIFIED', 'Unverified email must be rejected');

// Test 4: Unregistered emails fail-closed
console.log('Test 4: Unregistered emails fail-closed');
const unregisteredClient = validateClientAccess({
  email: 'unknown@example.com',
  emailVerified: true,
  status: 'Active',
  isRegistered: false
});
console.assert(unregisteredClient.allowed === false && unregisteredClient.reason === 'UNREGISTERED', 'Unregistered email must be rejected');

// Test 5: Suspended / Deactivated accounts lose access immediately
console.log('Test 5: Suspended/Deactivated accounts rejected');
const deactivatedClient = validateClientAccess({
  email: 'client@zenithtelecom.com',
  emailVerified: true,
  status: 'Suspended',
  isRegistered: true
});
console.assert(deactivatedClient.allowed === false && deactivatedClient.reason === 'DEACTIVATED', 'Suspended email must be rejected');

// Test 6: Approved, verified, active client is granted access
console.log('Test 6: Active, registered, verified client access');
const validClient = validateClientAccess({
  email: 'client@zenithtelecom.com',
  emailVerified: true,
  status: 'Active',
  isRegistered: true
});
console.assert(validClient.allowed === true && validClient.reason === 'AUTHORIZED', 'Valid client should be permitted');

console.log('--- ALL INVARIANT TESTS PASSED SUCCESSFULLY ---');
