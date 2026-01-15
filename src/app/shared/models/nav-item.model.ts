import { Permission } from '@app/features/auth/enums/permission.enum';

export interface NavItem {
  title: string;
  icon: string;
  route: string;
  child?: NavItem[];
  permission?: Permission;
}
