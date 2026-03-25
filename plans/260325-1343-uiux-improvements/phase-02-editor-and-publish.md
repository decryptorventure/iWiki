---
title: "Phase 2 — Editor UX + Publish Modal"
status: completed
priority: P1
effort: 3h
completed: 2026-03-25
---

# Phase 2 — Editor UX + Publish Modal

## Overview
Restructure editor toolbar for clarity; improve publish modal with searchable folder picker and restricted-user sharing.

---

## Issue 4: Editor Toolbar & Layout

**File:** `src/components/Editor.tsx`

### 4a. Toolbar Restructuring (lines ~243–255)
Current: 3 separate toolbar items with no grouping — template button, AI button, and formatting scattered.

**Changes:**
1. Group toolbar into two sections using flex layout:
   - **Left group:** Format tools + template button (secondary style, outlined)
   - **Right group:** AI tools (AI draft button, AI mode toggle)
2. Add small label text "Mau" (Template) and "AI" above groups for discoverability
3. Use `gap-2` within groups, `gap-6` between groups

### 4b. Content Alignment
Current: `max-w-6xl mx-auto px-8` centers the editing area but content appears too centered/floated.

**Fix:** Keep `max-w-6xl` for max width constraint, but change alignment:
```
max-w-6xl mx-auto px-8  -->  max-w-6xl w-full pl-6 pr-8
```
This keeps the container constrained but content starts from a natural left edge within centered container. Title input and editor body align flush left.

### 4c. AI Mode Button Visibility
Current (line ~209): AI mode toggle exists but has `hidden sm:flex` — invisible on mobile.

**Fix:**
- Remove `hidden sm:flex`, always show
- Move into the toolbar right-group (from 4a) for consistent placement
- Add distinct visual: orange outline + sparkle icon when inactive, solid orange when active

### 4d. Template Button Relocation
- Move template button from floating position into left toolbar group
- Style as secondary/outlined button: `border border-gray-200 text-gray-600 hover:border-orange-300`

---

## Issue 5: Publish Modal — Folder Picker + Restricted Users

**File:** `src/components/editor-publish-modal.tsx`

### 5a. Searchable Folder Picker
Replace the current `<select>` dropdown with a custom searchable component.

**Implementation:**
1. Add state: `folderSearch: string`, `folderDropdownOpen: boolean`
2. Create inline component (or extract to `src/components/folder-picker.tsx` if >60 lines)
3. Structure:
   ```
   [Text input with search icon]
   [Dropdown panel]:
     "Gan day" (Recent) — last 3 folders from localStorage key `recentFolders`
     "Goi y" (Suggested) — filter by currentUser.department matching folder
     "Tat ca" (All) — filtered by search text
   ```
4. On folder select: set `folderId`, save to `recentFolders` in localStorage (keep last 5)
5. Click-outside closes dropdown (use existing pattern from codebase or `useRef` + event listener)

**Data flow:**
- Read folders from `state.folders` (from AppContext)
- `recentFolders` stored as `string[]` of folder IDs in localStorage

### 5b. Restricted User Sharing
When `viewPermission === 'restricted'`, show a "Nguoi duoc chia se" (Shared With) section.

**Implementation:**
1. Add state: `sharedWith: string[]`, `sharedInput: string`
2. Render conditionally below the permission selector when `viewPermission === 'restricted'`
3. UI pattern: tag-input (match existing Tags input in the same modal)
   - Text input for typing user name/email
   - On Enter or comma: add to `sharedWith[]`, clear input
   - Each tag shows name + X button to remove
   - Style: `bg-orange-50 text-orange-700 rounded-full px-3 py-1`
4. Pass `sharedWith` to publish handler (extend existing publish function signature)

---

## Related Code Files
- `src/components/Editor.tsx` — toolbar restructure, content alignment, AI button
- `src/components/editor-publish-modal.tsx` — folder picker, restricted sharing
- `src/components/folder-picker.tsx` — new file (only if folder picker exceeds 60 lines)
- `src/store/useAppStore.ts` or `src/context/AppContext.tsx` — verify folder data shape

## Todo
- [x] 4a: Restructure toolbar into left/right groups with labels
- [x] 4b: Fix content alignment (remove mx-auto, use pl-6 pr-8)
- [x] 4c: Make AI mode button always visible, move to toolbar
- [x] 4d: Move template button to left toolbar group, style as secondary
- [x] 5a: Build searchable folder picker with recent/suggested/all sections
- [x] 5b: Add shared-with tag input when viewPermission === 'restricted'
- [x] Run `tsc --noEmit` after each sub-issue
- [x] Visual check: toolbar grouped, content aligned, folder picker works, sharing tags work

## Success Criteria
- Editor toolbar has clear visual grouping (Format | AI)
- Content area starts from natural left edge, not floating center
- AI mode button visible on all screen sizes
- Folder picker searchable with recent/suggested sections
- Restricted permission shows tag-input for shared users
- Zero TypeScript errors

## Risk Assessment
- **Toolbar restructure** may break on very small screens — test at 320px width
- **Folder picker** click-outside handler must not conflict with modal backdrop click
- **SharedWith state** not persisted to backend yet — plan includes UI only; backend integration is separate
