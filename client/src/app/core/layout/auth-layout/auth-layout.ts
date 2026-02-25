import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, MatIconModule, MatButtonModule, MatSelectModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  currentLang = 'en';
  public isDark = false;
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);

  constructor() {
    this.currentLang = this.languageService.getCurrent() || 'en';
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.setTheme(this.isDark ? 'dark-theme' : 'light-theme');
  }

  changeLang(lang: string) {
    this.languageService.switch(lang);
    this.currentLang = lang;
  }
}
