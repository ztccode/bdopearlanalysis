import { CharacterData } from "@/components/CharacterImporter";

/**
 * Mocked Garmoth API integration.
 *
 * The real Garmoth screenshot endpoint cannot be reached from the browser
 * (CORS) and the original Playwright-based scraper does not run in this
 * runtime. This module returns a deterministic fake character so the
 * personalize flow stays usable.
 */

const samplePresets: Record<string, Partial<CharacterData>> = {
  endgame: { ap: 322, dp: 410, accuracy: 1180, criticalHitDamage: 35, evasion: 540, damageReduction: 480, silver: 95_000_000_000 },
  midgame: { ap: 285, dp: 360, accuracy: 980, criticalHitDamage: 28, evasion: 460, damageReduction: 410, silver: 18_000_000_000 },
  early: { ap: 261, dp: 320, accuracy: 820, criticalHitDamage: 22, evasion: 380, damageReduction: 340, silver: 4_500_000_000 },
};

function pickPreset(seed: string) {
  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const keys = Object.keys(samplePresets);
  return samplePresets[keys[hash % keys.length]];
}

export async function fetchGarmothCharacter(characterId: string): Promise<CharacterData> {
  // Simulated network delay
  await new Promise((r) => setTimeout(r, 600));

  const preset = pickPreset(characterId);
  const ap = preset.ap ?? 280;
  const dp = preset.dp ?? 360;

  return {
    characterId,
    importId: `${characterId}_${Date.now()}`,
    name: `Aventureiro ${characterId.slice(0, 4).toUpperCase()}`,
    ap,
    dp,
    gs: ap + dp,
    accuracy: preset.accuracy ?? 900,
    criticalHitDamage: preset.criticalHitDamage ?? 25,
    evasion: preset.evasion ?? 420,
    damageReduction: preset.damageReduction ?? 380,
    silver: preset.silver ?? 10_000_000_000,
    importedAt: new Date().toISOString(),
  };
}

export function extractCharacterIdFromUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  // URL like https://garmoth.com/character/<id>
  const match = trimmed.match(/garmoth\.com\/character\/([A-Za-z0-9]+)/);
  if (match) return match[1];
  // Already an ID
  if (/^[A-Za-z0-9]{4,}$/.test(trimmed)) return trimmed;
  return null;
}

export function isValidCharacterId(id: string): boolean {
  return /^[A-Za-z0-9]{4,}$/.test(id.trim());
}
