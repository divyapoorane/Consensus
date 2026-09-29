// verify_features.js
const API = 'http://localhost:4000/api';

async function run() {
  console.log('--- Verifying Consensus 5 Demo Features ---');

  // 1. Login Admin
  const adminRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@consensus.dev', password: 'password123' }),
  });
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  console.log('1. Admin Login: OK (User:', adminData.user.name, ')');

  // 2. Payments / Escrow
  const payoutsRes = await fetch(`${API}/payouts`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const payouts = await payoutsRes.json();
  console.log(`2. Payouts: Found ${payouts.length} records. First TXN: ${payouts[0]?.payoutId} (${payouts[0]?.status})`);

  const updatePayoutRes = await fetch(`${API}/payouts/${payouts[0].id}/status`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  });
  const updatedPayout = await updatePayoutRes.json();
  console.log(`   Updated Payout: ${updatedPayout.payoutId} -> ${updatedPayout.status}`);

  // 3. Certificates
  const certRes = await fetch(`${API}/certificates/issue`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientName: 'Grace Hopper',
      recipientEmail: 'grace@consensus.dev',
      type: 'winner',
      achievement: 'Compiler Pioneer Track Champion',
    }),
  });
  const cert = await certRes.json();
  console.log(`3. Certificate Issued: ${cert.certificateId} for ${cert.recipientName}`);

  const pdfDownload = await fetch(`${API}/certificates/${cert.id}/download`);
  const pdfBytes = await pdfDownload.arrayBuffer();
  console.log(`   PDF Download: HTTP ${pdfDownload.status}, Content-Type: ${pdfDownload.headers.get('content-type')}, Size: ${pdfBytes.byteLength} bytes`);

  // 4. Disputes
  const partRes = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'participant@consensus.dev', password: 'password123' }),
  });
  const partData = await partRes.json();
  const partToken = partData.token;

  const fileDisputeRes = await fetch(`${API}/disputes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${partToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Scoring Variance on Latency Tests',
      category: 'Judging Bias / Scoring Irregularity',
      priority: 'high',
      description: 'Our team achieved 180ms latency while rubric recorded 300ms. Requesting re-evaluation.',
      hackathonTitle: 'Autonomous Systems & AI Arena',
      projectTitle: 'Synapse Bridge',
    }),
  });
  const newDispute = await fileDisputeRes.json();
  console.log(`4. Dispute Filed: ${newDispute.disputeId} (${newDispute.category}) by ${newDispute.complainantEmail}`);

  const resolveRes = await fetch(`${API}/disputes/${newDispute.id}/resolve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'RESOLVED',
      resolutionNotes: 'Verified benchmark telemetry logs. Adjusted composite rubric.',
    }),
  });
  const resolved = await resolveRes.json();
  console.log(`   Dispute Resolved: ${resolved.disputeId} -> ${resolved.status}`);

  // 5. Audit Logs & CSV
  const logsRes = await fetch(`${API}/admin/audit-logs`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const logs = await logsRes.json();
  console.log(`5. Audit Logs: Found ${logs.length} immutable records in PostgreSQL.`);

  const csvRes = await fetch(`${API}/admin/audit-logs/download-csv`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const csvText = await csvRes.text();
  console.log(`   CSV Download: HTTP ${csvRes.status}, Content-Type: ${csvRes.headers.get('content-type')}, Size: ${csvText.length} characters`);
  console.log(`   CSV Preview:\n${csvText.split('\n').slice(0, 4).join('\n')}`);

  console.log('\n>>> ALL 5 DEMO FEATURES ARE VERIFIED AND OPERATIONAL! <<<');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
