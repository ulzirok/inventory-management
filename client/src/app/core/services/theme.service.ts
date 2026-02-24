import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = 'light-theme';
  constructor(private overlayContainer: OverlayContainer) { }

  init() {
    const saved = localStorage.getItem('theme') || 'light-theme';
    this.setTheme(saved);
  }

  setTheme(theme: string) {
    const containerClassList = this.overlayContainer.getContainerElement().classList;
    containerClassList.remove(this.currentTheme);
    containerClassList.add(theme);
    
    document.body.classList.remove(this.currentTheme);
    document.body.classList.add(theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  getCurrent() {
    return this.currentTheme;
  }


}