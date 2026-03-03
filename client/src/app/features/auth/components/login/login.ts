import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environment/environment.prod';
import { NotificationService } from '../../../../core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit{
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private notificationService = inject(NotificationService);
  private router = inject(Router)
  private destroyRef = inject(DestroyRef);
  
  public form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['qwe@mail.com', [Validators.required, Validators.email]],
      password: ['123', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.form.invalid) return;
    this.form.disable();
    this.authService.login(this.form.value).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.notificationService.success('Logged in successfully.')
        this.router.navigate(['/dashboard'])
        this.form.enable()
      },
      error: (err) => {
        this.form.enable();
      }
    })
  }
  
  authWithGoogle() {
    window.location.href = `${environment.apiUrl}/api/auth/google`;
  }
  authWithFacebook() {
    window.location.href = `${environment.apiUrl}/api/auth/facebook`;
  }
}
