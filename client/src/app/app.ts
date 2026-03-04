import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private languageService = inject(LanguageService)
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  
  ngOnInit(): void {
    this.languageService.init();
    
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe({
        error: () => {
          this.authService.logout();
        }
      });
    }
  }
}
