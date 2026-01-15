import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../enums/permission.enum';

@Directive({
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  private readonly tpl = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);

  @Input('hasPermission')
  set permission(value: Permission | Permission[] | undefined) {
    this.vcr.clear();

    if (!value) {
      this.vcr.createEmbeddedView(this.tpl);
      return;
    }

    const permissions = Array.isArray(value) ? value : [value];

    if (permissions.some((p) => this.permissionService.has(p))) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
