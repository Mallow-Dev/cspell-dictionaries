
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Curator CLI starting...");

const curate = () => {
  console.log("Curator is processing staged spelling requests...");

  const inputPath = path.join(__dirname, '../../.mallow/memory/librarian-requests.json');
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Librarian requests file not found at ${inputPath}. Please run the Librarian scan first.`);
    process.exit(1);
  }

  const rawRequests = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const cleanedRequests = {};
  const allWords = new Set();

  rawRequests.forEach(request => {
    const normalizedWord = request.word.toLowerCase();
    if (!allWords.has(normalizedWord)) {
      allWords.add(normalizedWord);

      if (!cleanedRequests[request.classification]) {
        cleanedRequests[request.classification] = [];
      }
      cleanedRequests[request.classification].push({ word: normalizedWord, originalClassification: request.classification, accepted: request.accepted });
    }
  });

  // Simulate routing to different stacks (for now, just separate categories)
  const publicStack = cleanedRequests.brand || [];
  const privateStack = (cleanedRequests.internal || []).concat(cleanedRequests.dev || []);
  const clientStack = []; // Placeholder for client-specific words
  const ignoreStack = cleanedRequests.ignore || [];
  const techStack = cleanedRequests.tech || [];
  const unclassifiedStack = cleanedRequests.unclassified || [];

  const outputDir = path.join(__dirname, '../../.mallow/memory');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'curator-public-requests.json'), JSON.stringify(publicStack, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'curator-private-requests.json'), JSON.stringify(privateStack, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'curator-client-requests.json'), JSON.stringify(clientStack, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'curator-ignore-requests.json'), JSON.stringify(ignoreStack, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'curator-tech-requests.json'), JSON.stringify(techStack, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'curator-unclassified-requests.json'), JSON.stringify(unclassifiedStack, null, 2), 'utf8');

  console.log("Curator finished processing. Cleaned and routed requests staged.");
};

const args = process.argv.slice(2);

if (args.includes('curate')) {
  curate();
} else {
  console.log("Usage: node agents/curator/cli.js curate");
}
