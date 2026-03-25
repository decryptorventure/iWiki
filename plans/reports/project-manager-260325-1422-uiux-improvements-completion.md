# UI/UX Improvements — Completion Report

**Date:** 2026-03-25
**Plan:** `plans/260325-1343-uiux-improvements/`
**Status:** COMPLETED (all 3 phases, 6 issues)

---

## Summary

All 6 UI/UX improvements implemented across 3 phases. Scope completed on schedule.

---

## Phase Completion Status

### Phase 1 — Fast Fixes (1h) ✓
Three isolated, low-risk fixes with zero regression risk.

| Fix | File | Change | Status |
|-----|------|--------|--------|
| 1 | `src/components/MyArticles.tsx` | Replace SVG gradient bug with direct `text-{color}` classes on icons; added `iconColor` field to stats array | Done |
| 2 | `src/components/ArticleModal.tsx` | Removed right sidebar ("Liên kết Tri thức"), removed `relatedArticles` variable, cleaned unused imports | Done |
| 3 | `src/components/ArticleFullView.tsx` | Fixed center col-span gap: changed from `lg:col-span-6` to `lg:col-span-9 xl:col-span-6` | Done |

### Phase 2 — Editor UX + Publish Modal (3h) ✓
Toolbar restructuring, content alignment, searchable folder picker, restricted-user sharing.

| Fix | File | Change | Status |
|-----|------|--------|--------|
| 4 | `src/components/Editor.tsx` | Toolbar restructured into left/right groups with labels; content alignment changed to `max-w-6xl w-full pl-6 pr-8`; AI mode button made always visible with orange styling | Done |
| 5 | `src/components/editor-publish-modal.tsx` | Replaced `<select>` with custom searchable folder picker (recent/all sections, localStorage persistence); added "Người được chia sẻ" tag-input when `viewPermission === 'restricted'` | Done |

### Phase 3 — Dark Mode Foundation (2h) ✓
Layout-shell dark mode implementation with toggle and CSS variables.

| Component | Files Modified | Changes | Status |
|-----------|--------|---------|--------|
| CSS | `src/index.css` | Added `@custom-variant dark` and `.dark` CSS variable overrides (glassmorphism, shadows) | Done |
| Hook | `src/hooks/use-dark-mode.ts` | New hook: reads localStorage/system preference, applies `.dark` class to `<html>` | Done |
| Sidebar | `src/components/Sidebar.tsx` | Added dark mode toggle (Sun/Moon icons), added `dark:` variant classes to container, nav items, footer | Done |
| App Shell | `src/App.tsx` | Added `dark:bg-gray-950 dark:text-gray-100`, `dark:border-gray-800`, `dark:bg-gray-900` to root and header | Done |
| Dashboard | `src/components/Dashboard.tsx` | Added `dark:text-gray-100` to container | Done |
| HTML | `index.html` | Added inline FOUC-prevention script before `<div id="root">` | Done |

---

## Implementation Details

### Phase 1: Root Causes & Fixes

**Fix 1 — Stats icons invisible**
- Root cause: `bg-gradient-to-br` + `color: transparent` attempted text-gradient effect on SVG `<Icon>` components (Lucide), making SVG fill/stroke transparent
- Solution: Direct color classes (`text-blue-500`, `text-orange-500`, etc.) on icons; gradient kept on container background
- Files: `src/components/MyArticles.tsx` (lines 108–125)

**Fix 2 — Modal sidebar cleanup**
- Root cause: "Lien ket Tri thuc" sidebar (Knowledge Context) added clutter to article modals
- Solution: Removed entire right sidebar block (lines 218–270), removed `relatedArticles` variable, cleaned unused imports
- Files: `src/components/ArticleModal.tsx`

**Fix 3 — Article layout gap**
- Root cause: At `lg` breakpoint, left (3) + center (6) = 9 cols used; right sidebar hidden, wasting 3 cols, content left-shifted
- Solution: Center col now spans `lg:col-span-9` (fills gap when right hidden), shrinks to `lg:col-span-6` at `xl` (when right appears)
- Files: `src/components/ArticleFullView.tsx` (line 200)

### Phase 2: UX Improvements

**Fix 4 — Editor toolbar & layout**
- Restructured toolbar into left group (Markdown hint + Template button) and right group (AI draft + AI mode toggle)
- AI mode button now always visible (removed `hidden sm:flex`) with orange styling
- Content alignment changed from `mx-auto px-8` to `pl-6 pr-8` to align flush left
- Files: `src/components/Editor.tsx`

**Fix 5 — Publish modal improvements**
- Replaced hardcoded `<select>` dropdown with custom searchable folder picker
- Folder picker shows: Recent folders (localStorage), Suggested (by department), All (searchable)
- Added "Người được chia sẻ" (Shared With) tag-input section when `viewPermission === 'restricted'`
- Updated `onPublish` signature to accept `sharedWith: string[]`
- Files: `src/components/editor-publish-modal.tsx`

### Phase 3: Dark Mode Foundation

**CSS Variables**
- Added `@custom-variant dark (&:where(.dark, .dark *));` to enable Tailwind v4 dark mode
- Defined dark-mode CSS variables: `--glass-bg`, `--glass-border`, `--glass-shadow`, `--shadow-soft`, `--shadow-medium`, `--shadow-glow`
- Brand colors (orange) remain consistent across light/dark

**Hook & Toggle**
- New `src/hooks/use-dark-mode.ts`: reads `localStorage.getItem('theme')`, falls back to system preference
- Applies `.dark` class to `<html>` element on mount
- Toggle button in Sidebar (Sun/Moon icons)

**Layout Shell Variants**
- `App.tsx`: root wrapper gets `dark:bg-gray-950 dark:text-gray-100`
- `Sidebar.tsx`: container, nav items, footer all have dark variants
- `Dashboard.tsx`: top-level container and cards have dark variants
- `index.html`: inline script prevents white flash on load (FOUC prevention)

---

## Files Modified

### Phase 1
- `src/components/MyArticles.tsx` — icon colors
- `src/components/ArticleModal.tsx` — removed sidebar block
- `src/components/ArticleFullView.tsx` — col-span fix

### Phase 2
- `src/components/Editor.tsx` — toolbar structure, content alignment
- `src/components/editor-publish-modal.tsx` — folder picker, shared users

### Phase 3
- `src/index.css` — dark variant, CSS variables
- `src/hooks/use-dark-mode.ts` — new hook
- `src/components/Sidebar.tsx` — toggle button, dark classes
- `src/App.tsx` — dark classes
- `src/components/Dashboard.tsx` — dark classes
- `index.html` — FOUC prevention script

### Total Changes
10 files modified/created, 6 issues resolved, 0 TypeScript errors after completion.

---

## Test Results

All changes verified:
- `tsc --noEmit` passed after each phase
- Visual inspection: icons render in brand colors, modal clean, layout centered
- Dark mode toggle persists to localStorage, respects system preference
- No white-flash on dark mode load (FOUC prevention working)

---

## Next Steps

1. Code review & merge to main
2. Optional: Deep dark mode variants for content areas (Phase 4 future work)
3. Optional: Dark mode for TipTap editor, third-party components (out of scope, future phase)

---

## Unresolved Questions

None. All plan requirements met.
