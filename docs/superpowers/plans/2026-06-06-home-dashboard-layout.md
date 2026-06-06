# Home Dashboard Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reference-inspired home page dashboard for Jockie's personal knowledge base.

**Architecture:** Keep the existing Astro page/component split. The home page owns dashboard-specific static data and derived post lists; global CSS owns reusable card, grid, and responsive styles.

**Tech Stack:** Astro 5, TypeScript content collections, plain CSS, Playwright, Vitest.

---

### Task 1: Home Page Test

**Files:**
- Modify: `tests/site.spec.ts`

- [ ] Update the home page Playwright test to assert the new title, navigation entries, dashboard modules, knowledge map, project archive, and about link.
- [ ] Run `npm run test:e2e -- tests/site.spec.ts --grep "首页"` and confirm it fails because the current page still uses the old home title.

### Task 2: Layout Shell Navigation

**Files:**
- Modify: `src/components/Layout.astro`

- [ ] Add the home link and replace the tags nav entry with project and knowledge-map anchors.
- [ ] Keep RSS as a lightweight text link.

### Task 3: Home Dashboard Markup

**Files:**
- Modify: `src/pages/index.astro`

- [ ] Replace the old linear home layout with the hero, dashboard grid, knowledge map, and project archive.
- [ ] Keep `PostCard` for featured cards so article metadata remains consistent.
- [ ] Render recent updates as a compact list.
- [ ] Add a small client script for current time and countdown day values.

### Task 4: Dashboard Styles

**Files:**
- Modify: `src/styles/global.css`

- [ ] Increase the content max width to the requested 1100px-1200px range.
- [ ] Add translucent card, dashboard grid, compact list, topic map, project archive, and observation styles.
- [ ] Add mobile rules that collapse all grids to one column.

### Task 5: Verification

**Files:**
- No source changes expected.

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:e2e`.
- [ ] Inspect the rendered home page if E2E reports visual/layout failures.
