import { DialogueNode } from '@/types/story';

export function getDialogueRootForCharacter(dialogues: DialogueNode[], characterId: string) {
  return dialogues.find((node) => node.characterId === characterId) ?? null;
}

export function getDialogueNode(dialogues: DialogueNode[], nodeId: string | null) {
  if (!nodeId) return null;
  return dialogues.find((node) => node.id === nodeId) ?? null;
}
