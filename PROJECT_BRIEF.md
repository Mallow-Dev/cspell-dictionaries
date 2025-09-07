# Mallow Spell Intelligence (Agentic Edition)

## 🎯 Vision

A **multi-tenant, agent-driven spell intelligence system** that:

* Centralises dictionaries (brands, tech, dev, ignore, client).
* Automates classification, PR creation, and approvals.
* Self-improves via agents that specialise in different roles.
* Enforces privacy (no client terms leaking into public).
* Integrates smoothly into developer IDEs, CI/CD, and GitHub.

The outcome: **zero false-positive spellchecking pain** and a constantly improving, compliant dictionary model across Mallow and client projects.

---

## 🏗 Architecture

### Monorepo structure

```
mallow-spell/
  packages/
    @mallow-dev/mallow-spell/
    @mallow-dev/mallow-spell-private/
  templates/repo-template/
  clients/<client>/
  memory-bank/
  .github/workflows/
  DECISIONS.md
  TODO.md
```

* **Public package:** `@mallow-dev/mallow-spell` → npmjs
* **Private package:** `@mallow-dev/mallow-spell-private` → GitHub Packages
* **Client containers:** `clients/<client>/words/` → isolated lists
* **Template repo:** ready-made setup for new projects
* **Memory-bank:** roles, policies, schemas, and decision history

---

## 🤖 Agents & Roles

### Librarian (Scanner + Classifier)

* **Input:** Repo source + cSpell issues
* **Output:** Staged request JSON files
* **Responsibilities:**

  * Scan repo with cSpell
  * Classify issues into Brand, Tech, Dev, Ignore, Internal
  * Use memory-bank hints (`project.default.json`)
  * Update `.mallow/memory/librarian.json` with accept/reject state

### Curator (Quality Keeper)

* **Input:** Request JSON
* **Output:** Cleaned/merged requests
* **Responsibilities:**

  * Deduplicate and normalise casing
  * Route to public vs private vs client stacks
  * Pass refined lists to Gatekeeper

### Gatekeeper (Privacy + Policy)

* **Input:** Refined requests
* **Output:** Approved/rejected requests
* **Responsibilities:**

  * Enforce `policies/spell-policy.md`
  * Ensure no client words leak public
  * Validate regex additions
  * Require review on sensitive PRs

### Publisher (Automation)

* **Input:** Approved requests
* **Output:** PRs in mono-repo wordlists
* **Responsibilities:**

  * Merge requests into sorted files
  * Open PRs with labels (`dictionary`, `public/private`, `automerge`)
  * Trigger release workflows after merge

### Auditor (History + Traceability)

* **Input:** Logs + PRs + DECISIONS.md
* **Output:** Updated history & tasks
* **Responsibilities:**

  * Maintain `DECISIONS.md` + `TODO.md`
  * Validate schemas on requests
  * Report anomalies

---

## 🔄 Workflow

1. **Scan** → Dev runs `npx mallow-librarian scan` → issues staged as requests
2. **Curate** → Requests deduped & routed
3. **Gatekeep** → Privacy/policy checks
4. **Publish** → PRs opened to correct lists
5. **Audit** → History updated, anomalies flagged

---

## 🔐 Privacy & Security

* **Public:** only brand + common tech/dev terms
* **Private:** staff/internal terms, client brands
* **Client:** segregated in `clients/<name>` with CODEOWNERS
* **Ignore:** always preferred for IDs/variables
* **Automation:** GitHub App or PAT with least privilege

---

## 🛠 Developer Experience

* WSL-safe multi-root workspace (`MallowSpell-WSL.code-workspace`)
* Template repo with:

  * cSpell, Husky, lint-staged
  * VS Code tasks (`Spell check`, `Librarian scan`, `Request words`)
  * Pre-commit hook for spellcheck
  * Nightly CI sync for PRs
* Future: VS Code “Spell Intelligence” panel for in-IDE approvals

---

## ✅ Deliverables

* Monorepo with packages, template, client containers
* Memory-bank (roles, schemas, policies, decisions)
* Librarian CLI (scan → classify → stage)
* PR automation (Octokit + CI workflows)
* CODEOWNERS + branch protections
* Documentation: `AGENT_GUIDE.md`, `CONTRIBUTING.md`, `DECISIONS.md`

---

## 📈 Roadmap

### Phase 1 (MVP)

* Scaffold monorepo & packages
* Publish `@mallow-dev/mallow-spell` (public)
* Publish `@mallow-dev/mallow-spell-private` (private)
* Deliver template repo + workspace
* CI spellcheck + PR sync jobs

**Outcome:** New repo imports one line, runs spellcheck, PR automation works

---

### Phase 2 (Agent Roles)

* Add Curator + Gatekeeper scripts
* Schema validation job in CI
* CODEOWNERS + protections for clients/private

**Outcome:** Safe, compliant request flow

---

### Phase 3 (Classifier Brains)

* Expand classifier using stackHints + brandHints
* Improve variable detection + regex handling

**Outcome:** Fewer false positives out-of-the-box

---

### Phase 4 (DX Polish)

* VS Code “Spell Intelligence” panel
* GitHub App for automation
* Client container generator (`scripts/new-client.mjs`)
* Optional client-scoped presets

**Outcome:** Fully self-improving loop

---

## 📋 Sprint Plan

### Sprint 1

* Finalise package names
* Publish public + private v1.0.0
* CI: spellcheck, release, validate-words

### Sprint 2

* Implement Curator + Gatekeeper
* Schema validation + CODEOWNERS

### Sprint 3

* Classifier enhancements from memory-bank
* Add stackHints (NextJS, MUI, Prisma, WP, etc.)

### Sprint 4

* DX polish: VS Code panel + App
* Client container generator

---

## ✔ Acceptance Criteria

* New project passes clean spellcheck
* `mallow-librarian scan` produces valid requests
* CI sync job opens labelled PRs in correct wordlists
* Public vs private separation enforced in tests
* Client container updated through same flow

---