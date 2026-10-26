import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const DESIGNATED_ADMIN_EMAILS = [
  'chiaghalam@gmail.com',
  'admin@tep.com.ng',
  'registry@tep.com.ng'
];

async function inspectAndReset() {
  console.log('--- Inspecting Firestore Collections ---');
  
  // 1. Clients collection
  const clientsSnap = await getDocs(collection(db, 'clients'));
  console.log(`Found ${clientsSnap.size} documents in /clients`);
  clientsSnap.forEach(d => {
    console.log(`  Client ID: ${d.id}`, d.data());
  });

  // 2. Cases collection
  const casesSnap = await getDocs(collection(db, 'cases'));
  console.log(`Found ${casesSnap.size} documents in /cases`);
  casesSnap.forEach(d => {
    console.log(`  Case ID: ${d.id}, caseNumber: ${d.data()?.caseNumber}, clientEmail: ${d.data()?.clientEmail}`);
  });

  // 3. Users collection
  const usersSnap = await getDocs(collection(db, 'users'));
  console.log(`Found ${usersSnap.size} documents in /users`);
  usersSnap.forEach(d => {
    console.log(`  User ID: ${d.id}, email: ${d.data()?.email}, role: ${d.data()?.role}`);
  });

  // 4. Admins collection
  const adminsSnap = await getDocs(collection(db, 'admins'));
  console.log(`Found ${adminsSnap.size} documents in /admins`);
  adminsSnap.forEach(d => {
    console.log(`  Admin ID: ${d.id}`, d.data());
  });

  process.exit(0);
}

inspectAndReset().catch(err => {
  console.error('Error during inspection:', err);
  process.exit(1);
});
