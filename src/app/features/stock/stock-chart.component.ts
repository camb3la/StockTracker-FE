import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Chart: any;

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class StockChartComponent implements OnChanges, AfterViewInit {
  @Input() data: any;
  @Input() interval: string = 'daily';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  private chart: any;

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.chart) {
      this.updateChart();
    }
  }

  private initializeChart(): void {
    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    // Configurazione iniziale del grafico
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Prezzo di chiusura',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Data'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Prezzo'
            }
          }
        }
      }
    });

    // Se i dati sono già disponibili, aggiorniamo il grafico
    if (this.data) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.chart || !this.data) return;

    // Estrai date e prezzi di chiusura dai dati
    const labels = this.data.map((item: any) => item.date);
    const prices = this.data.map((item: any) => item.close);

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = prices;

    // Aggiorna il titolo in base all'intervallo selezionato
    const intervalText = this.interval === 'daily' ? 'Giornaliero' :
                        this.interval === 'weekly' ? 'Settimanale' : 'Mensile';
    this.chart.options.plugins = this.chart.options.plugins || {};
    this.chart.options.plugins.title = {
      display: true,
      text: `Andamento ${intervalText}`
    };

    this.chart.update();
  }
}
