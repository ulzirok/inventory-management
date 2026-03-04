import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService)
  public currentLang = signal(localStorage.getItem('lang') || 'en');
  
  init() {
    this.translate.use(this.currentLang());
  }

  setLang(lang: string) {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
