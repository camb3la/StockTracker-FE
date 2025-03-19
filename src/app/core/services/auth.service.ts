import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // In una vera applicazione, questa sarebbe una chiamata API
    // Per ora, simuliamo un login di successo
    const mockUser: User = {
      id: '1',
      username: 'user1',
      email: email,
      watchlists: []
    };

    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }

    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  register(username: string, email: string, password: string): Observable<User> {
    // In una vera applicazione, questa sarebbe una chiamata API
    // Per ora, simuliamo una registrazione di successo
    const mockUser: User = {
      id: '1',
      username: username,
      email: email,
      watchlists: []
    };

    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
    }

    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }

    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
