export interface Stock {
  symbol: string;
  name: string;
  exchangeName: string;
  currency: string;
  currentPrice?: number;
  dailyChange?: number;
  dailyChangePercent?: number;
  volume?: number;
  marketCap?: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
