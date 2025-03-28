import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  // Inietta il servizio di autenticazione usando inject()
  const authService = inject(AuthService);

  // Ottieni il token corrente
  const token = authService.token;

  // Se c'è un token e la richiesta è verso il nostro API
  if (token && request.url.includes('localhost:8080')) {
    // Clona la richiesta e aggiungi l'header di autorizzazione
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request);
};
