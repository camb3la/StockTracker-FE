import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watchlist, CreateWatchlistRequest } from '../models/watchlist.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8080/api/watchlists';

  constructor(private http: HttpClient) { }

  // Ottieni tutte le watchlist dell'utente
  getWatchlists(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(this.apiUrl);
  }

  // Crea una nuova watchlist
  createWatchlist(watchlist: CreateWatchlistRequest): Observable<Watchlist> {
    return this.http.post<Watchlist>(this.apiUrl, watchlist);
  }

  // Ottieni una watchlist specifica per ID
  getWatchlistById(id: number): Observable<Watchlist> {
    return this.http.get<Watchlist>(`${this.apiUrl}/${id}`);
  }

  // Elimina una watchlist
  deleteWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Aggiungi un'azione alla watchlist
  addStockToWatchlist(watchlistId: number, stockSymbol: string): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.apiUrl}/${watchlistId}/stocks/${stockSymbol}`, {});
  }

  // Rimuovi un'azione dalla watchlist
  removeStockFromWatchlist(watchlistId: number, stockSymbol: string): Observable<Watchlist> {
    return this.http.delete<Watchlist>(`${this.apiUrl}/${watchlistId}/stocks/${stockSymbol}`);
  }
}
