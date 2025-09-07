
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Librarian CLI starting...");

const scan = () => {
  console.log("Librarian is scanning the repository for spelling errors...");

  let classificationHints = { hints: {} };
  const hintsPath = path.join(__dirname, '../../memory-bank/project.default.json');
  try {
    const hintsData = fs.readFileSync(hintsPath, 'utf8');
    classificationHints = JSON.parse(hintsData);
  } catch (error) {
    console.warn(`Could not load classification hints from ${hintsPath}: ${error.message}`);
  }

  // Simulate cSpell issues for demonstration
  const rawIssues = [
    { word: 'MallowSpell', context: 'Project title' },
    { word: 'develeoper', context: 'Code comment' },
    { word: 'recieve', context: 'Documentation' },
    { word: 'foobar', context: 'Variable name' },
    { word: 'internall', context: 'Internal document' },
    { word: 'unclassifiedword', context: 'Another context' },
  ];

  const classifiedIssues = rawIssues.map(issue => {
    let classification = 'unclassified'; // Default classification
    for (const category in classificationHints.hints) {
      if (classificationHints.hints[category].includes(issue.word)) {
        classification = category;
        break;
      }
    }
    return { ...issue, classification, accepted: false };
  });

  const outputDir = path.join(__dirname, '../../.mallow/memory');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const requestFileName = path.join(outputDir, 'librarian-requests.json');
  fs.writeFileSync(requestFileName, JSON.stringify(classifiedIssues, null, 2), 'utf8');
  console.log(`Classified cSpell issues staged in ${requestFileName}`);
};

// A very basic CLI argument parser
const args = process.argv.slice(2);

if (args.includes('scan')) {
  scan();
} else {
  console.log("Usage: mallow-librarian scan");
}
