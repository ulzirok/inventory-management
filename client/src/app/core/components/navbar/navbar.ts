import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../../features/auth/models/role.enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

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
    MatAutocompleteModule,
    MatDivider,
    MatMenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar implements OnInit {
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private breakpointObserver = inject(BreakpointObserver);

  public isDark = this.themeService.isDark;
  public currentLang = this.languageService.currentLang;
  public searchControl = new FormControl('');
  public isAdmin = computed(() =>
    this.authService.hasRole(Role.ADMIN)
  );
  public isAuthenticated = computed(() =>
    this.authService.isAuthenticated()
  );

  isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(
      map(result => result.matches)
    )
  );

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      if (value?.trim()) {
        this.router.navigate(['/search'], { queryParams: { q: value } });
      }
    });
  }

  changeLang(lang: string) {
    this.languageService.setLang(lang);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}