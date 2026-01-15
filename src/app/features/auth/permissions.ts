import { UserRole } from '@app/shared/enums/user-role.enum';
import { Permission } from './enums/permission.enum';

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.Member]: [],

  [UserRole.Manager]: [],

  [UserRole.Admin]: [Permission.VIEW_ADMIN_PAGE],
};
