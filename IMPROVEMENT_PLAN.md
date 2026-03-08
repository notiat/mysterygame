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

### 1.2 Layout Simplification ⏳
- [ ] Replace 6-button toolbar with 3-tab system (Investigate / Interrogate / Accuse)
- [ ] Remove floating panels, use full-screen modals
- [ ] Bigger scene images (hero element, not background)
- [ ] Clear progress indicators

### 1.3 Typography & Spacing ⏳
- [ ] Increase all text sizes
- [ ] Better line height and letter spacing
- [ ] Larger hit targets (min 44px)
- [ ] Readable contrast ratios

---

## Phase 2: Game Feel

**Goal:** Make interactions feel rewarding and detective-like

### 2.1 Evidence Interaction
- [ ] Card-based evidence display (swipe/browse)
- [ ] Flip animation for analyzing (front = image, back = results)
- [ ] Zoom/pan on evidence images
- [ ] Collection animation/feedback

### 2.2 Scene Exploration
- [ ] Click hotspots on scenes to discover evidence
- [ ] Magnifying glass cursor on hover
- [ ] Pulse/glow on discoverable items
- [ ] Satisfying "found it" animation

### 2.3 Navigation & Flow
- [ ] Clear "what to do next" prompts
- [ ] Progress tracking (X/25 clues found)
- [ ] Phase transition animations
- [ ] Better loading states

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

---

## Next Actions

1. Start with Phase 1.1 (color, contrast, grayscale removal)
2. Test on localhost
3. Phase 1.2 (layout simplification)
4. Commit and update progress
