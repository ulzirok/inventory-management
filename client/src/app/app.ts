import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private languageService = inject(LanguageService)
  private themeService = inject(ThemeService)
  
  ngOnInit() {
    this.languageService.init();
    this.themeService.init();
  }
}
