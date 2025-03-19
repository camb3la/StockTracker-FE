import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  template: `
      <app-header></app-header>
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StockTracker-FE';
}
