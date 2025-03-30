import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Watchlist } from '../../core/models/watchlist.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: Watchlist | null = null;
  isLoading = true;
  error: string | null = null;
  newStockSymbol = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private watchlistService: WatchlistService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const watchlistId = Number(params.get('id'));
      if (!isNaN(watchlistId)) {
        this.loadWatchlist(watchlistId);
      } else {
        this.error = 'ID watchlist non valido';
        this.isLoading = false;
      }
    });
  }

  loadWatchlist(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.watchlistService.getWatchlistById(id).subscribe({
      next: (data) => {
        this.watchlist = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento della watchlist:', err);
        this.error = 'Impossibile caricare i dettagli della watchlist. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  addStock(): void {
    if (!this.newStockSymbol || !this.watchlist) {
      return;
    }

    const symbol = this.newStockSymbol.trim().toUpperCase();

    this.watchlistService.addStockToWatchlist(this.watchlist.id, symbol).subscribe({
      next: (updatedWatchlist) => {
        this.watchlist = updatedWatchlist;
        this.newStockSymbol = '';
      },
      error: (err) => {
        console.error('Errore nell\'aggiunta dell\'azione:', err);
        this.error = `Impossibile aggiungere l'azione ${symbol}. Verifica che il simbolo sia corretto.`;
      }
    });
  }

  removeStock(symbol: string): void {
    if (!this.watchlist) {
      return;
    }

    this.watchlistService.removeStockFromWatchlist(this.watchlist.id, symbol).subscribe({
      next: (updatedWatchlist) => {
        this.watchlist = updatedWatchlist;
      },
      error: (err) => {
        console.error('Errore nella rimozione dell\'azione:', err);
        this.error = `Impossibile rimuovere l'azione ${symbol}.`;
      }
    });
  }

  deleteWatchlist(): void {
    if (!this.watchlist || !confirm('Sei sicuro di voler eliminare questa watchlist?')) {
      return;
    }

    this.watchlistService.deleteWatchlist(this.watchlist.id).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Errore nell\'eliminazione della watchlist:', err);
        this.error = 'Impossibile eliminare la watchlist.';
      }
    });
  }
}
