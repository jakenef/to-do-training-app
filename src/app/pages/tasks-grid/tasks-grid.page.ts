import { Component, effect, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table'
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { Status } from '../../../../prisma/generated/enums';

type Task = {
  status: Status;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  completedDate: Date | null;
  ownerId: string;
}

@Component({
  selector: 'app-tasks-grid',
  imports: [MatTableModule],
  templateUrl: './tasks-grid.page.html',
  styleUrl: './tasks-grid.page.scss',
  providers: [],
})
export class TasksGridPage {
  trpc = inject(TRPC_CLIENT);

  pageOffset = signal(0);
  pageSize = 12;

  columnsToDisplay = ['taskName', 'taskDescription', 'completedDate']

  taskResource = trpcResource(this.trpc.tasks.getTasksByUser.mutate, () => ({
    pageOffset: this.pageOffset(),
    pageSize: this.pageSize,
  }));

  constructor() {
    effect(() => {
      this.taskResource.refresh()
    })
  }

  renderTaskName(task: Task) {
    return `${task.title}`
  }

  renderTaskDescription(task: Task) {
    return `${task.description}`
  }

  renderTaskCompletedDate(task: Task) {
    if (task.completedDate === null || task.completedDate === undefined) {
      return 'N/A';
    }
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedDate = formatter.format(task.completedDate);
    return `${formattedDate}`
  }
}
