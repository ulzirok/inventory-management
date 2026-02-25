import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-o-auth-success-page',
  imports: [TranslateModule],
  templateUrl: './o-auth-success-page.html',
  styleUrl: './o-auth-success-page.scss',
})
export class OAuthSuccessPage implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  
  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (params) => {
        const token = params['token'];
        if (token) {
          localStorage.setItem('token', token);
          this.notificationService.success('Logged in successfully.')
          this.router.navigate(['/dashboard']);
        }
        else {
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
      }
    })
  }

}
