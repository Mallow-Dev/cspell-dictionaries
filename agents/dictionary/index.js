
const fs = require('fs');
const path = require('path');

class Dictionary {
  constructor() {
    this.filePath = path.join(__dirname, '../../project-words.dic');
    this.words = new Map();
    this._loadWords();
  }

  _loadWords() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      data.split(/\r?\n/).forEach(word => {
        const trimmedWord = word.trim();
        if (trimmedWord) {
          this.words.set(trimmedWord, 'loaded from file');
        }
      });
      console.log(`Loaded ${this.words.size} words from ${this.filePath}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Dictionary file not found: ${this.filePath}. Starting with an empty dictionary.`);
        fs.writeFileSync(this.filePath, '', 'utf8'); // Create an empty file if it doesn't exist
      } else {
        console.error(`Error loading dictionary from ${this.filePath}:`, error);
      }
    }
  }

  _saveWord(word) {
    try {
      fs.appendFileSync(this.filePath, `\n${word}`, 'utf8');
      console.log(`Saved "${word}" to ${this.filePath}`);
    } catch (error) {
      console.error(`Error saving word "${word}" to ${this.filePath}:`, error);
    }
  }

  addWord(word, definition) {
    if (!this.words.has(word)) {
      this.words.set(word, definition);
      this._saveWord(word);
      console.log(`Added "${word}" to the dictionary.`);
    } else {
      console.log(`"${word}" already exists in the dictionary.`);
    }
  }

  getDefinition(word) {
    return this.words.get(word);
  }
}

module.exports = new Dictionary();
