#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Librarian CLI starting...");

const scan = () => {
  console.log("Librarian is scanning the repository for spelling errors...");

  let classificationHints = { hints: {} };
  const hintsPath = path.join(__dirname, '../../memory-bank/project.default.json');
  console.log(`Attempting to load classification hints from: ${hintsPath}`)
  try {
    const hintsData = fs.readFileSync(hintsPath, 'utf8');
    classificationHints = JSON.parse(hintsData);
    console.log("Successfully loaded classification hints.");
  } catch (error) {
    console.error(`Could not load classification hints from ${hintsPath}: ${error.message}`);
  }

  // Simulate cSpell issues for demonstration
  const rawIssues = [
    { word: 'MallowSpell', context: 'Project title' },
    { word: 'develeoper', context: 'Code comment' },
    { word: 'recieve', context: 'Documentation' },
    { word: 'foobar', context: 'Variable name' },
    { word: 'internall', context: 'Internal document' },
    { word: 'unclassifiedword', context: 'Another context' },
    { word: 'publicword', context: 'Public API' },
    { word: 'privateword', context: 'Private API' },
    { word: 'clientword', context: 'Client API' },
  ];
  console.log("Simulated cSpell issues:", rawIssues);

  const classifiedIssues = rawIssues.map(issue => {
    let classification = 'unclassified'; // Default classification
    console.log(`Classifying issue: ${issue.word}`)
    for (const category in classificationHints.hints) {
      console.log(`Checking category: ${category}`);
      if (classificationHints.hints[category].includes(issue.word)) {
        classification = category;
        console.log(`Found match in category ${category}. Classifying as ${classification}.`)
        break;
      }
    }
    return { ...issue, classification, accepted: false };
  });
  console.log("Classified issues:", classifiedIssues);

  const outputDir = path.resolve(__dirname, '../../.mallow/memory');
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const requestFileName = path.join(outputDir, 'librarian-requests.json');
  console.log(`Writing classified issues to: ${requestFileName}`);
  try{
    fs.writeFileSync(requestFileName, JSON.stringify(classifiedIssues, null, 2), 'utf8');
    console.log(`Classified cSpell issues staged in ${requestFileName}`);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
  }

  console.log('---JSON-START---');
  console.log(JSON.stringify(classifiedIssues, null, 2));
  console.log('---JSON-END---');
};

// A very basic CLI argument parser
const args = process.argv.slice(2);

if (args.includes('scan')) {
  scan();
} else {
  console.log("Usage: mallow-librarian scan");
}
