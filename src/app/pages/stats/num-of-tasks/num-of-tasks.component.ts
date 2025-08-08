import { Component, inject, signal } from '@angular/core';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { trpcResource } from '@fhss-web-team/frontend-utils';

@Component({
  selector: 'app-num-of-tasks',
  imports: [MatCard, MatCardTitle, MatCardContent],
  templateUrl: './num-of-tasks.component.html',
  styleUrl: './num-of-tasks.component.scss'
})
export class NumOfTasksComponent {
  trpc = inject(TRPC_CLIENT);

  numTaskResource = trpcResource(this.trpc.tasks.getTasksByUser.mutate, () => ({
    pageOffset: 0,
    pageSize: 1000
  }))

  constructor() {
    this.numTaskResource.refresh();
  }
}