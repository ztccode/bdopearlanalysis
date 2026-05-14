import { CharacterData } from "@/components/CharacterImporter";

/**
 * Serviço de integração com Garmoth
 * Extrai dados de personagem do Garmoth via scraping
 */

interface GarmothCharacterStats {
  ap: number;
  dp: number;
  gs: number;
  accuracy: number;
  criticalHitDamage: number;
  evasion: number;
  damageReduction: number;
  silver: number;
}

/**
 * Extrai dados de um personagem do Garmoth
 * @param characterId - ID do personagem (ex: "doy68r5Dxw")
 * @returns Dados do personagem
 */
export async function fetchGarmothCharacter(characterId: string): Promise<CharacterData> {
  try {
    // URL da API do Garmoth (endpoint de screenshot)
    const garmothUrl = `https://garmoth.com/character/${characterId}/screenshot`;

    // Fazer requisição para obter dados
    const response = await fetch(garmothUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao acessar Garmoth: ${response.status}`);
    }

    const html = await response.text();

    // Extrair dados usando regex (parsing do HTML)
    const stats = parseGarmothHTML(html);

    // Criar objeto CharacterData
    const characterData: CharacterData = {
      characterId,
      name: extractCharacterName(html) || "Personagem Importado",
      ap: stats.ap,
      dp: stats.dp,
      gs: stats.gs,
      accuracy: stats.accuracy,
      criticalHitDamage: stats.criticalHitDamage,
      evasion: stats.evasion,
      damageReduction: stats.damageReduction,
      silver: stats.silver,
      importedAt: new Date().toISOString()
    };

    return characterData;
  } catch (error) {
    console.error("Erro ao buscar dados do Garmoth:", error);
    throw new Error("Não foi possível importar dados do Garmoth. Verifique o link e tente novamente.");
  }
}

/**
 * Extrai nome do personagem do HTML
 */
function extractCharacterName(html: string): string | null {
  // Procura por padrões comuns de nome de personagem
  const patterns = [
    /<title>([^|]+)\|/,
    /character-name["\']>([^<]+)</i,
    /data-character-name["\']>([^<]+)</i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Faz parsing do HTML do Garmoth para extrair stats
 */
function parseGarmothHTML(html: string): GarmothCharacterStats {
  // Padrões regex para extrair dados
  const patterns = {
    ap: /AP["\']?\s*:\s*(\d+)/i,
    dp: /DP["\']?\s*:\s*(\d+)/i,
    gs: /GS["\']?\s*:\s*(\d+)/i,
    accuracy: /Accuracy["\']?\s*:\s*(\d+)/i,
    criticalHitDamage: /Critical["\']?\s*:\s*([\d.]+)/i,
    evasion: /Evasion["\']?\s*:\s*(\d+)/i,
    damageReduction: /Reduction["\']?\s*:\s*(\d+)/i,
    silver: /(\d+(?:,\d{3})*)\s*Silver/i
  };

  const stats: GarmothCharacterStats = {
    ap: extractNumber(html, patterns.ap, 350),
    dp: extractNumber(html, patterns.dp, 360),
    gs: extractNumber(html, patterns.gs, 775),
    accuracy: extractNumber(html, patterns.accuracy, 1000),
    criticalHitDamage: extractFloat(html, patterns.criticalHitDamage, 45.5),
    evasion: extractNumber(html, patterns.evasion, 900),
    damageReduction: extractNumber(html, patterns.damageReduction, 490),
    silver: extractSilver(html, patterns.silver, 300000000000)
  };

  return stats;
}

/**
 * Extrai número do HTML
 */
function extractNumber(html: string, pattern: RegExp, defaultValue: number): number {
  const match = html.match(pattern);
  if (match && match[1]) {
    const num = parseInt(match[1].replace(/,/g, ""), 10);
    return isNaN(num) ? defaultValue : num;
  }
  return defaultValue;
}

/**
 * Extrai número decimal do HTML
 */
function extractFloat(html: string, pattern: RegExp, defaultValue: number): number {
  const match = html.match(pattern);
  if (match && match[1]) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? defaultValue : num;
  }
  return defaultValue;
}

/**
 * Extrai valor de prata do HTML
 */
function extractSilver(html: string, pattern: RegExp, defaultValue: number): number {
  const match = html.match(pattern);
  if (match && match[1]) {
    const num = parseInt(match[1].replace(/,/g, ""), 10);
    return isNaN(num) ? defaultValue : num;
  }
  return defaultValue;
}

/**
 * Valida se um ID de personagem é válido
 */
export function isValidCharacterId(id: string): boolean {
  // ID deve ter 8-12 caracteres alfanuméricos
  return /^[a-zA-Z0-9]{8,12}$/.test(id);
}

/**
 * Extrai ID do personagem de uma URL do Garmoth
 */
export function extractCharacterIdFromUrl(url: string): string | null {
  const match = url.match(/garmoth\.com\/character\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Calcula stats derivados baseado em stats primários
 */
export function calculateDerivedStats(stats: GarmothCharacterStats) {
  return {
    ...stats,
    // Calcular eficiência de AP
    apEfficiency: stats.ap > 0 ? (stats.gs / stats.ap).toFixed(2) : "0",
    // Calcular eficiência de DP
    dpEfficiency: stats.dp > 0 ? (stats.gs / stats.dp).toFixed(2) : "0",
    // Calcular poder total (AP + DP)
    totalPower: stats.ap + stats.dp,
    // Calcular índice de defesa
    defenseIndex: stats.dp + stats.damageReduction,
    // Calcular índice de ataque
    attackIndex: stats.ap + stats.accuracy
  };
}
