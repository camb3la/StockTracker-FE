import { Watchlist } from './watchlist.model';

export interface User {
  id: string;
  username: string;
  email: string;
  watchlists: Watchlist[];
}
