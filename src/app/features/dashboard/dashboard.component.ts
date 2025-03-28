import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { StockService } from '../../core/services/stock.service';
import { Stock } from '../../core/models/stock.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  stocks: Stock[] = [];
  searchQuery: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.loadDefaultStocks();
  }

  loadDefaultStocks(): void {
    this.loading = true;
    this.stockService.searchStocks('').subscribe(
      (data) => {
        this.stocks = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Errore nel caricamento delle azioni';
        this.loading = false;
        console.error(error);
      }
    );
  }

  searchStocks(): void {
    if (!this.searchQuery.trim()) {
      this.loadDefaultStocks();
      return;
    }

    this.loading = true;
    this.stockService.searchStocks(this.searchQuery).subscribe(
      (data) => {
        this.stocks = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Errore nella ricerca delle azioni';
        this.loading = false;
        console.error(error);
      }
    );
  }
}
