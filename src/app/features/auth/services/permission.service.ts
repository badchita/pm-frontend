import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission, PERMISSIONS } from '../permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly authService = inject(AuthService);

  has(permission: Permission): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;

    const rolePermissions = PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  }
}
