import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WatchlistService } from '../../core/services/watchlist.service';
import { Watchlist } from '../../core/models/watchlist.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Dati per il dashboard
  stockStats = {
    totalTracked: 25,
    favorites: 8,
    trending: 12
  };

  recentStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 2.5 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 337.42, change: 1.2 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.89, change: -0.8 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 180.75, change: 1.7 }
  ];

  // Nuovi dati per watchlist
  watchlists: Watchlist[] = [];
  isLoading = true;
  error: string | null = null;

  // Form per creare nuova watchlist
  showCreateForm = false;
  watchlistForm: FormGroup;
  isSubmitting = false;

  constructor(
    private watchlistService: WatchlistService,
    private fb: FormBuilder
  ) {
    this.watchlistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadWatchlists();
  }

  loadWatchlists(): void {
    this.isLoading = true;
    this.error = null;

    this.watchlistService.getWatchlists().subscribe({
      next: (data) => {
        this.watchlists = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento delle watchlist:', err);
        this.error = 'Impossibile caricare le watchlist. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.watchlistForm.reset();
    }
  }

  createWatchlist(): void {
    if (this.watchlistForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.watchlistService.createWatchlist(this.watchlistForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showCreateForm = false;
        this.watchlistForm.reset();
        this.loadWatchlists(); // Ricarica le watchlist
      },
      error: (err) => {
        console.error('Errore nella creazione della watchlist:', err);
        this.error = 'Impossibile creare la watchlist. Riprova più tardi.';
        this.isSubmitting = false;
      }
    });
  }

  deleteWatchlist(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa watchlist?')) {
      this.watchlistService.deleteWatchlist(id).subscribe({
        next: () => {
          this.loadWatchlists(); // Ricarica le watchlist
        },
        error: (err) => {
          console.error('Errore nell\'eliminazione della watchlist:', err);
          this.error = 'Impossibile eliminare la watchlist. Riprova più tardi.';
        }
      });
    }
  }
}
