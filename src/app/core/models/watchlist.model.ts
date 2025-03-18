import { Stock } from './stock.model';

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
}
