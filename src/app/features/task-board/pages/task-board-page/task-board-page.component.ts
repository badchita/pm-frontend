import { Component } from '@angular/core';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-task-board-page',
  imports: [NzSpinModule],
  templateUrl: './task-board-page.component.html',
  styleUrl: './task-board-page.component.scss',
})
export class TaskBoardPageComponent {
  spinnerTip!: string;

  isLoading = false;
  SPINNER_TIP = SPINNER_TIP;
}
