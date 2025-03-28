import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthToken } from '../models/auth-token.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<AuthToken>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(response => {
          // Converti la risposta del token in un oggetto User
          const user: User = {
            id: response.id.toString(),
            username: response.username,
            email: response.email,
            watchlists: []
          };

          // Salva token e user nel localStorage
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }

          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Errore durante il login:', error);
          return throwError(() => new Error('Credenziali non valide. Riprova.'));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, email, password })
      .pipe(
        tap(() => {
          // Dopo la registrazione, effettua automaticamente il login
          this.login(username, password).subscribe();
        }),
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return throwError(() => new Error('Errore durante la registrazione. Riprova.'));
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }

    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.token;
  }

  // Metodo per ottenere gli headers con il token di autenticazione
  getAuthHeaders(): HttpHeaders {
    const token = this.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
