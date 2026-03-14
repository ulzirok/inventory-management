import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user.interface';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [MatCardModule, MatIconModule, TranslateModule, MatButtonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfile implements OnInit {
  user = signal<User | null>(null)
  
  private route = inject(ActivatedRoute)
  private userService = inject(UserService)
  private destroyRef = inject(DestroyRef)
  private location = inject(Location);
  
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id')
    if (userId) {
      this.userService.getById(Number(userId)).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        data => this.user.set(data)
      );
    }
  }
  
  goBack() {
    this.location.back();
  }
}
