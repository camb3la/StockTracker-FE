import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BrowserStorageService } from './browser-storage.service';
import { JwtResponse, JwtPayload } from '../models/jwt-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api'; // URL base del tuo backend
  private tokenKey = 'token';

  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: BrowserStorageService
  ) {
    this.checkAuthState();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private checkAuthState(): void {
    const isValid = this.isTokenValid();
    this.authStateSubject.next(isValid);
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log('Tentativo di registrazione con:', { username, email, password });

    const signupRequest = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(`${this.apiUrl}/auth/signup`, signupRequest, { headers: this.getHeaders(), responseType: 'text' })
      .pipe(
        tap((response: any) => {
          console.log('Risposta dal server:', response);
          // Non salviamo il token in localStorage perché il backend non lo invia con la registrazione
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

  login(username: string, password: string): Observable<JwtResponse> {
    const loginRequest = {
      username: username,
      password: password
    };

    return this.http.post<JwtResponse>(`${this.apiUrl}/auth/login`, loginRequest, { headers: this.getHeaders() })
      .pipe(
        tap((response: JwtResponse) => {
          // Salva il token se presente nella risposta
          if (response && response.token) {
            this.storage.setItem(this.tokenKey, response.token);
            this.authStateSubject.next(true);
          }
        }),
        catchError(error => {
          console.error('Errore durante il login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.authStateSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  // Metodo per decodificare il token JWT
  private decodeToken(token: string): JwtPayload | null {
    try {
      // Dividi il token in 3 parti (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decodifica la parte del payload (indice 1)
      const payload = parts[1];
      // Converti da base64 a stringa e poi in oggetto JSON
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decodedPayload;
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      return null;
    }
  }

  // Metodo per verificare se il token è valido (non scaduto)
  isTokenValid(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeToken(token);
      if (!payload) {
        return false;
      }

      // Verifica la scadenza del token
      const currentTime = Math.floor(Date.now() / 1000); // Converti in secondi
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Errore nella verifica del token:', error);
      return false;
    }
  }

  // Ottieni informazioni sull'utente dal token
  getUserInfo(): { id: number, username: string, email: string } | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      return null;
    } catch (error) {
      console.error('Errore nell\'ottenere informazioni utente:', error);
      return null;
    }
  }
}
