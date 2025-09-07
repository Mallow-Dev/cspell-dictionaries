
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Publisher CLI starting...");

const DICTIONARY_PATHS = {
  'project': path.join(__dirname, '../../project-words.dic'),
  'marshmallow': path.join(__dirname, '../../marshmallow-words.dic'),
  'dev': path.join(__dirname, '../../dev-words.dic'),
  'domain': path.join(__dirname, '../../domain-words.dic'),
};

const loadDictionary = (dictPath) => {
  try {
    const data = fs.readFileSync(dictPath, 'utf8');
    return new Set(data.split(/\r?\n/).map(word => word.trim()).filter(Boolean));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Set();
    } else {
      console.error(`Error loading dictionary from ${dictPath}:`, error);
      process.exit(1);
    }
  }
};

const saveDictionary = (dictPath, words) => {
  const sortedWords = Array.from(words).sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(dictPath, sortedWords.join('\n'), 'utf8');
};

const publish = () => {
  console.log("Publisher is merging approved requests into dictionary files...");

  const memoryDir = path.join(__dirname, '../../.mallow/memory');
  const approvedRequestsPath = path.join(memoryDir, 'gatekeeper-approved-requests.json');

  if (!fs.existsSync(approvedRequestsPath)) {
    console.error(`Error: Gatekeeper approved requests file not found at ${approvedRequestsPath}. Please run the Gatekeeper first.`);
    process.exit(1);
  }

  const approvedRequests = JSON.parse(fs.readFileSync(approvedRequestsPath, 'utf8'));

  const dictionaries = {};
  for (const dictName in DICTIONARY_PATHS) {
    dictionaries[dictName] = loadDictionary(DICTIONARY_PATHS[dictName]);
  }

  approvedRequests.forEach(request => {
    if (request.accepted && DICTIONARY_PATHS[request.originalClassification]) {
      dictionaries[request.originalClassification].add(request.word);
      console.log(`Added "${request.word}" to ${request.originalClassification}-words.dic`);
    } else if (request.accepted) {
      console.warn(`Approved word "${request.word}" has unhandled classification: ${request.originalClassification}. Skipping.`);
    }
  });

  for (const dictName in DICTIONARY_PATHS) {
    saveDictionary(DICTIONARY_PATHS[dictName], dictionaries[dictName]);
  }

  console.log("Publisher finished merging requests. Dictionary files updated.");
};

const args = process.argv.slice(2);

if (args.includes('publish')) {
  publish();
} else {
  console.log("Usage: node agents/publisher/cli.js publish");
}
