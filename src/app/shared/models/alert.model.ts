import { TemplateRef } from "@angular/core";

export interface AlertType {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string | TemplateRef<void>;
  description: string | TemplateRef<void>;
}
