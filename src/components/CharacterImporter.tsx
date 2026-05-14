import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { fetchGarmothCharacter, extractCharacterIdFromUrl, isValidCharacterId } from "@/lib/garmothApi";

export interface CharacterData {
  characterId: string;
  importId?: string; // ID único para cada importação (previne chaves duplicadas)
  name: string;
  ap: number;
  dp: number;
  gs: number;
  accuracy: number;
  criticalHitDamage: number;
  evasion: number;
  damageReduction: number;
  silver: number;
  importedAt: string;
}

interface CharacterImporterProps {
  onCharacterImported: (data: CharacterData) => void;
}

export function CharacterImporter({ onCharacterImported }: CharacterImporterProps) {
  const [garmothUrl, setGarmothUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const parseGarmothUrl = (url: string): string | null => {
    // Extrai o ID do personagem da URL usando função do lib
    return extractCharacterIdFromUrl(url);
  };

  const fetchCharacterData = async (characterId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validar ID do personagem
      if (!isValidCharacterId(characterId)) {
        setError("ID de personagem inválido. Verifique o link.");
        setLoading(false);
        return;
      }

      // Buscar dados reais do Garmoth
      const characterData = await fetchGarmothCharacter(characterId);

      // Gerar ID único para cada importação (Garmoth ID + timestamp)
      // Isso previne chaves duplicadas quando o mesmo personagem é importado múltiplas vezes
      const uniqueImportId = `${characterData.characterId}_${Date.now()}`;
      const enhancedCharacterData = {
        ...characterData,
        importId: uniqueImportId
      };

      // Salvar no localStorage
      const savedCharacters = JSON.parse(localStorage.getItem("bdo_characters") || "[]");
      savedCharacters.push(enhancedCharacterData);
      localStorage.setItem("bdo_characters", JSON.stringify(savedCharacters));

      onCharacterImported(enhancedCharacterData as CharacterData);
      setSuccess(true);
      setGarmothUrl("");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar personagem. Verifique o link e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!garmothUrl.trim()) {
      setError("Por favor, insira um link do Garmoth");
      return;
    }

    const characterId = parseGarmothUrl(garmothUrl);
    if (!characterId) {
      setError("Link inválido. Use o formato: https://garmoth.com/character/{ID}/screenshot");
      return;
    }

    fetchCharacterData(characterId);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setGarmothUrl(text);
      setError(null);
    } catch {
      setError("Não foi possível acessar a área de transferência");
    }
  };

  return (
    <Card className="border-border bg-gradient-to-br from-card to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-accent" />
          Importar Personagem do Garmoth
        </CardTitle>
        <CardDescription>
          Cole o link do seu personagem do Garmoth para personalizar a análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Link do Garmoth (formato: garmoth.com/character/...)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="https://garmoth.com/character/doy68r5Dxw/screenshot"
              value={garmothUrl}
              onChange={(e) => {
                setGarmothUrl(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={handlePaste}
              variant="outline"
              disabled={loading}
              className="border-border hover:bg-card"
            >
              Colar
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-2 p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex gap-2 p-3 bg-green-900/20 border border-green-900/50 rounded-lg">
            <div className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5">✓</div>
            <p className="text-sm text-green-100">Personagem importado com sucesso!</p>
          </div>
        )}

        {/* Import Button */}
        <Button
          onClick={handleImport}
          disabled={loading || !garmothUrl.trim()}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importando...
            </>
          ) : (
            "Importar Personagem"
          )}
        </Button>

        {/* Instructions */}
        <div className="p-4 bg-card border border-border rounded-lg space-y-2">
          <h4 className="font-semibold text-foreground text-sm">Como encontrar seu link:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Acesse <span className="text-accent">garmoth.com</span></li>
            <li>Vá para "Gear Planner" e selecione seu personagem</li>
            <li>Clique em "Screenshot it"</li>
            <li>Copie o link da página (garmoth.com/character/...)</li>
            <li>Cole aqui e clique em "Importar Personagem"</li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Badge className="bg-blue-900/30 text-blue-100 border border-blue-900/50 justify-center py-2">
            Análise Personalizada
          </Badge>
          <Badge className="bg-purple-900/30 text-purple-100 border border-purple-900/50 justify-center py-2">
            Recomendações Precisas
          </Badge>
          <Badge className="bg-green-900/30 text-green-100 border border-green-900/50 justify-center py-2">
            ROI Otimizado
          </Badge>
          <Badge className="bg-yellow-900/30 text-yellow-100 border border-yellow-900/50 justify-center py-2">
            Dados Salvos Localmente
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
