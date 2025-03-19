import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  // Dati di esempio per simulare le API
  private mockStocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.34,
      change: 2.45,
      changePercent: 1.42,
      volume: 65432100,
      marketCap: 2850000000000,
      exchange: 'NASDAQ'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 340.67,
      change: -1.23,
      changePercent: -0.36,
      volume: 23456700,
      marketCap: 2540000000000,
      exchange: 'NASDAQ'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.45,
      change: 0.87,
      changePercent: 0.63,
      volume: 18765400,
      marketCap: 1750000000000,
      exchange: 'NASDAQ'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 178.25,
      change: 1.56,
      changePercent: 0.88,
      volume: 32145600,
      marketCap: 1850000000000,
      exchange: 'NASDAQ'
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: 485.12,
      change: 5.23,
      changePercent: 1.09,
      volume: 15678900,
      marketCap: 1240000000000,
      exchange: 'NASDAQ'
    }
  ];

  constructor(private http: HttpClient)  { }

  searchStocks(query: string): Observable<Stock[]> {
    // Simuliamo una ricerca
    if (!query) {
      return of(this.mockStocks);
    }

    return of(this.mockStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ));
  }

  getStockBySymbol(symbol: string): Observable<Stock | undefined> {
    // Simuliamo il recupero di un'azione specifica
    return of(this.mockStocks.find(stock => stock.symbol === symbol));
  }

  getStockHistory(symbol: string, interval: string, range: string): Observable<any> {
    // Simuliamo dati storici
    const now = new Date();
    const data = [];

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      const basePrice = symbol === 'AAPL' ? 170 :
                        symbol === 'MSFT' ? 340 :
                        symbol === 'GOOGL' ? 135 :
                        symbol === 'AMZN' ? 175 :
                        symbol === 'META' ? 480 : 100;

      const randomFactor = (Math.random() - 0.5) * 10;
      const price = basePrice + randomFactor;

      data.push({
        date: date.toISOString().split('T')[0],
        open: price - 1,
        high: price + 2,
        low: price - 2,
        close: price,
        volume: Math.floor(Math.random() * 10000000) + 10000000
      });
    }

    return of({
      symbol: symbol,
      interval: interval,
      range: range,
      data: data
    });
  }
}
