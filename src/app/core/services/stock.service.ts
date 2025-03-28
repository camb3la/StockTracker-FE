import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/stock';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  searchStocks(query: string): Observable<Stock[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Stock[]>(`${this.apiUrl}/search`, { params });
  }

  getStockDetails(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/details/${symbol}`);
  }

   getStockBySymbol(symbol: string): Observable<Stock> {
      return this.getStockDetails(symbol);
    }

    getStockHistory(symbol: string, interval: string, range: string): Observable<any> {
      const params = new HttpParams()
        .set('symbol', symbol)
        .set('interval', interval)
        .set('range', range);
      return this.http.get<any>(`${this.apiUrl}/history`, { params }) ;
    }
}
