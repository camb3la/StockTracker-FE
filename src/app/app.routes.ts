import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StockComponent } from './features/stock/stock.component';
import { WatchlistComponent } from './features/watchlist/watchlist.component';
import { AuthGuard } from './core/auth/auth.guard';
import { NonAuthGuard } from './core/auth/non-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard]  },
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
  { path: 'watchlist/:id', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
