import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { routes } from './shared/app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    { provide: NZ_I18N, useValue: en_US },
    provideNzIcons(Object.values(AllIcons)),

    provideCharts(withDefaultRegisterables()),
  ],
};
