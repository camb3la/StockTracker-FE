import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
    imports: [NgForOf, RouterLink]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // Informazioni per il footer
  companyInfo = {
    name: 'StockTracker',
    description: 'Piattaforma per il monitoraggio e l\'analisi delle azioni finanziarie. Visualizza, salva nei preferiti e analizza le fasce di prezzo per posizioni Long o Short.'
  };

  // Link utili per il footer
  usefulLinks = [
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Watchlist', url: '/watchlist' },
    { name: 'Analisi Prezzi', url: '/price-analysis' }
  ];

  // Link per il supporto
  supportLinks = [
    { name: 'FAQ', url: '/faq' },
    { name: 'Contatti', url: '/contatti' },
    { name: 'Termini di Servizio', url: '/termini' },
    { name: 'Privacy Policy', url: '/privacy' }
  ];

  // Social media
  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'fab fa-facebook-f' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fab fa-linkedin-in' },
    { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' }
  ];
}
