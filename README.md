# marshmallow-brand-words.dic

A shared cspell dictionary for Marshmallow Marketing Ltd.

## Purpose

This dictionary contains approved brand, product, and technical terms used across all Marshmallow Marketing (MM) and client projects. It helps ensure consistent spell checking and reduces false positives in code, documentation, and content.

## Usage

1. Reference this dictionary in your project’s `cspell.json`:

   ```json
   {
     "dictionaryDefinitions": [
       {
         "name": "marshmallow-brand-words",
         "path": "https://raw.githubusercontent.com/your-org/your-dictionary-repo/main/marshmallow-brand-words.dic",
         "type": "C"
       }
     ],
     "dictionaries": ["marshmallow-brand-words"]
   }
   ```

2. Commit and push updates to this file as new terms are added.

## Guidelines

- Only add words that are specific to Marshmallow, its brands, or recurring client/project terms.
- Use lowercase for generic terms, preserve case for brand names.
- One word per line, no punctuation.

## Example Entries

```
Marshmallow
MallowAI
RootSky
woocommerce
antialiasing
offwhite
```

---

For questions or updates, contact the MM DevOps team.
