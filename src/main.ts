import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ottieni il token dal localStorage
    const token = localStorage.getItem('token');

    // Se c'è un token e la richiesta è verso il nostro API
    if (token && request.url.includes('localhost:8080')) {
      // Clona la richiesta e aggiungi l'header di autorizzazione
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
