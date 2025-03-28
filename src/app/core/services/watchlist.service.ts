import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watchlist } from '../models/watchlist.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8080/watchlists';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getWatchlists(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(this.apiUrl);
  }

  getWatchlistById(id: number): Observable<Watchlist> {
    return this.http.get<Watchlist>(`${this.apiUrl}/${id}`);
  }

  createWatchlist(name: string, description: string = ''): Observable<Watchlist> {
    return this.http.post<Watchlist>(this.apiUrl, { name, description });
  }

  deleteWatchlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addStockToWatchlist(watchlistId: number, symbol: string): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.apiUrl}/${watchlistId}/stocks`, { symbol });
  }

  removeStockFromWatchlist(watchlistId: number, symbol: string): Observable<Watchlist> {
    return this.http.delete<Watchlist>(`${this.apiUrl}/${watchlistId}/stocks/${symbol}`);
  }
}
