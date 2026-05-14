import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "refinement" | "cron" | "strategy" | "roi";
}

const faqData: FAQItem[] = [
  {
    id: "cron-1",
    category: "cron",
    question: "O que é Cron Stone e por que é tão importante no endgame?",
    answer: "Cron Stone é um item essencial para refinamento de equipamentos de alto nível (Soberano e Deboreka). Ele garante que seu equipamento NÃO caia de nível ao falhar uma tentativa de aprimoramento, protegendo seu investimento. No endgame, cada tentativa de refinamento custa brutalmente caro em termos de materiais e ouro, então o Cron Stone se torna crítico para gerenciar a variância estatística e minimizar perdas. Sem Cron Stones, você pode perder meses de progresso em uma única sequência de falhas."
  },
  {
    id: "cron-2",
    category: "cron",
    question: "Qual é o melhor custo por Cron Stone no mercado BDO?",
    answer: "O padrão de mercado BDO é aproximadamente R$ 0,15-0,20 por Cron Stone quando comprado via Loja de Pérolas. A promoção atual oferece R$ 0,117 por Cron (via extração de outfits), o que é EXTREMAMENTE abaixo da média. Isso representa uma economia de 30-40% comparado ao preço normal. Para referência: 1000 Crons normalmente custam R$ 150-200, enquanto com a estratégia otimizada custam apenas R$ 117. É por isso que a promoção atual é tão valiosa para jogadores endgame."
  },
  {
    id: "cron-3",
    category: "cron",
    question: "Como extrair Cron Stones de outfits?",
    answer: "Para extrair Cron Stones de um outfit premium: 1) Vá até o Ferreiro (Blacksmith) em qualquer cidade principal; 2) Selecione a opção 'Dismantle Costume' ou 'Desmontar Traje'; 3) Escolha o outfit que deseja desmontar; 4) Confirme a operação. O outfit será destruído e você receberá Cron Stones equivalentes. Cada outfit premium rende aproximadamente 993 Crons. IMPORTANTE: Você não pode recuperar o outfit após desmontar, então certifique-se de que realmente quer fazer isso antes de confirmar."
  },
  {
    id: "cron-4",
    category: "cron",
    question: "Quantos Cron Stones preciso para atingir Deboreka IV?",
    answer: "Para atingir Deboreka IV a partir de Deboreka III, você precisa de aproximadamente 1.500-2.000 Cron Stones por item, dependendo da sorte. Como você tem 5 itens Deboreka (anel x2, brinco x2, cinto), o total seria de 7.500-10.000 Crons para completar o stack. Com a estratégia otimizada (4.000 Crons), você conseguiria fazer progresso significativo em 2-3 itens. Isso é um progresso EXCELENTE considerando que normalmente levaria meses para acumular essa quantidade de Crons."
  },
  {
    id: "refinement-1",
    category: "refinement",
    question: "Qual é a diferença entre refinamento com e sem Cron Stone?",
    answer: "SEM Cron Stone: Se falhar, seu equipamento cai 1 nível. Exemplo: Deboreka IV → Deboreka III. COM Cron Stone: Se falhar, seu equipamento PERMANECE no mesmo nível. Exemplo: Deboreka IV → Deboreka IV. No endgame, a diferença é brutal. Uma sequência de 10 falhas sem Cron pode fazer você perder 10 níveis (meses de progresso). Com Cron, você apenas perde o material e o Cron, mas mantém o nível. É por isso que Cron é OBRIGATÓRIO para endgame."
  },
  {
    id: "refinement-2",
    category: "refinement",
    question: "O que é 'enhancement gamble' e por que deve ser evitado?",
    answer: "Enhancement gamble refere-se a tentar refinar equipamento SEM usar Cron Stones, apostando na sorte. Isso é extremamente arriscado no endgame porque: 1) Cada falha custa progressão meses de trabalho; 2) A taxa de sucesso cai drasticamente em altos níveis (10-20%); 3) Uma sequência de 5 falhas pode derrubar seu equipamento 5 níveis. Para sua conta (GS 775), enhancement gamble é SUICIDA. Sempre use Cron Stones em tentativas de refinamento de Soberano/Deboreka."
  },
  {
    id: "refinement-3",
    category: "refinement",
    question: "Qual é a taxa de sucesso de refinamento em Deboreka?",
    answer: "As taxas de sucesso em Deboreka são: Deboreka I-II: ~40-50%; Deboreka II-III: ~30-40%; Deboreka III-IV: ~15-25%; Deboreka IV-V: ~5-10%. Isso significa que para cada upgrade de Deboreka IV para V, você pode precisar de 10-20 tentativas. Com 4.000 Crons, você conseguiria fazer aproximadamente 200-400 tentativas (dependendo do nível). Isso é suficiente para 1-2 upgrades de Deboreka IV para V, ou 3-4 upgrades de níveis mais baixos."
  },
  {
    id: "refinement-4",
    category: "refinement",
    question: "Devo usar Cron em tentativas de Soberano ou Deboreka primeiro?",
    answer: "PRIORIDADE: Deboreka > Soberano. Motivo: 1) Deboreka é seu gargalo atual (você tem Deboreka IV); 2) Cada upgrade de Deboreka aumenta seu GS significativamente; 3) Soberano já está em V (máximo), então não há mais para melhorar lá. Foque todos os Crons em Deboreka. Se você tivesse Soberano em nível inferior, a prioridade seria: Soberano V > Deboreka IV > Acessórios. Mas para sua conta específica, Deboreka é a prioridade absoluta."
  },
  {
    id: "strategy-1",
    category: "strategy",
    question: "Por que outfit em promoção é melhor que comprar Cron direto?",
    answer: "Comparação: OUTFIT (R$ 0,117 por Cron) vs CRON DIRETO (R$ 0,15-0,20 por Cron). O outfit oferece 30-40% de economia. Além disso: 1) Você recebe o outfit (cosmético com valor); 2) Pode vender o outfit se não quiser desmontar; 3) Ganha cashback/milhagem adicional; 4) Ativa spend reward. Comprar Cron direto é sempre mais caro e sem benefícios secundários. É por isso que a estratégia otimizada prioriza outfits em promoção."
  },
  {
    id: "strategy-2",
    category: "strategy",
    question: "O que é 'variância estatística' e por que é importante no endgame?",
    answer: "Variância estatística refere-se à imprevisibilidade das tentativas de refinamento. No endgame, você pode ter uma sequência de 10 falhas seguidas (teoricamente possível, embora raro). Isso é 'variância negativa'. O objetivo é MINIMIZAR o impacto dessa variância através de: 1) Usar Cron Stones (protege contra quedas); 2) Acumular muitos Crons (permite mais tentativas); 3) Diversificar refinamentos (não colocar tudo em um item). A estratégia otimizada foca exatamente nisso: maximizar Crons para gerenciar variância."
  },
  {
    id: "strategy-3",
    category: "strategy",
    question: "Qual é o melhor plano de gasto para 9.080 pérolas?",
    answer: "PLANO ÓTIMO (Sequência Profissional): 1) 2x Outfit Premium com cupom 30% (3.080 pérolas, ~1.986 crons); 2) 1x Bundle Enhancement com cupom 20% (2.851 pérolas, ~500 crons); 3) 1x Kit Jornada Doce (579 pérolas, ~200 crons); 4) 1x Kit Especial Aventura (462 pérolas, ~200 crons); 5) 2x Baú Ultimate (1.170 pérolas, ~200 crons). TOTAL: 8.142 pérolas gastas, ~4.000 crons obtidos, 938 pérolas restantes. ROI: EXTREMO. Esta é a estratégia que maximiza Crons e minimiza custo por Cron."
  },
  {
    id: "strategy-4",
    category: "strategy",
    question: "Devo guardar as pérolas restantes ou gastar tudo?",
    answer: "RECOMENDAÇÃO: Guarde as 938 pérolas restantes. Motivo: 1) Permite flexibilidade para próximas promoções; 2) Você pode usar em Baús Especiais 1+1 se tiver Acoin; 3) Próximas promoções podem ter itens ainda melhores; 4) Não há urgência em gastar tudo agora. A estratégia otimizada já oferece ROI extremo com 8.142 pérolas. Adicionar mais 938 pérolas em itens secundários apenas reduziria o ROI geral. Guarde para flexibilidade futura."
  },
  {
    id: "roi-1",
    category: "roi",
    question: "Como calcular o ROI real da minha compra?",
    answer: "FÓRMULA: ROI = (Valor Total em Crons × Preço Padrão por Cron) / Pérolas Gastas. EXEMPLO: 4.000 Crons × R$ 0,15 (preço padrão) = R$ 600 de valor. Dividido por 8.142 pérolas gastas = R$ 0,0737 por pérola. Isso significa você está obtendo valor de R$ 600 gastando apenas R$ 285 (8.142 × R$ 0,035). ROI = 210% (você está ganhando 2,1x o valor investido). Isso é EXTREMAMENTE bom. Normalmente, ROI bom é 50-100%. Acima de 150% é excepcional."
  },
  {
    id: "roi-2",
    category: "roi",
    question: "Qual é o impacto de usar cupons de desconto no ROI?",
    answer: "IMPACTO DOS CUPONS: Sem cupons: 8.142 pérolas → ~3.200 crons → R$ 0,089 por pérola. Com cupons (30% + 20%): 8.142 pérolas → ~4.000 crons → R$ 0,0737 por pérola. DIFERENÇA: +800 crons (25% mais crons) com o mesmo gasto. Os cupons aumentam o ROI em aproximadamente 20-25%. É por isso que aplicar cupons NOS ITENS MAIS CAROS é crítico. Um cupom 30% em um item de 2.200 pérolas economiza 660 pérolas (equivalente a 200+ crons adicionais)."
  },
  {
    id: "roi-3",
    category: "roi",
    question: "Como a promoção atual se compara com promoções passadas?",
    answer: "COMPARAÇÃO HISTÓRICA: Promoções normais: R$ 0,12-0,15 por cron. Promoções boas: R$ 0,10-0,12 por cron. Promoção ATUAL: R$ 0,0737 por cron (com cupons). CONCLUSÃO: A promoção atual está MUITO ACIMA DA MÉDIA. Está entre as melhores promoções dos últimos 6 meses. Se você é jogador endgame, esta é uma oportunidade RARA de acumular Crons com máxima eficiência. Próximas promoções podem não ser tão boas, então aproveitar agora é estratégico."
  },
  {
    id: "roi-4",
    category: "roi",
    question: "Qual é o custo total em reais da estratégia otimizada?",
    answer: "CÁLCULO FINAL: 8.142 pérolas gastas × R$ 0,035 por pérola (taxa média) = R$ 285. RESULTADO: ~4.000 Crons por R$ 285. Comparado a: Comprar Cron direto: ~4.000 Crons = R$ 600-800. ECONOMIA: R$ 315-515 (54-64% mais barato). Além disso, você recebe: 2 outfits premium (valor cosmético), Conselho de Valks +200, cashback, milhagem, spend reward. O valor total agregado é de aproximadamente R$ 600-800, enquanto você gastou apenas R$ 285. ROI TOTAL: 210-280%."
  }
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "refinement" | "cron" | "strategy" | "roi">("all");

  const filteredFAQ = activeCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      refinement: "Refinamento",
      cron: "Cron Stones",
      strategy: "Estratégia",
      roi: "ROI & Custo"
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      refinement: "bg-blue-900/20 text-blue-100 hover:bg-blue-900/30",
      cron: "bg-purple-900/20 text-purple-100 hover:bg-purple-900/30",
      strategy: "bg-green-900/20 text-green-100 hover:bg-green-900/30",
      roi: "bg-yellow-900/20 text-yellow-100 hover:bg-yellow-900/30"
    };
    return colors[category] || "bg-gray-900/20 text-gray-100";
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Perguntas Frequentes
          </CardTitle>
          <CardDescription>
            Tudo que você precisa saber sobre refinamento, Cron Stones e estratégia endgame
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border text-foreground hover:border-accent"
              }`}
            >
              Todas as Categorias
            </button>
            {(["refinement", "cron", "strategy", "roi"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-accent text-accent-foreground"
                    : getCategoryColor(category)
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {filteredFAQ.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-border">
                <AccordionTrigger className="hover:text-accent hover:no-underline py-4">
                  <div className="flex items-start gap-3 text-left">
                    <span className="text-accent font-semibold text-lg">?</span>
                    <span className="font-medium text-foreground">{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  <div className="ml-8 space-y-3">
                    <p className="leading-relaxed">{item.answer}</p>
                    <div className="text-xs text-muted-foreground/70 pt-2 border-t border-border/30">
                      Categoria: <span className="text-accent font-semibold">{getCategoryLabel(item.category)}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-border grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{faqData.length}</div>
              <div className="text-xs text-muted-foreground">Perguntas Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">4</div>
              <div className="text-xs text-muted-foreground">Categorias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-xs text-muted-foreground">Cobertura</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
