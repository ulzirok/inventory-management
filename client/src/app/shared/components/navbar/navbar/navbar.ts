import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Search } from '../../../../features/search/models/search.interface';
import { SearchService } from '../../../../features/search/services/search.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  currentLang = 'en';
  public isDark = false;
  searchControl = new FormControl('');
  searchResults = signal<Search[]>([])

  private languageService = inject(LanguageService)
  private themeService = inject(ThemeService)
  private searchService = inject(SearchService)
  private router = inject(Router)
  
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
  
  onSelect(item: Search) {
    this.router.navigate(['/inventory', item.id]);
  }
  
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value?.length) {
          this.searchResults.set([]);
          return []
        }
        return this.searchService.search(value);
      })
    ).subscribe(data => {
      this.searchResults.set(data); 
    });
  }
  
}
