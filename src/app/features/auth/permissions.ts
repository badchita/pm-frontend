import { UserRole } from '@app/shared/enums/user-role.enum';

export type Permission = 'VIEW_ADMIN_PAGE';

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.Member]: [],

  [UserRole.Manager]: [],

  [UserRole.Admin]: ['VIEW_ADMIN_PAGE'],
};
