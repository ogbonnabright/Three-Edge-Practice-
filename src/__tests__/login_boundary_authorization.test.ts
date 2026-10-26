/**
 * Comprehensive Automated Test Suite: Login Boundary Authorization & Security Verification
 * Tests the 7 required scenarios from Section 6 of the prompt:
 * 1. Each of the three designated administrators.
 * 2. An explicitly authorized additional administrator.
 * 3. A registered, active client.
 * 4. An unregistered Google email.
 * 5. An unverified email.
 * 6. A deactivated client.
 * 7. An authorization-registry or network failure.
 */

import {
  evaluateAuthorization,
  isDesignatedAdminEmail,
  UNREGISTERED_ERROR_MESSAGE,
  DESIGNATED_ADMIN_EMAILS
} from '../authAuthorization';
import { ClientProfile } from '../../types';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
    passedTests++;
  }
}

async function runTests() {
  console.log('=================================================================');
  console.log('THREE EDGE PRACTICE — LOGIN BOUNDARY AUTHORIZATION TEST SUITE');
  console.log('=================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Each of the three designated administrators
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Designated Administrators ---');
  for (const email of DESIGNATED_ADMIN_EMAILS) {
    assert(isDesignatedAdminEmail(email), `isDesignatedAdminEmail recognizes ${email}`);

    const result = await evaluateAuthorization(
      { uid: `uid-${email}`, email, emailVerified: true },
      {
        checkAdminDoc: async () => ({ exists: false }),
        queryClientsByEmailOrUid: async () => null,
        queryCasesByEmail: async () => ({ exists: false })
      }
    );

    assert(
      result.status === 'admin' && result.role === 'designated_admin',
      `Designated admin ${email} authorized as designated_admin`,
      JSON.stringify(result)
    );
  }

  // Case insensitivity
  const upperAdmin = await evaluateAuthorization(
    { uid: 'uid-upper', email: 'CHIAGHALAM@GMAIL.COM', emailVerified: true },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    upperAdmin.status === 'admin' && upperAdmin.role === 'designated_admin',
    'Designated admin email matching is case-insensitive'
  );

  // ---------------------------------------------------------------------------
  // TEST 2: Explicitly authorized additional administrator
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: Additional Administrator Authorization ---');
  // Scenario A: Partner explicitly granted Admin role in /admins/{uid}
  const approvedPartnerResult = await evaluateAuthorization(
    { uid: 'partner-uid-123', email: 'partner@tep.com.ng', emailVerified: true },
    {
      checkAdminDoc: async (uid) => ({
        exists: uid === 'partner-uid-123',
        data: { role: 'Admin', status: 'Active' }
      }),
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    approvedPartnerResult.status === 'admin' && approvedPartnerResult.role === 'approved_admin',
    'Explicitly authorized administrator in /admins/{uid} is granted admin access'
  );

  // Scenario B: Arbitrary @tep.com.ng account without /admins record must NOT get admin
  const arbitraryTepResult = await evaluateAuthorization(
    { uid: 'counsel-uid-456', email: 'associate@tep.com.ng', emailVerified: true },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    arbitraryTepResult.status === 'unregistered',
    'Arbitrary @tep.com.ng accounts DO NOT automatically receive admin access and are rejected'
  );

  // ---------------------------------------------------------------------------
  // TEST 3: Registered, active client
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: Registered, Active Client ---');
  const mockClient: ClientProfile = {
    id: 'client-zenith-1',
    uid: 'client-uid-zenith',
    name: 'Zenith Telecom Regulatory Division',
    email: 'legal@zenithtelecom.com',
    organization: 'Zenith Telecom',
    representative: 'Legal Director',
    phone: '+234 1 234 5678',
    address: 'Victoria Island, Lagos',
    status: 'Active',
    registeredAt: '2026-01-01'
  };

  const activeClientResult = await evaluateAuthorization(
    { uid: 'client-uid-zenith', email: 'legal@zenithtelecom.com', emailVerified: true },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async (email) => (email === 'legal@zenithtelecom.com' ? mockClient : null),
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    activeClientResult.status === 'client' && (activeClientResult as { profile?: ClientProfile }).profile?.name === 'Zenith Telecom Regulatory Division',
    'Approved active client in /clients registry is granted client portal access'
  );

  // ---------------------------------------------------------------------------
  // TEST 4: Unregistered Google email (Rejected at login boundary)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: Unregistered Google Email (Boundary Rejection) ---');
  const unregisteredResult = await evaluateAuthorization(
    { uid: 'google-random-999', email: 'unregistered.user@gmail.com', emailVerified: true },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    unregisteredResult.status === 'unregistered',
    'Unregistered Google account is identified as unregistered'
  );
  assert(
    (unregisteredResult as { message?: string }).message === UNREGISTERED_ERROR_MESSAGE,
    'Unregistered identity receives exact required error message',
    (unregisteredResult as { message?: string }).message
  );

  // ---------------------------------------------------------------------------
  // TEST 5: Unverified email
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: Unverified Email Address ---');
  // Even if a designated admin or registered client has unverified email:
  const unverifiedAdminResult = await evaluateAuthorization(
    { uid: 'uid-admin-unverified', email: 'chiaghalam@gmail.com', emailVerified: false },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    unverifiedAdminResult.status === 'unverified',
    'Unverified email address fails closed immediately before portal access'
  );

  const unverifiedClientResult = await evaluateAuthorization(
    { uid: 'client-uid-zenith', email: 'legal@zenithtelecom.com', emailVerified: false },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => mockClient,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    unverifiedClientResult.status === 'unverified',
    'Client with unverified email is stopped at boundary'
  );

  // ---------------------------------------------------------------------------
  // TEST 6: Deactivated client
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: Deactivated / Suspended Client ---');
  const deactivatedClient: ClientProfile = {
    id: 'client-deactivated-1',
    uid: 'client-uid-deactivated',
    name: 'Suspended Entity Ltd',
    email: 'contact@suspendedentity.com',
    organization: 'Suspended Entity Ltd',
    representative: 'Managing Director',
    phone: '+234 1 000 0000',
    address: 'Lagos, Nigeria',
    status: 'Deactivated',
    registeredAt: '2026-01-01'
  };

  const deactivatedResult = await evaluateAuthorization(
    { uid: 'client-uid-deactivated', email: 'contact@suspendedentity.com', emailVerified: true },
    {
      checkAdminDoc: async () => ({ exists: false }),
      queryClientsByEmailOrUid: async () => deactivatedClient,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    deactivatedResult.status === 'deactivated',
    'Deactivated client status is detected and denied entry'
  );

  // ---------------------------------------------------------------------------
  // TEST 7: Authorization registry or network failure (Fail Closed)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: Authorization Registry / Network Failure ---');
  const networkFailureResult = await evaluateAuthorization(
    { uid: 'some-user-uid', email: 'someuser@example.com', emailVerified: true },
    {
      checkAdminDoc: async () => {
        throw new Error('Firestore connection timed out / Network unavailable');
      },
      queryClientsByEmailOrUid: async () => null,
      queryCasesByEmail: async () => ({ exists: false })
    }
  );
  assert(
    networkFailureResult.status === 'error',
    'System fails closed on network or database service failure'
  );
  assert(
    (networkFailureResult as { error?: string }).error?.includes('Fail-closed') === true,
    'Error response enforces fail-closed policy'
  );

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`ALL TESTS PASSED: ${passedTests} / ${totalTests} assertions verified.`);
  console.log('=================================================================');
}

runTests().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
