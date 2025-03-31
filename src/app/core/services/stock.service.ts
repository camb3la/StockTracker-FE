import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Ottieni dettagli di un'azione specifica
  getStockDetails(symbol: string): Observable<Stock> {
    const url = `${this.apiUrl}/stock/details/${symbol}`;

    return this.http.get<Stock>(url).pipe(
      tap(response => console.log('Dettagli azione ricevuti:', response)),
      catchError(error => {
        console.error('Errore nel recupero dei dettagli dell\'azione:', error);
        return throwError(() => new Error('Impossibile recuperare i dettagli dell\'azione'));
      })
    );
  }
}
