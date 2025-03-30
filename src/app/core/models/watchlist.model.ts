export interface Stock {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
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
