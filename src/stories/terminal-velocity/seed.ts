import { terminalVelocityContent } from './index';

/**
 * Seed payload generator for DB ingestion pipelines.
 * This keeps story content canonical in the repo while allowing
 * external scripts to insert into Supabase tables.
 */
export function getTerminalVelocitySeedPayload() {
  return {
    story: terminalVelocityContent.story,
    evidence: terminalVelocityContent.evidence,
    characters: terminalVelocityContent.characters,
    dialogues: terminalVelocityContent.dialogues,
    deductions: terminalVelocityContent.deductions,
    timeline: terminalVelocityContent.timeline,
    metadata: terminalVelocityContent.metadata
  };
}
