import { Router, type CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { inject } from '@angular/core';
import { Permission } from '../enums/permission.enum';

export const permissionGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const permission = route.data['permission'] as string;

  if (!permission) return true;

  if (permissionService.has(permission as Permission)) {
    return true;
  }

  sessionStorage.clear();
  router.navigate(['/login'], {
    queryParams: { message: 'not-authenticated' },
  });
  return false;
};
