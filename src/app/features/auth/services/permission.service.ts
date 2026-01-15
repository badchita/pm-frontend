import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { PERMISSIONS } from '../permissions';
import { Permission } from '../enums/permission.enum';

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
