import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle, Gift } from "lucide-react";

export interface PearlShopNewsItem {
  id: string;
  title: string;
  description: string;
  category: "promotion" | "update" | "alert" | "reward";
  date: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  tags?: string[];
}

interface PearlShopNewsProps {
  items?: PearlShopNewsItem[];
}

const defaultNews: PearlShopNewsItem[] = [
  {
    id: "1",
    title: "Promoção Especial - Loja de Pérolas",
    description: "Pacotes de pérolas com até 40% de desconto! Aproveite ofertas exclusivas em bundles premium.",
    category: "promotion",
    date: "14/05/2026",
    icon: <Gift className="w-5 h-5 text-yellow-500" />,
    highlight: true,
    tags: ["Desconto", "Bundle", "Premium"],
  },
  {
    id: "2",
    title: "Novo Sistema de Recompensas",
    description: "Ganhe pontos de fidelidade a cada compra e resgate em futuras promoções.",
    category: "reward",
    date: "12/05/2026",
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
    tags: ["Fidelidade", "Pontos"],
  },
  {
    id: "3",
    title: "Atualização de Preços",
    description: "Novos preços base para pacotes de pérolas com melhor custo-benefício.",
    category: "update",
    date: "10/05/2026",
    icon: <Sparkles className="w-5 h-5 text-blue-500" />,
    tags: ["Preços", "Atualização"],
  },
  {
    id: "4",
    title: "Atenção: Limite de Compras",
    description: "Limite diário de compras aumentado para 100.000 pérolas. Consulte os termos.",
    category: "alert",
    date: "08/05/2026",
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
    tags: ["Limite", "Importante"],
  },
];

const categoryConfig = {
  promotion: {
    label: "Promoção",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  update: {
    label: "Atualização",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  alert: {
    label: "Alerta",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  reward: {
    label: "Recompensa",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    borderColor: "border-green-200 dark:border-green-800",
  },
};

export function PearlShopNews({ items = defaultNews }: PearlShopNewsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Novidades da Loja</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fique atualizado com as últimas promoções e atualizações
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => {
          const config = categoryConfig[item.category];
          return (
            <Card
              key={item.id}
              className={`border-l-4 transition-all hover:shadow-md ${
                item.highlight
                  ? `border-l-accent bg-accent/5 ${config.borderColor}`
                  : config.borderColor
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    {item.icon || <Sparkles className="w-5 h-5 text-accent" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Badge className={config.color}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-muted-foreground mt-3">
                      {item.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma novidade no momento. Volte em breve!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
