export enum UserRole {
  Member = 0,
  Manager = 1,
  Admin = 2,
}

export const UserRoleOptions: Record<UserRole, string> = {
  [UserRole.Member]: 'Member',
  [UserRole.Manager]: 'Manager',
  [UserRole.Admin]: 'Admin',
};
