---
title: "Phase 1 — Fast Fixes"
status: completed
priority: P1
effort: 1h
completed: 2026-03-25
---

# Phase 1 — Fast Fixes

## Overview
Three isolated, low-risk fixes: invisible stats icons, unused modal sidebar, broken grid layout.

---

## Fix 1: MyArticles Stats Icons Invisible

**File:** `src/components/MyArticles.tsx` lines 107–125

**Root Cause:** `bg-clip-text` + `color: transparent` is a text-gradient technique — does not work on SVG `<Icon>` components rendered by Lucide. The SVG `fill`/`stroke` becomes transparent, icons vanish.

**Fix:** Replace the gradient-on-SVG approach with direct color classes per icon.

**Before (line 118):**
```tsx
<Icon size={20} className={`bg-gradient-to-br ${stat.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
```

**After:**
```tsx
<Icon size={20} className={stat.iconColor} />
```

**Data array update** — add `iconColor` field, remove `color` from Icon usage:
```tsx
{ label: 'Bai viet', value: published.length, icon: BookOpen, iconColor: 'text-blue-500', ... },
{ label: 'Luot xem', value: totalViews.toLocaleString(), icon: Eye, iconColor: 'text-green-500', ... },
{ label: 'Duoc thap lua', value: totalLikes, icon: Flame, iconColor: 'text-orange-500', ... },
{ label: 'Binh luan', value: totalComments, icon: MessageSquare, iconColor: 'text-purple-500', ... },
```

Keep the gradient `bg` on the container `div` — that renders correctly.

---

## Fix 2: Remove "Lien ket Tri thuc" Sidebar from ArticleModal

**File:** `src/components/ArticleModal.tsx`

**Steps:**
1. Delete lines 218–270 (entire right sidebar `<div>` block starting with `{/* Right Sidebar: Knowledge Context */}`)
2. Delete lines 25–28 (`relatedArticles` variable)
3. Remove unused import `ChevronRight` from lucide-react import (line 2) — only if not used elsewhere in the file
4. The main content `flex-1` div auto-expands to fill freed space — no layout change needed

**Verify:** grep `ChevronRight` usage in rest of file before removing import.

---

## Fix 3: ArticleFullView Column Layout Gap

**File:** `src/components/ArticleFullView.tsx`

**Root Cause:** `grid-cols-12` layout:
- Left aside: `hidden lg:flex col-span-3` (visible at lg+)
- Center: `col-span-12 lg:col-span-6` (6 cols at lg)
- Right aside: `hidden xl:flex col-span-3` (visible at xl+ only)

At `lg` breakpoint: left=3 + center=6 = 9 cols used, 3 cols wasted on right. Content appears left-shifted.

**Fix (line 200):** Change center main from:
```
col-span-12 lg:col-span-6
```
to:
```
col-span-12 lg:col-span-9 xl:col-span-6
```

This makes center fill remaining 9 cols at `lg` (when right aside is hidden), and shrink to 6 at `xl` (when right aside appears).

---

## Related Code Files
- `src/components/MyArticles.tsx` — modify lines 108–118
- `src/components/ArticleModal.tsx` — delete lines 218–270, 25–28, clean imports
- `src/components/ArticleFullView.tsx` — modify line 200

## Todo
- [x] Fix 1: Replace SVG gradient with direct `text-{color}` classes in MyArticles
- [x] Fix 2: Remove right sidebar + `relatedArticles` variable + unused imports in ArticleModal
- [x] Fix 3: Update col-span to `lg:col-span-9 xl:col-span-6` in ArticleFullView
- [x] Run `tsc --noEmit` to verify no compile errors
- [x] Visual check: icons visible, modal clean, fullview centered

## Success Criteria
- Stats icons render in correct brand colors
- ArticleModal shows no right sidebar, content fills width
- ArticleFullView content is centered at all breakpoints (lg and xl)
- Zero TypeScript errors
