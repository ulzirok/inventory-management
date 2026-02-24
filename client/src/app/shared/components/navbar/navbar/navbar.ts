import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  currentLang = 'en';
  public isDark = false;

  private languageService = inject(LanguageService)
  private themeService = inject(ThemeService)
  
  constructor() {
    this.currentLang = this.languageService.getCurrent() || 'en';
  }
  
  changeLang(lang: string) {
    this.languageService.switch(lang);
    this.currentLang = lang;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.setTheme(this.isDark ? 'dark-theme' : 'light-theme');
  }
}
