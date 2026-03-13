import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../core/services/notification.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-o-auth-success-page',
  imports: [TranslateModule],
  templateUrl: './o-auth-success-page.html',
  styleUrl: './o-auth-success-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAuthSuccessPage implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    this.route.queryParams.pipe(
      map(params => params['token']),
      filter(Boolean),
      tap(token => this.tokenService.setToken(token)),
      switchMap(() => this.authService.getProfile()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Logged in successfully.');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }
  
}
