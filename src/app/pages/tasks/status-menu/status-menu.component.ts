import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { Status } from '../../../../../prisma/generated/enums';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { Task } from '../../../../../prisma/client';
import { updateTask } from '../../../../server/api/tasks/update-task/update-task';

@Component({
  selector: 'app-status-menu',
  imports: [],
  templateUrl: './status-menu.component.html',
  styleUrl: './status-menu.component.scss'
})
export class StatusMenuComponent {
  taskStatus = model.required<Status>();
  taskChanged = output();

  async setStatus(newStatus: Status){
    this.taskStatus.set(newStatus);
    this.taskChanged.emit();
  }
}
