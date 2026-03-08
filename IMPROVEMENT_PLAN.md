# OpenCase UI/UX Improvement Plan

**Goal:** Transform from bland text-based interface to immersive detective game experience (Cryptic Killers vibe)

**Date Started:** 2026-03-07
**Status:** In Progress

---

## Current State Assessment

### Problems Identified:
1. ❌ **Looks like text boxes** - no game feel
2. ❌ **Bland graphics** - simple gradient SVGs, no artwork
3. ❌ **Grayscale evidence** - everything looks dull
4. ❌ **Cluttered UI** - 6 floating panels, overlays, tiny text
5. ❌ **No immersion** - doesn't feel like detective work
6. ❌ **Poor mobile UX** - small buttons, multiple panels

### What Works:
- ✅ Core game logic (phases, evidence, accusation system)
- ✅ Multiplayer framework
- ✅ Build/deployment setup

---

## Phase 1: Visual Foundation (CURRENT)

**Goal:** Make it look like a game, not a web form

### 1.1 Color & Contrast ✅
- [x] Remove grayscale filter from evidence images
- [x] Increase all font sizes (14px → 16px minimum)
- [x] Better color coding (amber for clues, cyan for analyzer, emerald for success)
- [x] Reduce overlay opacity (grain removed, vignette at 40%)

### 1.2 Layout Simplification ✅ (Partial)
- [x] Improved toolbar with better visual states
- [x] Enhanced floating panels (bigger, clearer headers)
- [x] Scene images remain as backgrounds (works well)
- [x] Added progress indicators (deductions, puzzles)

### 1.3 Typography & Spacing ✅
- [x] All text sizes increased (16px+ minimum)
- [x] Better line height and letter spacing
- [x] All buttons 44px+ min height
- [x] Improved contrast with amber/color accents

---

## Phase 2: Game Feel ⏳

**Goal:** Make interactions feel rewarding and detective-like

### 2.1 Evidence Interaction ✅
- [x] Card-based evidence display with status badges
- [x] Better visual states (collected, examined, analyzed)
- [ ] Flip animation for analyzing (front = image, back = results)
- [ ] Zoom/pan on evidence images
- [x] Collection feedback via toast notifications

### 2.2 Scene Exploration ⏳
- [ ] Click hotspots on scenes to discover evidence
- [ ] Magnifying glass cursor on hover
- [ ] Pulse/glow on discoverable items
- [ ] Satisfying "found it" animation

### 2.3 Navigation & Flow ✅
- [x] Toast notifications for player actions
- [x] Progress tracking (deductions, puzzles, evidence)
- [x] Phase transition animations (framer-motion)
- [x] Better visual states throughout

---

## Phase 3: Immersion & Polish

**Goal:** Create memorable detective experience

### 3.1 Accusation Board
- [ ] Cork board aesthetic
- [ ] Drag-and-drop evidence pinning
- [ ] Red string connections
- [ ] Build your case visually

### 3.2 Interrogation Redesign
- [ ] Split-screen: suspect portrait + dialogue
- [ ] Branching tree visualization
- [ ] Suspect reactions/tells
- [ ] Tension-building UI

### 3.3 Cinematic Moments
- [ ] Intro splash screen
- [ ] Deduction reveal animations
- [ ] Confession cutscene
- [ ] Win/lose screens with feedback

### 3.4 Audio & Motion
- [ ] Background ambience
- [ ] UI sound effects (subtle)
- [ ] Smooth transitions
- [ ] Micro-interactions

---

## Phase 4: Assets & Art

**Goal:** Replace placeholder SVGs with compelling visuals

### 4.1 Evidence Assets
- [ ] Real-looking documents (receipts, reports, photos)
- [ ] Aged paper texture
- [ ] Handwritten notes
- [ ] Realistic objects

### 4.2 Character Portraits
- [ ] Detailed character art (or AI-generated)
- [ ] Multiple expressions
- [ ] Consistent style

### 4.3 Scene Backgrounds
- [ ] Atmospheric crime scenes
- [ ] FBI office aesthetic
- [ ] Private jet interior
- [ ] Environmental storytelling

---

## Commit Log

- `ca886aa` - fix: update JSON import syntax to 'with' for Node 22 compatibility
- `3dc5ef3` - feat: Phase 1.1 - improve visual foundation (remove grayscale, bigger fonts, better colors)
- `186dbce` - feat: improve homepage design - better story cards, gradient text, improved forms
- `557d937` - feat: improve chapter cards and deduction panel - more cinematic and readable
- `f72fe62` - feat: improve dialogue and analyzer interfaces - more immersive and polished
- `e6638a3` - docs: update improvement plan with completed Phase 1.1 tasks
- `1c7f15e` - feat: improve evidence display - card-based layout, status badges, better selection
- `341bc06` - feat: add toast notification system for player feedback
- `bf218fe` - feat: improve puzzle panel design - clearer layout, better feedback, visual states
- `ebc942a` - feat: redesign room lobby - much more polished and game-like

---

## Next Actions

1. Start with Phase 1.1 (color, contrast, grayscale removal)
2. Test on localhost
3. Phase 1.2 (layout simplification)
4. Commit and update progress
