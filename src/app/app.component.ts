import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="!isAuthRoute"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  isAuthRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthRoute = this.isAuthenticationRoute(event.url);
      }
    });
  }

  private isAuthenticationRoute(url: string): boolean {
    return url.includes('/login') || url.includes('/register');
  }
}
