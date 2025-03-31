import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ottieni il token dal localStorage
    const token = localStorage.getItem('token');

    // Log per debug
    console.log('JwtInterceptor - URL richiesta:', request.url);
    console.log('JwtInterceptor - Token trovato:', token ? 'Sì' : 'No');

    // Se c'è un token, aggiungilo a TUTTE le richieste
    // (rimuoviamo il controllo su localhost:8080 per diagnostica)
    if (token) {
      console.log('JwtInterceptor - Aggiungo token alla richiesta');
      // Clona la richiesta e aggiungi l'header di autorizzazione
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('JwtInterceptor - Nessun token trovato nel localStorage');
    }

    return next.handle(request);
  }
}
