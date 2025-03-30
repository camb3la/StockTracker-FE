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
  private apiUrl = 'http://localhost:8080/api';
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

  // Migliorata per invalidare token scaduti
  private checkAuthState(): void {
    const token = this.getToken();
    const isValid = this.isTokenValid();

    if (token && !isValid) {
      console.log('Token scaduto o non valido, effettuo logout...');
      this.clearAuthData();
    }

    this.authStateSubject.next(isValid);
  }

  // Nuovo metodo per pulire tutti i dati di autenticazione
  private clearAuthData(): void {
    this.storage.removeItem(this.tokenKey);
    this.authStateSubject.next(false);
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
            this.authStateSubject.next(true); // Emette un evento per indicare l'autenticazione avvenuta
            console.log('Login effettuato con successo, token salvato');
          }
        }),
        catchError(error => {
          console.error('Errore durante il login:', error);
          return throwError(() => error);
        })
      );
  }

  // Metodo di logout migliorato
  logout(): void {
    console.log('Esecuzione logout');
    this.clearAuthData();
    console.log('Logout eseguito con successo, reindirizzamento a login');
    this.router.navigate(['/login']);
  }

  // Metodo per forzare il logout (utile per debugging)
  forceLogout(): void {
    console.log('Esecuzione logout forzato');
    this.clearAuthData();
    console.log('Logout forzato eseguito');
    window.location.href = '/login'; // Usa un redirect completo invece di router.navigate
  }

  isAuthenticated(): boolean {
    const isValid = this.isTokenValid();
    console.log('Verifica stato autenticazione:', isValid);
    return isValid;
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
        console.error('Token formato invalido');
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
        console.error('Payload del token non valido');
        return false;
      }

      // Verifica la scadenza del token
      const currentTime = Math.floor(Date.now() / 1000); // Converti in secondi
      const isValid = payload.exp > currentTime;

      if (!isValid) {
        console.log('Token scaduto', {
          expiration: new Date(payload.exp * 1000),
          now: new Date(),
          secondsLeft: payload.exp - currentTime
        });
      }

      return isValid;
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
      const payload = this.decodeToken(token);
      if (!payload) return null;

      return {
        id: payload['id'] || 0,
        username: payload['sub'] || '',
        email: payload['email'] || ''
      };
    } catch (error) {
      console.error('Errore nell\'ottenere informazioni utente:', error);
      return null;
    }
  }
}
