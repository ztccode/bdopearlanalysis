import { describe, it, expect } from "vitest";
import { PearlShopNews, PearlShopNewsItem } from "./PearlShopNews";
import { render, screen } from "@testing-library/react";

describe("PearlShopNews Component", () => {
  const mockNews: PearlShopNewsItem[] = [
    {
      id: "1",
      title: "Test Promotion",
      description: "This is a test promotion",
      category: "promotion",
      date: "14/05/2026",
      highlight: true,
      tags: ["Desconto", "Bundle"],
    },
    {
      id: "2",
      title: "Test Update",
      description: "This is a test update",
      category: "update",
      date: "12/05/2026",
      highlight: false,
      tags: ["Atualização"],
    },
  ];

  it("should render news items", () => {
    render(<PearlShopNews items={mockNews} />);
    
    expect(screen.getByText("Test Promotion")).toBeDefined();
    expect(screen.getByText("Test Update")).toBeDefined();
  });

  it("should display correct category badges", () => {
    render(<PearlShopNews items={mockNews} />);
    
    expect(screen.getByText("Promoção")).toBeDefined();
    expect(screen.getByText("Atualização")).toBeDefined();
  });

  it("should display tags for each news item", () => {
    render(<PearlShopNews items={mockNews} />);
    
    expect(screen.getByText("Desconto")).toBeDefined();
    expect(screen.getByText("Bundle")).toBeDefined();
    expect(screen.getByText("Atualização")).toBeDefined();
  });

  it("should render empty state when no items provided", () => {
    render(<PearlShopNews items={[]} />);
    
    expect(screen.getByText("Nenhuma novidade no momento. Volte em breve!")).toBeDefined();
  });

  it("should highlight important news items", () => {
    const { container } = render(<PearlShopNews items={mockNews} />);
    
    const highlightedCards = container.querySelectorAll('[class*="accent/5"]');
    expect(highlightedCards.length).toBeGreaterThan(0);
  });

  it("should display dates correctly", () => {
    render(<PearlShopNews items={mockNews} />);
    
    expect(screen.getByText("14/05/2026")).toBeDefined();
    expect(screen.getByText("12/05/2026")).toBeDefined();
  });

  it("should handle all news categories", () => {
    const allCategories: PearlShopNewsItem[] = [
      { id: "1", title: "Promo", description: "Test", category: "promotion", date: "14/05/2026" },
      { id: "2", title: "Update", description: "Test", category: "update", date: "14/05/2026" },
      { id: "3", title: "Alert", description: "Test", category: "alert", date: "14/05/2026" },
      { id: "4", title: "Reward", description: "Test", category: "reward", date: "14/05/2026" },
    ];

    render(<PearlShopNews items={allCategories} />);
    
    expect(screen.getByText("Promoção")).toBeDefined();
    expect(screen.getByText("Atualização")).toBeDefined();
    expect(screen.getByText("Alerta")).toBeDefined();
    expect(screen.getByText("Recompensa")).toBeDefined();
  });
});
