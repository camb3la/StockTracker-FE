import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { StockService } from '../../core/services/stock.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { AuthService } from '../../core/services/auth.service';
import { Stock } from '../../core/models/stock.model';
import { Watchlist } from '../../core/models/watchlist.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class StockComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  stock: Stock | undefined;
  stockHistory: any;
  watchlists: Watchlist[] = [];
  selectedWatchlistId: number = 0;
  loading: boolean = false;
  error: string | null = null;
  isAuthenticated: boolean = false;

  // Configurazione per il grafico
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false
      }
    }
  };

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Prezzo di chiusura',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 1)',
        pointBackgroundColor: 'rgba(0, 123, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 123, 255, 1)',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartType = 'line';

  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private watchlistService: WatchlistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      this.watchlistService.getWatchlists().subscribe(watchlists => {
        this.watchlists = watchlists;
      });
    }

    this.route.paramMap.pipe(
      switchMap(params => {
        const symbol = params.get('symbol') || '';
        this.loading = true;
        return this.stockService.getStockBySymbol(symbol);
      })
    ).subscribe(
      (stock) => {
        this.stock = stock;
        if (stock) {
          this.loadStockHistory(stock.symbol);
        } else {
          this.error = 'Azione non trovata';
          this.loading = false;
        }
      },
      (error) => {
        this.error = 'Errore nel caricamento dei dettagli dell\'azione';
        this.loading = false;
        console.error(error);
      }
    );
  }

  loadStockHistory(symbol: string): void {
    this.stockService.getStockHistory(symbol, '1d', '1mo').subscribe(
      (data) => {
        this.stockHistory = data;
        this.prepareChartData();
        this.loading = false;
      },
      (error) => {
        this.error = 'Errore nel caricamento dei dati storici';
        this.loading = false;
        console.error(error);
      }
    );
  }

  prepareChartData(): void {
    if (!this.stockHistory || !this.stockHistory.data) return;

    const labels = this.stockHistory.data.map((item: any) => item.date);
    const prices = this.stockHistory.data.map((item: any) => item.close);

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = prices;

    // Aggiorna il grafico se esiste
    if (this.chart) {
      this.chart.update();
    }
  }

  addToWatchlist(): void {
    if (!this.isAuthenticated || !this.stock || !this.selectedWatchlistId) {
      return;
    }

    this.watchlistService.addStockToWatchlist(Number(this.selectedWatchlistId), this.stock.symbol).subscribe(
      () => {
        alert('Azione aggiunta alla watchlist con successo');
      },
      (error) => {
        console.error('Errore nell\'aggiunta dell\'azione alla watchlist', error);
      }
    );
  }
}
