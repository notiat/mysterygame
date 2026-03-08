import { getStoryContent, listStories } from './storyRegistry';

export async function loadStories() {
  return listStories();
}

export async function loadStoryById(storyId: string) {
  return getStoryContent(storyId);
}
