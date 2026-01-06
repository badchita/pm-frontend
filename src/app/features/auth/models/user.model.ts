import { UserRole } from '@app/shared/enums/user-role.enum';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved: string;
  createdAt: Date | string;
}
