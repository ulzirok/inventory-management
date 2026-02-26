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
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  
  public isDark = this.themeService.isDark;
  public currentLang = this.languageService.currentLang;

  toggleTheme() {
    this.themeService.toggle();
  }

  changeLang(lang: string) {
    this.languageService.setLang(lang);
  }
}
