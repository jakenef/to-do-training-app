import { Component, inject, signal } from '@angular/core';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tasks',
  imports: [MatProgressSpinnerModule, MatPaginator],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export class TasksPage {
  trpc = inject(TRPC_CLIENT);

  PAGE_SIZE = 12;
  pageOffset = signal(0);
  
  taskResource = trpcResource(
    this.trpc.tasks.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  )

  handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }
}
