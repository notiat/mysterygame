# Story Pack Template

Create a new story at `src/stories/<story-slug>/` with:

- `config.ts` exporting a `Story`
- `content/` folder with:
  - `evidence.ts`
  - `characters.ts`
  - `dialogues.ts`
  - `deductions.ts`
  - `timeline.ts`
  - `metadata.ts`
  - `index.ts`
- `index.ts` exporting a `StoryContent`
- `README.md`

Then register it in `src/lib/platform/storyRegistry.ts`.
