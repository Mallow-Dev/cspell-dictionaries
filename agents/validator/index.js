class Validator {
  isValid(word) {
    // For now, a very simple validation: check if the word is not empty
    return typeof word === 'string' && word.trim().length > 0;
  }
}

module.exports = new Validator();