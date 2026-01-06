import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '@app/shared/enums/user-role.enum';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  transform(role: UserRole): unknown {
    switch (role) {
      case UserRole.Member:
        return 'Member';
      case UserRole.Manager:
        return 'Manager';
      case UserRole.Admin:
        return 'Admin';
      default:
        return 'Unknown';
    }
  }
}
