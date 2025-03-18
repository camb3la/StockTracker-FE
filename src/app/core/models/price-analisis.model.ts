export interface PriceAnalysis {
  id: string;
  stockSymbol: string;
  longRange: { min: number; max: number };
  shortRange: { min: number; max: number };
  notes: string;
  createdAt: Date;
}
