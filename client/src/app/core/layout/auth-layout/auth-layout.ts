import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  public isDark = false;
  private themeService = inject(ThemeService);
  
  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.setTheme(this.isDark ? 'dark-theme' : 'light-theme');
  }
}
