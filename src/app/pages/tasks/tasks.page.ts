import { Component, inject, signal, viewChild } from '@angular/core';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { ConfirmationDialog, trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NewTaskCardComponent } from './new-task-card/new-task-card.component';
import { MatIconModule } from '@angular/material/icon';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [MatProgressSpinnerModule, MatPaginator, NewTaskCardComponent, MatIconModule, TaskCardComponent],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export class TasksPage {
  trpc = inject(TRPC_CLIENT);
  paginator = viewChild.required(MatPaginator);


  PAGE_SIZE = 12;
  pageOffset = signal(0);
  showCreate = signal(false);
  
  taskResource = trpcResource(
    this.trpc.tasks.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  )

  async taskCreated() {
    this.showCreate.set(false);
    await this.taskResource.refresh();
  }

  handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }

  async taskDeleted(taskId: string){ // CONFIRMATJION DIALOGUE OPEN broken
    await this.trpc.tasks.deleteTask.mutate({ taskId: taskId });

    const paginator = this.paginator();
    const currentPageCount = (this.taskResource.value()?.totalCount ?? 0) - paginator.pageIndex * paginator.pageSize
    if (this.pageOffset() != 0 && currentPageCount === 1) {
      this.paginator().previousPage();
    }
  }
}
