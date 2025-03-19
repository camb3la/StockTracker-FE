import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Watchlist } from '../models/watchlist.model';
import { Stock } from '../models/stock.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private watchlistsSubject = new BehaviorSubject<Watchlist[]>([]);
  public watchlists$ = this.watchlistsSubject.asObservable();

  constructor(private authService: AuthService) {
    // Inizializza con i dati salvati localmente, se disponibili
    const storedWatchlists = localStorage.getItem('watchlists');
    if (storedWatchlists) {
      this.watchlistsSubject.next(JSON.parse(storedWatchlists));
    }
  }

  getWatchlists(): Observable<Watchlist[]> {
    return this.watchlists$;
  }

  getWatchlistById(id: string): Observable<Watchlist | undefined> {
    return this.watchlists$.pipe(
      map(watchlists => watchlists.find(w => w.id === id))
    );
  }

  createWatchlist(name: string): Observable<Watchlist> {
    const newWatchlist: Watchlist = {
      id: Date.now().toString(),
      name: name,
      stocks: []
    };

    const currentWatchlists = this.watchlistsSubject.value;
    const updatedWatchlists = [...currentWatchlists, newWatchlist];

    this.watchlistsSubject.next(updatedWatchlists);
    this.saveWatchlistsToStorage(updatedWatchlists);

    return of(newWatchlist);
  }

  addStockToWatchlist(watchlistId: string, stock: Stock): Observable<Watchlist> {
    const currentWatchlists = this.watchlistsSubject.value;
    const updatedWatchlists = currentWatchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        // Verifica se l'azione è già presente nella watchlist
        const stockExists = watchlist.stocks.some(s => s.symbol === stock.symbol);
        if (!stockExists) {
          return {
            ...watchlist,
            stocks: [...watchlist.stocks, stock]
          };
        }
      }
      return watchlist;
    });

    this.watchlistsSubject.next(updatedWatchlists);
    this.saveWatchlistsToStorage(updatedWatchlists);

    return this.getWatchlistById(watchlistId) as Observable<Watchlist>;
  }

  removeStockFromWatchlist(watchlistId: string, stockSymbol: string): Observable<Watchlist> {
    const currentWatchlists = this.watchlistsSubject.value;
    const updatedWatchlists = currentWatchlists.map(watchlist => {
      if (watchlist.id === watchlistId) {
        return {
          ...watchlist,
          stocks: watchlist.stocks.filter(stock => stock.symbol !== stockSymbol)
        };
      }
      return watchlist;
    });

    this.watchlistsSubject.next(updatedWatchlists);
    this.saveWatchlistsToStorage(updatedWatchlists);

    return this.getWatchlistById(watchlistId) as Observable<Watchlist>;
  }

  deleteWatchlist(watchlistId: string): Observable<boolean> {
    const currentWatchlists = this.watchlistsSubject.value;
    const updatedWatchlists = currentWatchlists.filter(watchlist => watchlist.id !== watchlistId);

    this.watchlistsSubject.next(updatedWatchlists);
    this.saveWatchlistsToStorage(updatedWatchlists);

    return of(true);
  }

  private saveWatchlistsToStorage(watchlists: Watchlist[]): void {
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
  }
}
