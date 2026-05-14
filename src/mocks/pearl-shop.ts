/**
 * Mock data for the Pearl Shop UI.
 * Replaces the original tRPC/scraping backend with a static snapshot.
 */

import type { PearlShopPromotion, PearlShopItem } from '@/core/types';

const now = new Date();
const start = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const end = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);

export const MOCK_PEARL_SHOP_ITEMS: PearlShopItem[] = [
  {
    id: 'cron-pack-l',
    name: 'Caixa Premium de Pedras Cron (x100)',
    price: 2200,
    currency: 'Pérolas',
    discount: 35,
    category: 'bundle',
    description: 'Pacote essencial para refinamento endgame.',
    roi: 'Absurdo',
    priority: 1,
  },
  {
    id: 'valks-advice',
    name: 'Conselho de Valks (+250)',
    price: 1500,
    currency: 'Pérolas',
    discount: 30,
    category: 'consumable',
    description: 'Maior chance de sucesso em refinamentos arriscados.',
    roi: 'Extremo',
    priority: 2,
  },
  {
    id: 'outfit-classic',
    name: 'Outfit Clássico — Set Completo',
    price: 3300,
    currency: 'Pérolas',
    discount: 25,
    category: 'outfit',
    description: 'Conjunto completo com bônus de XP de combate e habilidade.',
    roi: 'Alto',
    priority: 3,
  },
  {
    id: 'pet-bundle',
    name: 'Bundle de Pets Tier 4',
    price: 4200,
    currency: 'Pérolas',
    discount: 20,
    category: 'bundle',
    description: 'Quatro pets prontos para fundir e otimizar loot.',
    roi: 'Alto',
    priority: 4,
  },
  {
    id: 'value-pack',
    name: 'Value Pack 30 dias',
    price: 1500,
    currency: 'Pérolas',
    discount: 0,
    category: 'kit',
    description: 'Aumenta XP, peso e taxa de venda no Mercado Central.',
    roi: 'Extremo',
    priority: 5,
  },
  {
    id: 'kamasylve-blessing',
    name: 'Bênção de Kamasylve 30 dias',
    price: 1200,
    currency: 'Pérolas',
    discount: 10,
    category: 'kit',
    description: '+50% XP de combate e habilidade.',
    roi: 'Alto',
    priority: 6,
  },
  {
    id: 'merv-palette',
    name: 'Paleta de Merv (artisan)',
    price: 950,
    currency: 'Pérolas',
    discount: 0,
    category: 'consumable',
    description: 'Reduz custo de durabilidade em refinamentos.',
    roi: 'Médio',
    priority: 7,
  },
  {
    id: 'inventory-expansion',
    name: 'Expansão de Inventário (+16)',
    price: 1000,
    currency: 'Pérolas',
    discount: 0,
    category: 'consumable',
    description: 'Mais espaço para grind prolongado.',
    roi: 'Médio',
    priority: 8,
  },
  {
    id: 'weight-limit',
    name: 'Aumento de Peso (+100LT)',
    price: 800,
    currency: 'Pérolas',
    discount: 0,
    category: 'consumable',
    description: 'Carregue mais loot por sessão de farm.',
    roi: 'Baixo',
    priority: 9,
  },
  {
    id: 'horse-pack',
    name: 'Pacote de Treinamento Equestre',
    price: 1100,
    currency: 'Pérolas',
    discount: 0,
    category: 'bundle',
    description: 'Acelera o leveling de cavalos T8/T9.',
    roi: 'Baixo',
    priority: 10,
  },
];

export const MOCK_PROMOTION: PearlShopPromotion = {
  id: 'promo-2026-q2',
  title: 'Promoção Q2 2026 — Loja de Pérolas',
  description:
    'Refinamento, outfits e value packs com descontos selecionados para players GS 700+.',
  startDate: start,
  endDate: end,
  items: MOCK_PEARL_SHOP_ITEMS,
  isActive: true,
};
