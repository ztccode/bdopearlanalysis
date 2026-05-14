/**
 * FAQAccordion Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    id: 'cron-stones',
    question: 'O que são Cron Stones?',
    answer:
      'Cron Stones são itens usados para proteger equipamentos durante refinamento. Cada Cron Stone garante que o equipamento não regride de nível em caso de falha.',
  },
  {
    id: 'roi-meaning',
    question: 'O que significa ROI?',
    answer:
      'ROI (Return on Investment) mede quanto valor você obtém por cada pérola gasta. Quanto maior o ROI, melhor o custo-benefício da compra.',
  },
  {
    id: 'best-purchase',
    question: 'Qual é a melhor compra para GS 775+?',
    answer:
      'Para endgame, priorize Cron Stones e Conselho de Valks. O refinamento de equipamentos Soberanos é o maior gargalo, e esses itens reduzem significativamente o custo.',
  },
  {
    id: 'discount-calculation',
    question: 'Como os descontos são calculados?',
    answer:
      'Os descontos são aplicados ao preço base do item. Um desconto de 60% significa que você paga 40% do preço original.',
  },
  {
    id: 'personalization',
    question: 'Como funciona a personalização?',
    answer:
      'Importe seu personagem do Garmoth usando seu link de screenshot. O sistema analisará seus stats e recomendará itens baseado em seu nível de progressão.',
  },
  {
    id: 'historical-data',
    question: 'Vocês mantêm histórico de promoções?',
    answer:
      'Sim! Mantemos snapshots semanais de todas as promoções. Você pode comparar preços e ROI ao longo do tempo para identificar padrões.',
  },
];

export function FAQAccordion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
