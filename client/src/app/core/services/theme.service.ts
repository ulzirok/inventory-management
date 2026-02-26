import { effect, inject, Injectable, signal } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private overlayContainer = inject(OverlayContainer)
  public isDark = signal(localStorage.getItem('theme') === 'dark-theme');
  
  constructor() {
    effect(() => {
      const theme = this.isDark() ? 'dark-theme' : 'light-theme';
      const prevTheme = !this.isDark() ? 'dark-theme' : 'light-theme';

      document.body.classList.remove(prevTheme);
      document.body.classList.add(theme);
      const containerClasses = this.overlayContainer.getContainerElement().classList;
      containerClasses.remove(prevTheme);
      containerClasses.add(theme);

      localStorage.setItem('theme', theme);
    });
  }

  toggle() {
    this.isDark.update(value => !value);
  }
}