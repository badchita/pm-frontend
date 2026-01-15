import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  location = inject(Location);

  isLoggedIn = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login']);
  }
}
