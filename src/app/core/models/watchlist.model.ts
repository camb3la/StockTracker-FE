export interface Stock {
  symbol: string;
  name?: string;
  currentPrice?: number;
    dailyChangePercent?: number;
}

export interface Watchlist {
  id: number;
  name: string;
  description: string;
  stocks: Stock[] | null;
}

export interface CreateWatchlistRequest {
  name: string;
  description: string;
}
