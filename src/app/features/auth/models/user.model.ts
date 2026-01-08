import { Company } from '@app/features/admin/admin-companies/models/company.model';
import { UserRole } from '@app/shared/enums/user-role.enum';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved: string;
  companyId?: number;
  company?: Company;
  createdAt: Date | string;
}
