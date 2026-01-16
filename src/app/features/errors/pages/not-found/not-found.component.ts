import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-not-found',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isLoggedIn = false;

  fromHistory: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.fromHistory = params['from'] ? params['from'] : null;
    });

    this.isLoggedIn = this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login']);
  }

  goBack() {
    if (this.fromHistory) {
      globalThis.history.go(-2);
    } else {
      globalThis.history.back();
    }
  }
}
