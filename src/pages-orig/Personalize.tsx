import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CharacterImporter, CharacterData } from "@/components/CharacterImporter";
import { PersonalizedAnalysis } from "@/components/PersonalizedAnalysis";
import { ROICharts } from "@/components/ROICharts";
import { PDFExporter } from "@/components/PDFExporter";
import { ArrowLeft, Trash2, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function Personalize() {
  const [, setLocation] = useLocation();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    // Carregar personagens salvos do localStorage
    const saved = localStorage.getItem("bdo_characters");
    if (saved) {
      let characters = JSON.parse(saved);
      
      // Migracao: adicionar importId aos dados legados
      characters = characters.map((char: CharacterData, idx: number) => {
        if (!char.importId) {
          // Gerar importId para dados legados
          return {
            ...char,
            importId: `${char.characterId}_${char.importedAt || `legacy-${idx}`}`
          };
        }
        return char;
      });
      
      // Deduplicar: manter apenas a entrada mais recente de cada personagem
      const seen = new Map<string, CharacterData>();
      characters.forEach((char: CharacterData) => {
        const existing = seen.get(char.characterId);
        // Manter a entrada com importedAt mais recente
        if (!existing || new Date(char.importedAt) > new Date(existing.importedAt)) {
          seen.set(char.characterId, char);
        }
      });
      
      // Converter de volta para array e salvar
      const dedupedCharacters = Array.from(seen.values());
      localStorage.setItem("bdo_characters", JSON.stringify(dedupedCharacters));
      
      setSavedCharacters(dedupedCharacters);
      if (dedupedCharacters.length > 0) {
        setCharacter(dedupedCharacters[dedupedCharacters.length - 1]); // Usar o ultimo importado
      }
    }
  }, []);

  const handleCharacterImported = (data: CharacterData) => {
    setCharacter(data);
    setSavedCharacters(prev => [...prev, data]);
  };

  const handleSelectCharacter = (char: CharacterData) => {
    setCharacter(char);
  };

  const handleDeleteCharacter = (characterId: string) => {
    const updated = savedCharacters.filter(c => c.characterId !== characterId);
    setSavedCharacters(updated);
    localStorage.setItem("bdo_characters", JSON.stringify(updated));
    if (character?.characterId === characterId) {
      setCharacter(updated.length > 0 ? updated[updated.length - 1] : null);
    }
  };

  const handleClearAll = () => {
    if (confirm("Tem certeza que deseja limpar todos os personagens salvos?")) {
      localStorage.removeItem("bdo_characters");
      setSavedCharacters([]);
      setCharacter(null);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="hover:bg-card"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-accent">Personalizar Análise</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Importer */}
            <div className="lg:col-span-1">
              <CharacterImporter onCharacterImported={handleCharacterImported} />

              {/* Saved Characters */}
              {savedCharacters.length > 0 && (
                <Card className="border-border mt-6">
                  <CardHeader>
                    <CardTitle className="text-sm">Personagens Salvos</CardTitle>
                    <CardDescription className="text-xs">
                      {savedCharacters.length} personagem(ns) no histórico
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {savedCharacters.map((char) => (
                      <div
                        key={char.importId || char.characterId}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          character?.characterId === char.characterId
                            ? "bg-accent/10 border-accent"
                            : "bg-card border-border hover:border-accent/50"
                        }`}
                        onClick={() => handleSelectCharacter(char)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-medium text-sm text-foreground">GS {char.gs}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCharacter(char.characterId);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-900/20 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(char.importedAt)}
                        </div>
                      </div>
                    ))}
                    {savedCharacters.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="w-full mt-2 border-red-900/50 text-red-400 hover:bg-red-900/20"
                      >
                        Limpar Histórico
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Analysis */}
            <div className="lg:col-span-2">
              {character ? (
                <div className="space-y-6">
                  <PersonalizedAnalysis character={character} />
                  <ROICharts />
                  <PDFExporter character={character} />
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="text-muted-foreground mb-4">
                      <div className="text-5xl mb-4">📊</div>
                      <p className="text-lg font-medium mb-2">Nenhum personagem importado</p>
                      <p className="text-sm">
                        Importe seu personagem do Garmoth para ver uma análise personalizada
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Seus dados são salvos localmente no navegador. Nenhuma informação é enviada para servidores.</p>
        </div>
      </footer>
    </div>
  );
}
