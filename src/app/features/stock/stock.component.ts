import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { StockService } from '../../core/services/stock.service';
import { Stock } from '../../core/models/stock.model';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  searchControl = new FormControl('');
  selectedStock: Stock | null = null;
  loading = false;
  error: string | null = null;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
  }

  // Seleziona un'azione per visualizzarne i dettagli
  selectStock(): void {
    const symbol = this.searchControl.value;

    if (!symbol || symbol.trim() === '') {
      this.error = 'Inserisci un simbolo azionario valido';
      return;
    }

    this.loading = true;
    this.error = null;

    this.stockService.getStockDetails(symbol.trim()).subscribe({
      next: (details) => {
        this.selectedStock = details;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore durante il caricamento dei dettagli dell\'azione.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
