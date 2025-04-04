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
