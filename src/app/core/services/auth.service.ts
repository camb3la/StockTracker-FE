import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL base del tuo backend

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log('Tentativo di registrazione con:', { username, email, password });

    const signupRequest = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(`${this.apiUrl}/api/auth/signup`, signupRequest, { headers: this.getHeaders(), responseType: 'text' })
      .pipe(
        tap((response: any) => {
          console.log('Risposta dal server:', response);
          // Il backend non sembra restituire un token nella registrazione,
          // quindi qui non dovremmo salvare nulla nel localStorage
        }),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Errore client:', error.error.message);
          } else {
            console.error(
              `Codice stato: ${error.status}, ` +
              `Messaggio: ${error.error?.body || error.message}`
            );
          }
          return throwError(() => error);
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    const loginRequest = {
      username: username,
      password: password
    };

    return this.http.post(`${this.apiUrl}/api/auth/login`, loginRequest, { headers: this.getHeaders() })
      .pipe(
        tap((response: any) => {
          // Salva il token se presente nella risposta
          if (response && response.token) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError(error => {
          console.error('Errore durante il login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
