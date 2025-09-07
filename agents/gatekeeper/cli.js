
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Gatekeeper CLI starting...");

const enforcePolicies = () => {
  console.log("Gatekeeper is enforcing spelling policies...");

  const memoryDir = path.join(__dirname, '../../.mallow/memory');
  const publicRequestsPath = path.join(memoryDir, 'curator-public-requests.json');
  const privateRequestsPath = path.join(memoryDir, 'curator-private-requests.json');
  const clientRequestsPath = path.join(memoryDir, 'curator-client-requests.json');
  const ignoreRequestsPath = path.join(memoryDir, 'curator-ignore-requests.json');
  const techRequestsPath = path.join(memoryDir, 'curator-tech-requests.json');
  const unclassifiedRequestsPath = path.join(memoryDir, 'curator-unclassified-requests.json');

  if (!fs.existsSync(publicRequestsPath)) {
    console.error(`Error: Curator public requests file not found at ${publicRequestsPath}. Please run the Curator first.`);
    process.exit(1);
  }

  const publicRequests = JSON.parse(fs.readFileSync(publicRequestsPath, 'utf8'));
  const privateRequests = JSON.parse(fs.readFileSync(privateRequestsPath, 'utf8'));
  const clientRequests = JSON.parse(fs.readFileSync(clientRequestsPath, 'utf8'));
  const ignoreRequests = JSON.parse(fs.readFileSync(ignoreRequestsPath, 'utf8'));
  const techRequests = JSON.parse(fs.readFileSync(techRequestsPath, 'utf8'));
  const unclassifiedRequests = JSON.parse(fs.readFileSync(unclassifiedRequestsPath, 'utf8'));

  // Load policies
  const policyPath = path.join(__dirname, '../../memory-bank/policies/spell-policy.md');
  let policies = "";
  try {
    policies = fs.readFileSync(policyPath, 'utf8');
    console.log(`Loaded spelling policy from ${policyPath}`);
  } catch (error) {
    console.warn(`Could not load spelling policy from ${policyPath}: ${error.message}`);
  }

  const approvedRequests = [];
  const rejectedRequests = [];

  // Policy 1: Ensure no client words leak public
  const allPrivateWords = new Set([...privateRequests.map(r => r.word), ...clientRequests.map(r => r.word)]);
  publicRequests.forEach(request => {
    if (allPrivateWords.has(request.word)) {
      console.log(`Rejecting public word "${request.word}" as it is classified as private/client.`);
      rejectedRequests.push({ ...request, accepted: false, reason: 'Client/private word leakage prevention' });
    } else {
      approvedRequests.push({ ...request, accepted: true });
    }
  });

  // All other categories are initially approved for their respective stacks
  approvedRequests.push(
    ...privateRequests.map(r => ({ ...r, accepted: true })),
    ...clientRequests.map(r => ({ ...r, accepted: true })),
    ...ignoreRequests.map(r => ({ ...r, accepted: true })),
    ...techRequests.map(r => ({ ...r, accepted: true })),
    ...unclassifiedRequests.map(r => ({ ...r, accepted: true }))
  );

  // Write out approved and rejected requests
  fs.writeFileSync(path.join(memoryDir, 'gatekeeper-approved-requests.json'), JSON.stringify(approvedRequests, null, 2), 'utf8');
  fs.writeFileSync(path.join(memoryDir, 'gatekeeper-rejected-requests.json'), JSON.stringify(rejectedRequests, null, 2), 'utf8');

  console.log("Gatekeeper finished enforcing policies. Approved and rejected requests staged.");
};

const args = process.argv.slice(2);

if (args.includes('enforce')) {
  enforcePolicies();
} else {
  console.log("Usage: node agents/gatekeeper/cli.js enforce");
}
