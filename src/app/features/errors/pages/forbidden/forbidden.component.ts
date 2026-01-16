import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-forbidden',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
})
export class ForbiddenComponent {
  private readonly router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/portal']);
  }
}
