import { StoryContent } from '@/types/story';
import { terminalVelocityContent } from '@/stories/terminal-velocity';

const registry: Record<string, StoryContent> = {
  [terminalVelocityContent.story.id]: terminalVelocityContent
};

export function listStories(): StoryContent['story'][] {
  return Object.values(registry).map((entry) => entry.story);
}

export function getStoryContent(storyId: string): StoryContent | null {
  return registry[storyId] ?? null;
}
